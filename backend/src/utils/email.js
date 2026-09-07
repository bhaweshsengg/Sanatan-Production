import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

let transporter;

if (env.smtpHost) {
  transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpPort === 465,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
  });
}

export const sendEmail = async ({ to, subject, html }) => {
  if (!transporter) {
    console.log('----------------------------------------------------');
    console.log('EMAIL SIMULATION (No SMTP configured)');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`HTML: ${html}`);
    console.log('----------------------------------------------------');
    return true;
  }

  try {
    const info = await transporter.sendMail({
      from: env.smtpUser || '"Sanatan Support" <no-reply@sanatan.co.nz>',
      to,
      subject,
      html,
    });
    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
