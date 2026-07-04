import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.EMAIL_FROM || "Mobile Shop OS <noreply@mobileshopos.com>";

const isDev = process.env.NODE_ENV !== "production";

export async function sendVerificationEmail(
  email: string,
  code: string,
  type: "SIGNUP" | "RESET"
): Promise<{ success: boolean; fallbackCode?: string; error?: string }> {
  const subject =
    type === "SIGNUP"
      ? "Verify your email - Mobile Shop OS"
      : "Reset your password - Mobile Shop OS";

  const heading =
    type === "SIGNUP" ? "Welcome to Mobile Shop OS!" : "Password Reset Request";

  const body =
    type === "SIGNUP"
      ? "Use the code below to verify your email and create your account."
      : "Use the code below to reset your password. This code will expire in 15 minutes.";

  if (!resend) {
    console.log("===============================");
    console.log("DEV/FALLBACK OTP CODE:", code);
    console.log("Email:", email, "| Type:", type);
    console.log("===============================");
    return { success: true, fallbackCode: code };
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject,
      html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:480px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#0f172a,#1e3a5f);padding:32px 24px;text-align:center;">
      <h1 style="color:#ffffff;font-size:20px;margin:0;font-weight:700;">Mobile Shop OS</h1>
      <p style="color:#94a3b8;font-size:13px;margin:6px 0 0;">Cloud Platform</p>
    </div>
    <div style="padding:32px 24px;">
      <h2 style="color:#0f172a;font-size:18px;margin:0 0 12px;text-align:center;">${heading}</h2>
      <p style="color:#64748b;font-size:14px;line-height:1.6;margin:0 0 24px;text-align:center;">${body}</p>
      <div style="background:#f8fafc;border:2px dashed #cbd5e1;border-radius:12px;padding:20px;text-align:center;margin:0 0 24px;">
        <p style="color:#94a3b8;font-size:12px;margin:0 0 8px;text-transform:uppercase;letter-spacing:2px;">Your Verification Code</p>
        <p style="color:#0f172a;font-size:32px;font-weight:800;letter-spacing:6px;margin:0;">${code}</p>
      </div>
      <p style="color:#94a3b8;font-size:12px;text-align:center;margin:0;">This code expires in 15 minutes. If you did not request this, please ignore this email.</p>
    </div>
    <div style="background:#f8fafc;padding:16px 24px;text-align:center;border-top:1px solid #e2e8f0;">
      <p style="color:#94a3b8;font-size:11px;margin:0;">&copy; ${new Date().getFullYear()} Mobile Shop OS. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`,
    });

    return { success: true };
  } catch (error) {
    console.error("[sendVerificationEmail] Resend API error:", error);
    console.log("===============================");
    console.log("FALLBACK OTP CODE (email delivery failed):", code);
    console.log("Email:", email, "| Type:", type);
    console.log("===============================");
    return { success: true, fallbackCode: code };
  }
}
