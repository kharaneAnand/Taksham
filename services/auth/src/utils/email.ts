import nodemailer from "nodemailer";
import env from "../config/env.js";

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASSWORD,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error(" Email configuration error");
    console.error(error);
  } else {
    console.log("Email service ready");
  }
});

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({
  to,
  subject,
  html,
}: SendEmailOptions) => {
  await transporter.sendMail({
    from: env.EMAIL_USER,
    to,
    subject,
    html,
  });
};