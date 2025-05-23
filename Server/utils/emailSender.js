const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('Email Host:', process.env.EMAIL_HOST);
console.log('Email Port:', process.env.EMAIL_PORT);
console.log('Email Secure:', process.env.EMAIL_SECURE);
console.log('Email User:', process.env.EMAIL_USER ? 'Exists' : 'Missing');
console.log('Email Pass:', process.env.EMAIL_PASS ? 'Exists' : 'Missing');
console.log('Email From:', process.env.EMAIL_FROM);

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  debug: true, // Enable debug output from Nodemailer
  logger: true // Log to console
});

transporter.verify(function (error, success) {
  if (error) {
    console.error('Transporter verification failed:', error);
  } else {
    console.log('Transporter is configured correctly and ready to send emails.');
  }
});

const sendEmail = async (to, subject, text, html) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM, // Sender address
    to: to,                      // List of receivers
    subject: subject,            // Subject line
    text: text,                 
    html: html,                 
  };

  console.log('Attempting to send email with options:', JSON.stringify(mailOptions, null, 2));

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    console.log('Full response from mail server:', info);
    return info;
  } catch (error) {
    console.error('Error sending email via Nodemailer:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error response:', error.response);
    console.error('Error responseCode:', error.responseCode);
    throw new Error(`Failed to send email. Nodemailer error: ${error.message}`); 
  }
};

module.exports = sendEmail;
