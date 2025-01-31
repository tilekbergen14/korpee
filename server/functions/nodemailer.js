const nodemailer = require("nodemailer");

async function main({ sendto, html }) {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });
    let info = await transporter.sendMail({
      from: '"eightman.kz" <eigthmantq@gmail.com>',
      to: `${sendto}`,
      subject: "Verify your email",
      text: "You should verify your email",
      html: html ? html : "",
    });
    return info;
  } catch (err) {
    console.log("Nodemailer", err);
  }
}

module.exports = main;
