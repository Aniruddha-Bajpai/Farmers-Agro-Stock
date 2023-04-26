const nodeEmailer = require("nodemailer");

const sendEmail = async function (options) {
  const transporter = nodeEmailer.createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    secure: true,
    service: process.env.SMPT_SERVICE,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  // ---> triggering our mail
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
