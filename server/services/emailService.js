import brevoApi from "../config/email.js";
import SibApiV3Sdk from "sib-api-v3-sdk";
import { logger } from "../utils/logger.js";

export const sendContactEmail = async ({ name, email, subject, message }) => {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.to = [{ email: process.env.ADMIN_EMAIL, name: "Omkar" }];
    sendSmtpEmail.sender = {
      name: "Portfolio Contact Form",
      email: process.env.SENDER_EMAIL,
    };
    sendSmtpEmail.subject = `Portfolio: ${subject}`;
    sendSmtpEmail.replyTo = { email, name };
    sendSmtpEmail.htmlContent = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:linear-gradient(135deg,#4AA8FF,#3FE0D0);padding:30px;border-radius:12px 12px 0 0;text-align:center;">
          <h1 style="color:#0B0C10;margin:0;font-size:24px;">New Message</h1>
        </div>
        <div style="background:#15181D;padding:30px;border-radius:0 0 12px 12px;border:1px solid #2a2d35;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:12px 0;color:#9AA4B2;font-size:13px;text-transform:uppercase;letter-spacing:1px;width:100px;">From</td>
              <td style="padding:12px 0;color:#E6E8EB;font-weight:600;">${name}</td>
            </tr>
            <tr>
              <td style="padding:12px 0;color:#9AA4B2;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Email</td>
              <td style="padding:12px 0;color:#7FC8FF;"><a href="mailto:${email}" style="color:#7FC8FF;text-decoration:none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding:12px 0;color:#9AA4B2;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Subject</td>
              <td style="padding:12px 0;color:#E6E8EB;">${subject}</td>
            </tr>
            <tr>
              <td style="padding:12px 0;color:#9AA4B2;font-size:13px;text-transform:uppercase;letter-spacing:1px;vertical-align:top;">Message</td>
              <td style="padding:12px 0;color:#E6E8EB;line-height:1.7;">${message.replace(/\n/g, "<br>")}</td>
            </tr>
          </table>
        </div>
        <p style="text-align:center;color:#5B6470;font-size:12px;margin-top:20px;">Reply to: ${email}</p>
      </div>
    `;

    const result = await brevoApi.sendTransacEmail(sendSmtpEmail);
    logger.info(`✅ Notification sent to admin: ${result.messageId}`);
  } catch (error) {
    logger.error(`❌ Contact email failed: ${error.response?.text || error.message}`);
  }
};

export const sendAutoReply = async ({ name, email, replyMessage, originalMessage }) => {
  try {
    const isReply = !!replyMessage;
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.to = [{ email, name }];
    sendSmtpEmail.sender = {
      name: "Omkar Jadhav",
      email: process.env.SENDER_EMAIL,
    };
    sendSmtpEmail.subject = isReply
      ? `Re: ${originalMessage?.substring(0, 50) || "Your message"}`
      : "Thanks for reaching out!";

    sendSmtpEmail.htmlContent = isReply
      ? `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
        <div style="background:linear-gradient(135deg,#4AA8FF,#3FE0D0);padding:30px;border-radius:12px 12px 0 0;text-align:center;">
          <h1 style="color:#0B0C10;margin:0;font-size:22px;">Reply from Omkar Jadhav</h1>
        </div>
        <div style="background:#15181D;padding:30px;border-radius:0 0 12px 12px;border:1px solid #2a2d35;">
          <p style="color:#E6E8EB;font-size:15px;line-height:1.8;">${replyMessage.replace(/\n/g, "<br>")}</p>
          <hr style="border:1px solid #2a2d35;margin:20px 0;"/>
          <p style="color:#5B6470;font-size:12px;">Your original: "${originalMessage?.substring(0, 100)}..."</p>
        </div>
        <div style="text-align:center;margin-top:25px;">
          <p style="color:#E6E8EB;font-weight:600;font-size:14px;margin:0;">Omkar Jadhav</p>
          <p style="color:#5B6470;font-size:12px;margin:4px 0 0 0;">Full Stack Developer</p>
        </div>
      </div>
    `
      : `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
        <div style="background:linear-gradient(135deg,#4AA8FF,#3FE0D0);padding:40px 30px;border-radius:12px 12px 0 0;text-align:center;">
          <h1 style="color:#0B0C10;margin:0;font-size:28px;">Message Received!</h1>
          <p style="color:#0B0C10;opacity:0.7;margin-top:8px;font-size:15px;">Thank you for contacting me</p>
        </div>
        <div style="background:#15181D;padding:35px 30px;border-radius:0 0 12px 12px;border:1px solid #2a2d35;">
          <p style="color:#E6E8EB;font-size:16px;line-height:1.7;margin-top:0;">
            Hi <strong style="color:#7FC8FF;">${name}</strong>,
          </p>
          <p style="color:#9AA4B2;font-size:15px;line-height:1.7;">
            Thank you for reaching out! I've received your message and will get back to you
            within <strong style="color:#E6E8EB;">24–48 hours</strong>.
          </p>
          <p style="color:#9AA4B2;font-size:14px;margin-top:20px;">
            In the meantime, feel free to check out my
            <a href="https://github.com/Omkar200583" style="color:#4AA8FF;text-decoration:none;"> GitHub</a> or
            <a href="https://linkedin.com/in/omkar-jadhav-6915052a1" style="color:#3FE0D0;text-decoration:none;"> LinkedIn</a>.
          </p>
        </div>
        <div style="text-align:center;margin-top:30px;">
          <p style="color:#E6E8EB;font-weight:600;font-size:15px;margin:0;">Omkar Jadhav</p>
          <p style="color:#5B6470;font-size:13px;margin:4px 0 0 0;">Full Stack Developer</p>
        </div>
      </div>
    `;

    const result = await brevoApi.sendTransacEmail(sendSmtpEmail);
    logger.info(`✅ ${isReply ? "Reply" : "Auto-reply"} sent to ${email}: ${result.messageId}`);
  } catch (error) {
    logger.error(`❌ ${replyMessage ? "Reply" : "Auto-reply"} failed: ${error.response?.text || error.message}`);
  }
};