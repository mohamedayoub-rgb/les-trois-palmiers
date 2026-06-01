const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "gonferix658@gmail.com",
    pass: "woja jldx zscp zbql"
  }
});

async function sendBookingEmail(data) {
  try {
    await transporter.sendMail({
      from: '"Les Trois Palmiers" <gonferix658@gmail.com>',
      to: "gonferix658@gmail.com",
      subject: "New Booking Received",
      html: `
        <h2>New Reservation</h2>
        <p><b>Name:</b> ${data.fullName}</p>
        <p><b>Email:</b> ${data.email}</p>
        <p><b>Phone:</b> ${data.phone}</p>
        <p><b>Room ID:</b> ${data.roomId}</p>
        <p><b>Check-In:</b> ${data.checkIn}</p>
        <p><b>Check-Out:</b> ${data.checkOut}</p>
      `
    });

    console.log("✅ Email sent successfully");
  } catch (error) {
    console.error("❌ Email error:", error);
  }
}

module.exports = sendBookingEmail;