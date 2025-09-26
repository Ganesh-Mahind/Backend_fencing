import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config({ path: "./.env" });

const app = express();
app.use(cors());
app.use(express.json());

 const transporter = nodemailer.createTransport({
      service: "gmail", // or use host, port, secure
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // app password
      },
    });

// Verify SMTP connection
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP connection failed:", error);
  } else {
    console.log("SMTP server is ready to send messages.");
  }
});

app.post("/api/quote", async (req, res) => {
  try {
    const { firstName, lastName, phone, email, zip, message } = req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.TO_EMAIL,
      subject: "New Fence Quote Request",
      text: `
Name: ${firstName} ${lastName}
Phone: ${phone}
Email: ${email}
Zip: ${zip}
Message: ${message}
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (err) {
    console.error("Error sending email:", err.response || err.message || err);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

app.listen(process.env.PORT, () =>
  console.log(`Backend running on port ${process.env.PORT}`)
);