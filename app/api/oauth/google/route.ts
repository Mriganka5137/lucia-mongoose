import { lucia } from "@/lib/auth";
import { IOauthAccount, OAuthAccount } from "@/lib/models/oauth-account.model";
import { User } from "@/lib/models/user.model";
import { google } from "@/lib/oauth";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface GoogleUser {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  picture: string;
  locale: string;
}

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code || !state) {
      return new Response("Invalid request", { status: 400 });
    }

    const codeVerifier = cookies().get("codeVerifier")?.value;
    const savedState = cookies().get("state")?.value;

    //    if there is no code verifier or saved state, return an error
    if (!codeVerifier || !savedState) {
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

    const { accessToken, idToken, refreshToken, accessTokenExpiresAt } =
      await google.validateAuthorizationCode(code, codeVerifier);

    const googleRes = await fetch(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        method: "GET",
      }
    );

    const googleData = (await googleRes.json()) as GoogleUser;
    const mongoSession = await mongoose.startSession();
    let userForSession = null;

    try {
      mongoSession.startTransaction();
      const user = await User.findOne({ email: googleData.email }, null, {
        session: mongoSession,
      });

      if (!user) {
        const createdUser = await User.create(
          [
            {
              email: googleData.email,
              name: googleData.name,
              profilePictureUrl: googleData.picture,
              emailVerified: true,
            },
          ],
          { session: mongoSession }
        );

        userForSession = createdUser[0]._id;
        const oauthAccountData: IOauthAccount = {
          userId: createdUser[0]._id,
          email: googleData.email,
          provider: "google",
          providerUserId: googleData.id,
          accessToken,
          refreshToken,
          expires_at: accessTokenExpiresAt,
        };

        const createdOAuthAccount = await OAuthAccount.create(
          [oauthAccountData],
          { session: mongoSession }
        );
      } else {
        userForSession = user._id;
        user.name = googleData.name;
        user.profilePictureUrl = googleData.picture;
        await user.save({ session: mongoSession });

        const existingOAuthAccount = await OAuthAccount.findOne(
          { userId: user._id, provider: "google" },
          null,
          { session: mongoSession }
        );
        if (!existingOAuthAccount) {
          const oauthAccountData: IOauthAccount = {
            userId: user._id,
            email: googleData.email,
            provider: "google",
            providerUserId: googleData.id,
            accessToken,
            refreshToken,
            expires_at: accessTokenExpiresAt,
          };
          const createdOAuthAccount = await OAuthAccount.create(
            [oauthAccountData],
            { session: mongoSession }
          );
        } else {
          const updatedOAuthAccount = await OAuthAccount.updateOne(
            { userId: user._id, provider: "google" },
            {
              $set: {
                accessToken,
                refreshToken,
                expires_at: accessTokenExpiresAt,
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
      cookies().set("codeVerifier", "", {
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
