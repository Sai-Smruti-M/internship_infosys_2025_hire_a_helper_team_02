const express = require("express");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/User");

// Temporary in-memory store for OTPs
const otpStore = new Map(); // key: email_id, value: { otpHashed, expiresAt }

// 1️⃣ Send OTP
router.post("/send-otp", async (req, res) => {
  const { email_id } = req.body; // match model field
  if (!email_id) return res.status(400).json({ success: false, message: "Email is required" });

  try {
    const user = await User.findOne({ email_id: email_id.trim().toLowerCase() });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHashed = crypto.createHash("sha256").update(otp).digest("hex");

    // Save OTP in memory with 10 min expiry
    otpStore.set(email_id, { otpHashed, expiresAt: Date.now() + 10 * 60 * 1000 });

    // Send OTP email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: `"Hire-a-Helper" <${process.env.EMAIL_USER}>`,
      to: email_id,
      subject: "Your OTP Code",
      html: `<h3>Your OTP Code</h3><p>Use this code to reset your password: <b>${otp}</b></p><p>Expires in 10 minutes.</p>`,
    });

    res.json({ success: true, message: "OTP sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 2️⃣ Verify OTP
router.post("/verify-otp", (req, res) => {
  const { email_id, otp } = req.body; // match model field
  if (!email_id || !otp) return res.status(400).json({ success: false, message: "Email and OTP required" });

  const record = otpStore.get(email_id);
  if (!record) return res.status(400).json({ success: false, message: "OTP not found. Please request again" });

  const otpHashed = crypto.createHash("sha256").update(otp).digest("hex");

  if (record.otpHashed !== otpHashed || Date.now() > record.expiresAt) {
    otpStore.delete(email_id); // Remove expired/invalid OTP
    return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
  }

  res.json({ success: true, message: "OTP verified" });
});

// 3️⃣ Reset Password
router.post("/reset-password", async (req, res) => {
  const { email_id, password } = req.body; // match model field
  if (!email_id || !password) return res.status(400).json({ success: false, message: "Email and password required" });

  try {
    const user = await User.findOne({ email_id: email_id.trim().toLowerCase() });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    // Remove OTP from memory
    otpStore.delete(email_id);

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
