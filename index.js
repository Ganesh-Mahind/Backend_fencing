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
    // Gmail SMTP transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: `"Fence Website" <${process.env.EMAIL_USER}>`,
      to: process.env.TO_EMAIL, // where you want to receive the form
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
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ message: "Failed to send your request. Try again later." });
  }
});

// ✅ Health check
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Use Render's PORT or default 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
