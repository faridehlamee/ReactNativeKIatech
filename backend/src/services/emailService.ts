import nodemailer, { Transporter } from 'nodemailer';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  tls?: {
    rejectUnauthorized: boolean;
  };
}

class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = this.createTransporter();
  }

  private createTransporter(): Transporter {
    // Use your existing SMTP configuration from .env
    const config: EmailConfig = {
      host: process.env.SMTP_HOST || process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || '587'),
      secure: false, // Use TLS instead of SSL
      auth: {
        user: process.env.SMTP_USER || process.env.EMAIL_USER || '',
        pass: process.env.SMTP_PASS || process.env.EMAIL_PASS || '',
      },
      tls: {
        rejectUnauthorized: false
      }
    };

    return nodemailer.createTransport(config);
  }

  async sendPasswordResetEmail(
    email: string,
    resetURL: string,
    userName: string
  ): Promise<boolean> {
    try {
      const mailOptions = {
        from: {
          name: 'Kiatech Software',
          address: process.env.SMTP_USER || process.env.EMAIL_USER || 'noreply@kiatech.com',
        },
        to: email,
        subject: 'Reset Your Password - Kiatech Software',
        html: this.getPasswordResetHTML(resetURL, userName),
        text: this.getPasswordResetText(resetURL, userName),
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Password reset email sent:', result.messageId);
      return true;
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      return false;
    }
  }

  private getPasswordResetHTML(resetURL: string, userName: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f5f5f5;
            }
            .container {
              background: white;
              border-radius: 12px;
              padding: 40px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #007AFF;
              margin-bottom: 10px;
            }
            .title {
              font-size: 28px;
              font-weight: bold;
              color: #333;
              margin-bottom: 10px;
            }
            .subtitle {
              color: #666;
              font-size: 16px;
            }
            .content {
              margin-bottom: 30px;
            }
            .button {
              display: inline-block;
              background-color: #007AFF;
              color: white;
              padding: 16px 32px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              font-size: 16px;
              text-align: center;
              margin: 20px 0;
            }
            .button:hover {
              background-color: #0056b3;
            }
            .warning {
              background-color: #fff3cd;
              border: 1px solid #ffeaa7;
              border-radius: 8px;
              padding: 15px;
              margin: 20px 0;
              color: #856404;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Kiatech Software</div>
              <h1 class="title">Reset Your Password</h1>
              <p class="subtitle">You requested to reset your password</p>
            </div>
            
            <div class="content">
              <p>Hello ${userName},</p>
              
              <p>We received a request to reset your password for your Kiatech Software account. If you made this request, click the button below to reset your password:</p>
              
              <div style="text-align: center;">
                <a href="${resetURL}" class="button">Reset My Password</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 4px; font-family: monospace;">
                ${resetURL}
              </p>
              
              <div class="warning">
                <strong>⚠️ Important:</strong> This link will expire in 10 minutes for security reasons. If you didn't request this password reset, you can safely ignore this email.
              </div>
            </div>
            
            <div class="footer">
              <p>This email was sent by Kiatech Software</p>
              <p>If you have any questions, please contact our support team.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private getPasswordResetText(resetURL: string, userName: string): string {
    return `
Reset Your Password - Kiatech Software

Hello ${userName},

We received a request to reset your password for your Kiatech Software account.

To reset your password, please click the following link:
${resetURL}

This link will expire in 10 minutes for security reasons.

If you didn't request this password reset, you can safely ignore this email.

Best regards,
Kiatech Software Team
    `;
  }

  // Test email connection
  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('Email service connection successful');
      return true;
    } catch (error) {
      console.error('Email service connection failed:', error);
      return false;
    }
  }
}

export default new EmailService();
