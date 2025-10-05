const express = require("express");
const nodemailer = require("nodemailer");
const otpStore = require("./otpStore");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const multer = require("multer");

dotenv.config();

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Multer config to store file in memory (not disk)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", upload.single("profile_image"), async (req, res) => {
  try {
    const { first_name, last_name, phone_number, email_id, password } = req.body;

    if (!first_name || !last_name || !email_id || !password) {
      return res.json({ success: false, message: "Please provide all required fields" });
    }

    // ✅ Prepare the image as binary buffer
    let profile_image = null;
    if (req.file) {
      profile_image = {
        data: req.file.buffer,       // full binary data
        contentType: req.file.mimetype, // like 'image/jpeg'
      };
    }

    // Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Store user temporarily in otpStore before OTP verification
    otpStore[email_id] = {
      otp,
      userData: {
        first_name,
        last_name,
        phone_number,
        email_id,
        password: hashedPassword,
        profile_image, // Store image as binary
      },
      expiresAt: Date.now() + 5 * 60 * 1000,
    };

    // Send OTP
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email_id,
      subject: "Verify your Email - OTP Code",
      text: `Your OTP is ${otp}`,
    });

    res.json({ success: true, message: "OTP sent to email." });
  } catch (error) {
    console.error("Error in register route:", error);
    res.json({ success: false, message: "Server error", error: error.message });
  }
});

module.exports = router;
