const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.ethereal.email",
    port: parseInt(process.env.SMTP_PORT || "587"),
    auth: {
        user: process.env.SMTP_USER || "",
        pass: process.env.SMTP_PASS || "",
    },
});

const sendPasswordResetEmail = async (email, name, resetUrl) => {
    const mailOptions = {
        from: `"KESTREL Platform" <${process.env.SMTP_FROM || "noreply@kestrel.io"}>`,
        to: email,
        subject: "Password Reset Request – KESTREL",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8faf9; padding: 40px;">
        <div style="background: #1a4731; color: white; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">🦅 KESTREL</h1>
          <p style="margin: 4px 0 0; opacity: 0.8; font-size: 12px;">Biodiversity Monitoring Platform</p>
        </div>
        <div style="background: white; padding: 32px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
          <h2 style="color: #1f2937; margin-top: 0;">Password Reset</h2>
          <p style="color: #4b5563;">Hello ${name},</p>
          <p style="color: #4b5563;">We received a request to reset your password. Click the button below to set a new password. This link expires in <strong>1 hour</strong>.</p>
          <a href="${resetUrl}" style="display: inline-block; background: #1a4731; color: white; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: 600; margin: 16px 0;">Reset Password</a>
          <p style="color: #9ca3af; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      </div>
    `,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendPasswordResetEmail };
