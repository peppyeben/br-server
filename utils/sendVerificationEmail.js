const nodemailer = require("nodemailer");

// Create a nodemailer transporter with your email service credentials
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.MY_EMAIL,
    pass: process.env.MY_PASS,
  },
});

// Function to send verification email
async function sendVerificationEmail(email, verificationToken) {
  try {
    // Create email message
    const mailOptions = {
      from: process.env.MY_EMAIL, // Sender address
      to: email, // Recipient address
      subject: "Account Verification", // Email subject
      html: `<p>Thank you for signing up! Please click on the following link to verify your email:</p>
             <p><a href="${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}">Verify Email</a></p>`,
    };

    // Send email
    const res = await transporter.sendMail(mailOptions);
    return res;
  } catch (error) {
    return error;
  }
}

module.exports = { sendVerificationEmail };
