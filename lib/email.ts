import "server-only";
import { Resend } from "resend";

let _resend: Resend | null = null;

function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY!);
  return _resend;
}

const FROM = process.env.EMAIL_FROM ?? "LimeL8 <noreply@limel8.com>";
const BASE_URL = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

export async function sendPasswordResetEmail(email: string, token: string) {
  const url = `${BASE_URL}/reset-password?token=${token}`;

  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: "Reset your LimeL8 password",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#09090b;color:#fafafa;border-radius:12px">
        <h1 style="font-size:22px;font-weight:700;margin:0 0 8px">Reset your password</h1>
        <p style="color:#a1a1aa;margin:0 0 24px">Click the button below to choose a new password. This link expires in <strong style="color:#fafafa">1 hour</strong>.</p>
        <a href="${url}" style="display:inline-block;padding:12px 24px;background:linear-gradient(to right,#22d3ee,#a78bfa);color:#09090b;font-weight:700;border-radius:8px;text-decoration:none">Reset password</a>
        <p style="color:#52525b;font-size:12px;margin:24px 0 0">If you didn't request a password reset, you can safely ignore this email. Your password won't change.</p>
      </div>
    `,
  });
}

export async function sendVerificationEmail(email: string, token: string) {
  const url = `${BASE_URL}/api/auth/verify-email?token=${token}`;

  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: "Verify your LimeL8 email address",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#09090b;color:#fafafa;border-radius:12px">
        <h1 style="font-size:22px;font-weight:700;margin:0 0 8px">Verify your email</h1>
        <p style="color:#a1a1aa;margin:0 0 24px">Click the button below to verify your LimeL8 account. This link expires in 24 hours.</p>
        <a href="${url}" style="display:inline-block;padding:12px 24px;background:linear-gradient(to right,#22d3ee,#a78bfa);color:#09090b;font-weight:700;border-radius:8px;text-decoration:none">Verify email address</a>
        <p style="color:#52525b;font-size:12px;margin:24px 0 0">If you didn't create a LimeL8 account, you can safely ignore this email.</p>
      </div>
    `,
  });
}
