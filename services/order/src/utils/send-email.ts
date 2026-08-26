import nodemailer from "nodemailer";

import env from "../config/env.js";

/*
 * ========================================
 * Email Transporter
 * ========================================
 */

const transporter =
  nodemailer.createTransport({
    service: "gmail",

    auth: {
      user:
        env.EMAIL_USER,

      pass:
        env.EMAIL_PASSWORD,
    },
  });

/*
 * ========================================
 * Verify Email Configuration
 * ========================================
 */

transporter.verify(
  (error) => {
    if (error) {
      console.error(
        "Email configuration error",
      );

      console.error(error);
    } else {
      console.log(
        "Email service ready",
      );
    }
  },
);

/*
 * ========================================
 * Types
 * ========================================
 */

interface SendEmailOptions {
  to: string;

  subject: string;

  html: string;
}

/*
 * ========================================
 * Send Email
 * ========================================
 */

export const sendEmail =
  async ({
    to,
    subject,
    html,
  }: SendEmailOptions) => {
    await transporter.sendMail({
      from: {
        name:
          "Taksham",

        address:
          env.EMAIL_USER,
      },

      to,

      subject,

      html,
    });
  };