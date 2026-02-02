import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

 async sendResetPasswordEmail(email: string, resetLink: string) {
  try {
    await this.transporter.sendMail({
      from: `"Expense Tracker 💙" <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Expense Tracker - Reset Your Password',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #d3e8f7; border-radius: 10px; background-color: #f7faff;">
          <h2 style="color: #1565c0; text-align: center;">Expense Tracker</h2>
          <p style="font-size: 16px;">Hello,</p>
          <p style="font-size: 16px;">We received a request to reset your password for your <b>Expense Tracker</b> account.</p>
          <p style="font-size: 16px;">Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${resetLink}" target="_blank" style="text-decoration: none; background-color: #1565c0; color: #fff; padding: 12px 24px; border-radius: 6px; font-weight: 600;">Reset Password</a>
          </div>
          <p style="font-size: 14px; color: #555;">This link is valid for <b>15 minutes</b>.</p>
          <p style="font-size: 14px; color: #555;">If you did not request a password reset, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #d3e8f7; margin: 20px 0;">
          <p style="font-size: 12px; color: #888; text-align: center;">&copy; ${new Date().getFullYear()} Expense Tracker. All rights reserved.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error(error);
    throw new InternalServerErrorException('Failed to send reset password email');
  }
}

}
