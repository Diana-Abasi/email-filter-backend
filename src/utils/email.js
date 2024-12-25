const nodemailer = require('nodemailer');

// Configure the transporter (use your email service credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail', // Replace with your email service (e.g., Gmail, Outlook)
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

// Function to send an email
const sendEmail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
    console.log('Email sent:', info.response);
  } catch (err) {
    console.error('Error sending email:', err.message);
  }
};

module.exports = { sendEmail };
