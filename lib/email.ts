import nodemailer from "nodemailer"


const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST || 'smtp.gmail.com',
	port: Number.parseInt(process.env.SMTP_PORT || '587'),
	secure: false, 
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
});

export async function sendVerificationEmail(email: string, code: string, username: string) {
  const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification - SDFM</title>
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
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo {
                font-size: 32px;
                font-weight: bold;
                color: #000;
                margin-bottom: 10px;
            }
            .title {
                font-size: 24px;
                font-weight: 600;
                color: #333;
                margin-bottom: 20px;
            }
            .code-container {
                background: #f8f9fa;
                border: 2px dashed #dee2e6;
                border-radius: 8px;
                padding: 20px;
                text-align: center;
                margin: 30px 0;
            }
            .verification-code {
                font-size: 36px;
                font-weight: bold;
                color: #000;
                letter-spacing: 8px;
                font-family: 'Courier New', monospace;
            }
            .message {
                font-size: 16px;
                color: #666;
                margin-bottom: 20px;
            }
            .warning {
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 6px;
                padding: 15px;
                margin: 20px 0;
                color: #856404;
            }
            .footer {
                text-align: center;
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                color: #999;
                font-size: 14px;
            }
            .button {
                display: inline-block;
                background: #000;
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 500;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">SDFM</div>
                <h1 class="title">Email Verification</h1>
            </div>
            
            <p class="message">
                Hello <strong>${username}</strong>,
            </p>
            
            <p class="message">
                Thank you for registering with SDFM! To complete your registration and secure your account, 
                please verify your email address using the verification code below:
            </p>
            
            <div class="code-container">
                <div class="verification-code">${code}</div>
            </div>
            
            <p class="message">
                Enter this code in the verification form to activate your account. 
                This code will expire in <strong>10 minutes</strong> for security reasons.
            </p>
            
            <div class="warning">
                <strong>Security Notice:</strong> If you didn't request this verification, 
                please ignore this email. Never share this code with anyone.
            </div>
            
            <p class="message">
                If you have any questions or need assistance, feel free to contact our support team.
            </p>
            
            <div class="footer">
                <p>
                    This email was sent by SDFM<br>
                    © 2024 SDFM. All rights reserved.
                </p>
                <p>
                    This is an automated message, please do not reply to this email.
                </p>
            </div>
        </div>
    </body>
    </html>
  `

  const textTemplate = `
    SDFM - Email Verification
    
    Hello ${username},
    
    Thank you for registering with SDFM! 
    
    Your verification code is: ${code}
    
    Enter this code in the verification form to activate your account.
    This code will expire in 10 minutes for security reasons.
    
    If you didn't request this verification, please ignore this email.
    
    Best regards,
    SDFM Team
    
    © 2024 SDFM. All rights reserved.
  `

  try {
    await transporter.sendMail({
      from: `"SDFM" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verify your email address - SDFM",
      text: textTemplate,
      html: htmlTemplate,
    })

    return { success: true }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, error: "Failed to send verification email" }
  }
}

export function generateVerificationCode(): string {
  return Math.random().toString().slice(2, 8).padStart(6, "0")
}
