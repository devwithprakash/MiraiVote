import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendMail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
    to,
    subject,
    html,
  });
};

const sendVerificationEmail = async (email, token) => {
  const url = `${process.env.CLIENT_URL}/verify-email/${token}`;

  await sendMail(
    email,
    "Verify your email",
    `<h2>Welcome!</h2>
     <p>Click <a href="${url}">here</a> to verify your email.</p>`,
  );
};

const sendResetPasswordEmail = async (email, token) => {
  const url = `${process.env.CLIENT_URL}/reset-password/${token}`;

  await sendMail(
    email,
    "Reset your password",
    `<h2>Password Reset</h2>
     <p>Click <a href="${url}">here</a> to reset your password.
     This link expires in 15 minutes.</p>`,
  );
};

export { sendResetPasswordEmail, sendVerificationEmail };
