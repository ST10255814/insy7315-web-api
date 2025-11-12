import { Resend } from "resend";
import { createPasswordResetEmailTemplate } from "./templates/emailTemplate.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendResetPasswordEmail = async (userEmail, name, clientURL, resetToken) => {
    try {
        const data = await resend.emails.send({
            from: "RentWise Support <onboarding@resend.dev>",
            to: userEmail,
            subject: "Password Reset Request",
            html: createPasswordResetEmailTemplate(name, clientURL, resetToken)
        });
        console.log("Email sent successfully:", data);
        return data;
    } catch (error) {
        console.error("Error sending email:", error);
    }
}