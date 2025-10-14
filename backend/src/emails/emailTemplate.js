export function createPasswordResetEmailTemplate(name, clientURL) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset Request</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f7fa;">
    <div style="background: linear-gradient(to right, #36D1DC, #5B86E5); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
      <img src="https://cdn-icons-png.flaticon.com/512/565/565547.png" alt="Lock Icon" style="width: 70px; height: 70px; margin-bottom: 15px; background-color: white; border-radius: 50%; padding: 10px;">
      <h1 style="color: white; margin: 0; font-size: 26px; font-weight: 500;">Reset Your Password</h1>
    </div>
    <div style="background-color: #ffffff; padding: 35px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
      <p style="font-size: 18px; color: #5B86E5;"><strong>Hello ${name},</strong></p>
      <p>We received a request to reset your password for your account. If you made this request, click the button below to choose a new password.</p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${clientURL}" 
           style="background: linear-gradient(to right, #36D1DC, #5B86E5); 
                  color: white; 
                  text-decoration: none; 
                  padding: 14px 40px; 
                  border-radius: 50px; 
                  font-weight: 600; 
                  font-size: 16px; 
                  display: inline-block;">
          Reset Password
        </a>
      </div>

      <p>If you didn’t request a password reset, you can safely ignore this email—your password will remain unchanged.</p>

      <div style="margin-top: 30px; font-size: 14px; color: #777;">
        <p>This link will expire in 1 hour for security reasons.</p>
        <p>If you’re having trouble, copy and paste the link below into your browser:</p>
        <p style="word-wrap: break-word; color: #5B86E5;">${clientURL}</p>
      </div>

      <p style="margin-top: 35px; margin-bottom: 0;">Best regards,<br>The Messenger Security Team</p>
    </div>
    <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
      <p>© 2025 Messenger. All rights reserved.</p>
      <p>
        <a href="#" style="color: #5B86E5; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
        <a href="#" style="color: #5B86E5; text-decoration: none; margin: 0 10px;">Terms of Service</a>
        <a href="#" style="color: #5B86E5; text-decoration: none; margin: 0 10px;">Help Center</a>
      </p>
    </div>

  </body>
  </html>
  `;
}
