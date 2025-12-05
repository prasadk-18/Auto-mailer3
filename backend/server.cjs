require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.verify((err, success) => {
  if (err) console.log(err);
  else console.log("Server ready to send emails");
});

app.post("/send-mail", async (req, res) => {
  const { name, email } = req.body;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "🎉 Welcome to Our Platform!",
      html: `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #ddd; padding:20px; border-radius:10px; background:#f9f9f9;">
        <h2 style="color:#4CAF50; text-align:center;">Hello ${name}!</h2>
        <p style="font-size:16px; color:#333;">Thank you for joining our platform. We're excited to have you on board!</p>

        <div style="text-align:center; margin:20px 0;">
          <p>Ekkada padithe akkada personal details ivvaku bro!!!</p>
        </div>
      </div>
      `
    });

    res.json({ message: "Fancy email sent" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Email sending failed" });
  }
});

// REQUIRED CHANGE FOR RENDER👇
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
