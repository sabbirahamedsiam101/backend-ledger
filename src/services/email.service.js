// import "../config/env.js";
import nodemailer from "nodemailer";
import { env } from "../config/env.js";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: env.EMAIL_USER,
    clientId: env.CLIENT_ID,
    clientSecret: env.CLIENT_SECRET,
    refreshToken: env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend-Ledger" <${env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const sendUserRegistrationEmail = async (userEmail, userName) => {
  const subject = "Welcome to Backend-Ledger!";
  const text = `Hello ${userName},\n\nThank you for registering with Backend-Ledger. We're excited to have you on board!\n\nBest regards,\nThe Backend-Ledger Team`;
  const html = `<p>Hello ${userName},</p><p>Thank you for registering with Backend-Ledger. We're excited to have you on board!</p><p>Best regards,<br>The Backend-Ledger Team</p>`;
  await sendEmail(userEmail, subject, text, html);
};

const snedTransetionEmail = async (
  userEmail,
  name,
  ammount,
  toAccount,
  transectionDetails,
) => {
  const subject = "Transaction Notification";
  const text = `Hello ${name},\n\nA transaction of amount ${ammount} has been made to account ${toAccount}.\n\nTransaction Details: ${transectionDetails}\n\nBest regards,\nThe Backend-Ledger Team`;
  const html = `<p>Hello ${name},</p><p>A transaction of amount <strong>${ammount}</strong> has been made to account <strong>${toAccount}</strong>.</p><p>Transaction Details: ${transectionDetails}</p><p>Best regards,<br>The Backend-Ledger Team</p>`;
  await sendEmail(userEmail, subject, text, html);
};

const sendTransectionFailedEmail = async (userEmail, name, ammount, toAccount) => {
  const subject = "Transaction Failed Notification";
  const text = `Hello ${name},\n\nWe regret to inform you that a transaction of amount ${ammount} to account ${toAccount} has failed.\n\nPlease check your account and try again.\n\nBest regards,\nThe Backend-Ledger Team`;
  const html = `<p>Hello ${name},</p><p>We regret to inform you that a transaction of amount <strong>${ammount}</strong> to account <strong>${toAccount}</strong> has failed.</p><p>Please check your account and try again.</p><p>Best regards,<br>The Backend-Ledger Team</p>`;
  await sendEmail(userEmail, subject, text, html);
}
// export default sendEmail;
export default { sendUserRegistrationEmail, snedTransetionEmail };
