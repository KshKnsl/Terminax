import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAILPASSWORD,
  },
});

interface EmailOptions {
  name: string;
  toEmail: string;
  purpose: 'CreateAccount' | 'Login' | string;
  message?: string;
}

async function sendMail(name: string, toEmail: string, purpose: string, message?: string): Promise<void> {
  let content: string = "";
  let subject: string = "";
  const baseStyle: string = `
    body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #4B5563; background-color: #FFFBEB; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    h1 { color: #D97706; font-size: 24px; font-weight: bold; }
    .cta-button { display: inline-block; padding: 10px 20px; background-color: #F59E0B; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; }
    .cta-button:hover { background-color: #D97706; }
    .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #F59E0B; font-size: 12px; color: #78350F; }
  `;

  switch (purpose) 
  {
    case "CreateAccount":
      subject = "Welcome to ReadMates - Your Literary Journey Begins!";
      content = `
        <html>
          <head>
            <style>${baseStyle}</style>
          </head>
          <body>
            <div class="container">
              <h1>Welcome to ReadMates, ${name}!</h1>
              <p>We're thrilled to have you join our community of book lovers and writers.</p>
              <p>With ReadMates, you can:</p>
              <ul>
                <li>Read together</li>
                <li>Create together</li>
                <li>Track your reading progress</li>
                <li>Share your thoughts and reviews</li>
                <li>Connect with fellow readers and authors</li>
                <li>Discover exciting new books and articles</li>
              </ul>
              <p>Ready to dive in? Click the button below to start exploring:</p>
              <p><a href="https://readmates.vercel.app" class="cta-button">Start Exploring</a></p>
              <p>If you have any questions, our support team is always here to help.</p>
              <div class="footer">
                <p>Happy Reading!</p>
                <p>The ReadMates Team</p>
              </div>
            </div>
          </body>
        </html>
      `;
      break;

    case "Login":
      subject = "Welcome Back to ReadMates!";
      content = `
        <html>
          <head>
            <style>${baseStyle}</style>
          </head>
          <body>
            <div class="container">
              <h1>Welcome back, ${name}!</h1>
              <p>We're glad to see you again on ReadMates. Your literary adventure continues!</p>
              <p>Here's what's new since your last visit:</p>
              <ul>
                <li>5 new article recommendations based on your reading history</li>
                <li>3 discussions in your favorite genres</li>
                <li>New feature:
              </div>
            </div>
          </body>
        </html>
      `;
      break;

    default:
      subject = "Welcome to ReadMates";
      content = `
        <html>
          <head>
            <style>${baseStyle}</style>
          </head>
          <body>
            <div class="container">
              <h1>Hello, ${name}!</h1>
              <p>${message}</p>
              <p>If you have any questions, please don't hesitate to reach out to our support team.</p>
              <div class="footer">
                <p>Happy Reading!</p>
                <p>The ReadMates Team</p>
              </div>
            </div>
          </body>
        </html>
      `;
  }
  try {
    let info = await transporter.sendMail({
      from: process.env.EMAIL,
      to: toEmail,
      subject: "ReadMates: " + purpose,
      html: content,
    });
  } catch (error) {  }
}


module.exports = { sendMail };