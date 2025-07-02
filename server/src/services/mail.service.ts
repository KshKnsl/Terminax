import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { EmailTemplate } from "../utils/emailTemplates";

dotenv.config();

export class MailService {
  private static transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAILPASSWORD,
    },
  });

  static async sendMail(
    name: string,
    toEmail: string,
    purpose: string,
    message?: string
  ): Promise<void> {
    const template = new EmailTemplate(name, purpose, message);
    const { subject, content } = template.getContent();

    await this.transporter.sendMail({
      from: process.env.EMAIL,
      to: toEmail,
      subject: "ReadMates: " + purpose,
      html: content,
    });
  }
}
