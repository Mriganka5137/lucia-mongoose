import { lucia } from "@/lib/auth";
import { IOauthAccount, OAuthAccount } from "@/lib/models/oauth-account.model";
import { User } from "@/lib/models/user.model";
import { github } from "@/lib/oauth";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code || !state) {
      return new Response("Invalid request", { status: 400 });
    }

    const savedState = cookies().get("state")?.value;

    //    if there is no code verifier or saved state, return an error
    if (!savedState) {
      return new Response("Code verifier or saved state is not exists", {
        status: 400,
      });
    }

    //    if the state does not match, return an error
    if (savedState !== state) {
      return Response.json(
        {
          error: "State does not match",
        },
        {
          status: 400,
        }
      );
    }

    const { accessToken } = await github.validateAuthorizationCode(code);

    const githubRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: "GET",
    });

    const githubData = await githubRes.json();
    const mongoSession = await mongoose.startSession();
    let userForSession = null;

    try {
      mongoSession.startTransaction();
      const user = await User.findOne({ email: githubData.email }, null, {
        session: mongoSession,
      });

      if (!user) {
        const createdUser = await User.create(
          [
            {
              email: githubData.email,
              name: githubData.name,
              profilePictureUrl: githubData.avatar_url,
              emailVerified: true,
            },
          ],
          { session: mongoSession }
        );

        userForSession = createdUser[0]._id;
        const oauthAccountData: IOauthAccount = {
          userId: createdUser[0]._id,
          email: githubData.email,
          provider: "github",
          providerUserId: githubData.id,
          accessToken,
        };

        const createdOAuthAccount = await OAuthAccount.create(
          [oauthAccountData],
          { session: mongoSession }
        );
      } else {
        userForSession = user._id;
        user.name = githubData.name;
        user.profilePictureUrl = githubData.avatar_url;
        await user.save({ session: mongoSession });

        const existingOAuthAccount = await OAuthAccount.findOne(
          { userId: user._id, provider: "github" },
          null,
          { session: mongoSession }
        );
        if (!existingOAuthAccount) {
          const oauthAccountData: IOauthAccount = {
            userId: user._id,
            email: githubData.email,
            provider: "github",
            providerUserId: githubData.id,
            accessToken,
          };
          const createdOAuthAccount = await OAuthAccount.create(
            [oauthAccountData],
            { session: mongoSession }
          );
        } else {
          const updatedOAuthAccount = await OAuthAccount.updateOne(
            { userId: user._id, provider: "github" },
            {
              $set: {
                accessToken,
              },
            },
            { session: mongoSession }
          );
        }
      }

      await mongoSession.commitTransaction();
      const session = await lucia.createSession(userForSession, {});
      const sessionCookie = lucia.createSessionCookie(session.id);

      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );

      cookies().set("state", "", {
        expires: new Date(0),
      });

      return NextResponse.redirect(
        new URL("/dashboard", process.env.NEXT_PUBLIC_BASE_URL),
        {
          status: 302,
        }
      );
    } catch (err) {
      await mongoSession.abortTransaction();
      console.log("Error in transaction", err);
      throw err;
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
