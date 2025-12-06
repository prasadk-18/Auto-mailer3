require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mysql = require("mysql2/promise");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let db;
(async () => {
  db = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });
  console.log("MySQL Connected ✔");
})();

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
  const { name, email, phone, age, comments } = req.body;

  try {
    await db.query(
      "INSERT INTO users (name, email, phone, age, comments) VALUES (?, ?, ?, ?, ?)",
      [name, email, phone, age, comments]
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "🎉 Welcome to Our Platform!",
      html: `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #ddd; padding:20px; border-radius:10px; background:#f9f9f9;">
        <h2 style="color:#4CAF50; text-align:center;">Hello ${name}!</h2>
        <table style="width:100%; margin-top:20px; border-collapse: collapse;">
          <tr><td style="padding:8px; border:1px solid #ccc;">Email</td><td style="padding:8px; border:1px solid #ccc;">${email}</td></tr>
          <tr><td style="padding:8px; border:1px solid #ccc;">Phone</td><td style="padding:8px; border:1px solid #ccc;">${phone}</td></tr>
          <tr><td style="padding:8px; border:1px solid #ccc;">Age</td><td style="padding:8px; border:1px solid #ccc;">${age}</td></tr>
          <tr><td style="padding:8px; border:1px solid #ccc;">Comments</td><td style="padding:8px; border:1px solid #ccc;">${comments}</td></tr>
        </table>
        <p style="margin-top:20px;">Thanks for joining our platform!</p>
        <p>!!Ekkada padithe akkada personal details ivvaku bro!!</p>
      </div>
      `
    });

    res.json({ message: "Data saved + email sent successfully!" });

  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Email or DB insert failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
