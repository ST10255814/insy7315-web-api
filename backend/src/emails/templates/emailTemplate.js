export function createPasswordResetEmailTemplate(name, clientURL) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset Request</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1F2937; margin: 0; padding: 0; background-color: #EFF6FF;">
    <div style="background: #2563EB; padding: 50px 20px; text-align: center; border-radius: 12px 12px 0 0;">
      <div style="display: inline-block; background: #ffffff; border-radius: 50%; padding: 20px; box-shadow: 0 6px 15px rgba(0,0,0,0.1);">
        <img src="https://cdn-icons-png.flaticon.com/512/565/565547.png" alt="Lock Icon" style="width: 80px; height: 80px; display: block; margin: auto;" />
      </div>
      <h1 style="color: #ffffff; margin-top: 25px; font-size: 28px; font-weight: 700;">Reset Your Password</h1>
    </div>
    <div style="background-color: #ffffff; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 6px 25px rgba(0,0,0,0.05); line-height: 1.6;">
      <p style="font-size: 18px; color: #2563EB; font-weight: 600; margin-bottom: 15px;">Hello ${name},</p>
      <p style="margin-bottom: 25px;">We received a request to reset your password for your RentWise account. If you made this request, click the button below to choose a new password.</p>
      <div style="text-align: center; margin: 35px 0;">
        <a href="${clientURL}" style="
          background-color: #2563EB;
          color: #ffffff;
          text-decoration: none;
          padding: 16px 45px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          display: inline-block;
          box-shadow: 0 6px 18px rgba(29,78,216,0.3);
          transition: all 0.2s ease-in-out;
        ">
          Reset Password
        </a>
      </div>
      <p>If you didn’t request a password reset, you can safely ignore this email — your password will remain unchanged.</p>
      <div style="margin-top: 30px; font-size: 14px; color: #555;">
        <p style="margin-bottom: 5px;">This link will expire in <strong>1 hour</strong> for security reasons.</p>
        <p style="margin-bottom: 5px;">If you’re having trouble, copy and paste this link into your browser:</p>
        <div style="background: #EFF6FF; padding: 12px; border-radius: 8px; color: #1D4ED8; word-wrap: break-word; font-size: 13px;">
          ${clientURL}
        </div>
      </div>
      <p style="margin-top: 35px; margin-bottom: 0; font-size: 15px;">Best regards,<br><strong>RentWise Support</strong></p>
    </div>
    <div style="text-align: center; padding: 30px; color: #FFFFFF; font-size: 12px; background: #2563EB; border-radius: 0 0 12px 12px;">
      <p style="margin: 0 0 10px;">© 2025 RentWise. All rights reserved.</p>
      <p style="margin: 0;">
        <a href="#" style="color: #FFFFFF; text-decoration: none; margin: 0 10px; font-weight: 500;">Privacy Policy</a> |
        <a href="#" style="color: #FFFFFF; text-decoration: none; margin: 0 10px; font-weight: 500;">Terms of Service</a> |
        <a href="#" style="color: #FFFFFF; text-decoration: none; margin: 0 10px; font-weight: 500;">Help Center</a>
      </p>
    </div>
  </body>
  </html>
  `;
}
