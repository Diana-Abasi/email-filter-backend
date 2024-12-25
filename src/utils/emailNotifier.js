const nodemailer = require('nodemailer');

// Configure the email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use any email service like Yahoo, Outlook, etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password
  },
});

/**
 * Send an email notification
 * @param {string} to - Recipient's email address
 * @param {string} subject - Email subject
 * @param {string} message - Email body
 */
const sendNotification = async (to, subject, message) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Notification sent to ${to}`);
  } catch (err) {
    console.error('Error sending notification:', err.message);
  }
};

module.exports = sendNotification;
