import nodemailer from "nodemailer";

export function getTransporter(): nodemailer.Transporter | null {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!user || !pass) return null;
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: { user, pass },
  });
}

function waitForSendMail(
  transporter: nodemailer.Transporter,
  mailOptions: nodemailer.SendMailOptions,
  timeoutMs = 15000
): Promise<nodemailer.SentMessageInfo> {
  return new Promise((resolve, reject) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        reject(new Error(`SMTP timeout after ${timeoutMs}ms`));
      }
    }, timeoutMs);
    transporter.sendMail(mailOptions, (err, info) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (err) reject(err);
      else resolve(info);
    });
  });
}

export async function sendVerificationEmail(
  email: string,
  code: string,
  type: "SIGNUP" | "RESET"
): Promise<{ success: boolean; fallbackCode?: string; devMode?: boolean }> {
  const transporter = getTransporter();
  const sender = process.env.EMAIL_USER;

  console.log("SENDING OTP CODE:", code);

  if (!transporter || !sender) {
    console.log("=============================================");
    console.log("GMAIL SMTP NOT CONFIGURED — DEV FALLBACK MODE");
    console.log("OTP CODE:", code);
    console.log("Email:", email, "| Type:", type);
    console.log("Set EMAIL_USER & EMAIL_PASS in .env for live email");
    console.log("=============================================");
    return { success: true, fallbackCode: code, devMode: true };
  }

  const subject =
    type === "SIGNUP"
      ? "Your AIOMS POS Verification Code"
      : "Reset your password - AIOMS POS";

  const heading =
    type === "SIGNUP" ? "Welcome to AIOMS POS!" : "Password Reset Request";

  const body =
    type === "SIGNUP"
      ? "Use the code below to verify your email and create your account."
      : "Use the code below to reset your password. This code will expire in 10 minutes.";

  try {
    await waitForSendMail(transporter, {
      from: `"AIOMS POS" <${sender}>`,
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
      <h1 style="color:#ffffff;font-size:20px;margin:0;font-weight:700;">AIOMS POS</h1>
      <p style="color:#94a3b8;font-size:13px;margin:6px 0 0;">All In One Mobile Shop</p>
    </div>
    <div style="padding:32px 24px;">
      <h2 style="color:#0f172a;font-size:18px;margin:0 0 12px;text-align:center;">${heading}</h2>
      <p style="color:#64748b;font-size:14px;line-height:1.6;margin:0 0 24px;text-align:center;">${body}</p>
      <div style="background:#f8fafc;border:2px dashed #cbd5e1;border-radius:12px;padding:20px;text-align:center;margin:0 0 24px;">
        <p style="color:#94a3b8;font-size:12px;margin:0 0 8px;text-transform:uppercase;letter-spacing:2px;">Your Verification Code</p>
        <p style="color:#0f172a;font-size:32px;font-weight:800;letter-spacing:6px;margin:0;">${code}</p>
      </div>
      <p style="color:#94a3b8;font-size:12px;text-align:center;margin:0;">This code expires in 10 minutes. Do not share this code with anyone.</p>
    </div>
    <div style="background:#f8fafc;padding:16px 24px;text-align:center;border-top:1px solid #e2e8f0;">
      <p style="color:#94a3b8;font-size:11px;margin:0;">&copy; ${new Date().getFullYear()} AIOMS. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`,
    });

    console.log("[sendVerificationEmail] Email sent successfully to", email);
    return { success: true };
  } catch (error) {
    console.error("[sendVerificationEmail] SMTP error:", error);
    console.log("=============================================");
    console.log("FALLBACK OTP CODE (email delivery failed):", code);
    console.log("Email:", email, "| Type:", type);
    console.log("=============================================");
    return { success: true, fallbackCode: code, devMode: true };
  }
}
