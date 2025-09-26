import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Quote API route
app.post("/api/quote", async (req, res) => {
  const { firstName, lastName, phone, email, zip, message, consent } = req.body;

  if (!firstName || !lastName || !phone || !email || !zip || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Gmail SMTP transport (explicit config)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true = 465, false = 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: `"Fence Website" <${process.env.EMAIL_USER}>`,
      to: process.env.TO_EMAIL,
      subject: "New Quote Request",
      text: `
        Name: ${firstName} ${lastName}
        Phone: ${phone}
        Email: ${email}
        Zip: ${zip}
        Message: ${message}
        Consent: ${consent ? "Yes" : "No"}
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Your request has been submitted successfully!" });
  }catch (err) {
  console.error("❌ Error sending email:", err.message, err.response || err);
  res.status(500).json({ message: err.message || "Failed to send your request." });
}
});

// ✅ Health check
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Render will give a PORT, or fallback to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
