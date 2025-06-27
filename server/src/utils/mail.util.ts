import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { EmailTemplate } from "./emailTemplates";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAILPASSWORD,
  },
});

type EmailOptions = {
  name: string;
  toEmail: string;
  purpose: "CreateAccount" | "Login" | string;
  message?: string;
};

async function sendMail(
  name: string,
  toEmail: string,
  purpose: string,
  message?: string
): Promise<void> {
  const emailTemplate = new EmailTemplate(name, purpose, message);
  const { subject, content } = emailTemplate.getContent();

  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: toEmail,
      subject: subject,
      html: content,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Failed to send email");
  }
}

export { sendMail, EmailOptions };
