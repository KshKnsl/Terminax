export class EmailTemplate {
  private baseStyle: string = `
    body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #4B5563; background-color: #FFFBEB; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    h1 { color: #D97706; font-size: 24px; font-weight: bold; }
    .cta-button { display: inline-block; padding: 10px 20px; background-color: #F59E0B; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; }
    .cta-button:hover { background-color: #D97706; }
    .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #F59E0B; font-size: 12px; color: #78350F; }
  `;

  constructor(
    private name: string,
    private purpose: string,
    private message?: string
  ) {}

  getContent() {
    let content: string;
    let subject: string;

    switch (this.purpose) {
      case "CreateAccount":
        subject = "Welcome to Terminax - Your Development Journey Begins!";
        content = `
          <html>
            <head>
              <style>\${this.baseStyle}</style>
            </head>
            <body>
              <div class="container">
                <h1>Welcome to Terminax, \${this.name}!</h1>
                <p>We're thrilled to have you join our community of developers.</p>
                <p>With Terminax, you can:</p>
                <ul>
                  <li>Manage your projects efficiently</li>
                  <li>Collaborate with your team</li>
                  <li>Track your development progress</li>
                  <li>Share your work and insights</li>
                  <li>Connect with fellow developers</li>
                  <li>Access powerful development tools</li>
                </ul>
                <p>Ready to dive in? Click the button below to start exploring:</p>
                <p><a href="https://terminax.vercel.app" class="cta-button">Start Exploring</a></p>
                <p>If you have any questions, our support team is always here to help.</p>
                <div class="footer">
                  <p>Happy Coding!</p>
                  <p>The Terminax Team</p>
                </div>
              </div>
            </body>
          </html>
        `;
        break;

      case "Login":
        subject = "Welcome Back to Terminax!";
        content = `
          <html>
            <head>
              <style>\${this.baseStyle}</style>
            </head>
            <body>
              <div class="container">
                <h1>Welcome back, \${this.name}!</h1>
                <p>We're glad to see you again on Terminax. Your development journey continues!</p>
                <p>Here's what's new since your last visit:</p>
                <ul>
                  <li>Latest project updates and commits</li>
                  <li>Recent team activity</li>
                  <li>New features and tools available</li>
                  <li>Personalized development insights</li>
                </ul>
                <p><a href="https://terminax.vercel.app/dashboard" class="cta-button">Go to Dashboard</a></p>
                <div class="footer">
                  <p>Happy Coding!</p>
                  <p>The Terminax Team</p>
                </div>
              </div>
            </body>
          </html>
        `;
        break;

      default:
        subject = "Notification from Terminax";
        content = `
          <html>
            <head>
              <style>\${this.baseStyle}</style>
            </head>
            <body>
              <div class="container">
                <h1>Hello, \${this.name}!</h1>
                <p>\${this.message}</p>
                <p>If you have any questions, please don't hesitate to reach out to our support team.</p>
                <div class="footer">
                  <p>Happy Coding!</p>
                  <p>The Terminax Team</p>
                </div>
              </div>
            </body>
          </html>
        `;
    }

    return { subject, content };
  }
}
