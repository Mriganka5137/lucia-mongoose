import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_BASE_URL;

// Send verification email
export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "mail@mrigankagogoi.com",
    to: email,
    subject: "Verify your email address",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
  });
};

// Send password reset email
export const sendPasswordResetmail = async (email: string, token: string) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "mail@mrigankagogoi.com",
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });
};

// Send two factor token
export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "mail@mrigankagogoi.com",
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA code is: ${token}</p>`,
  });
};
