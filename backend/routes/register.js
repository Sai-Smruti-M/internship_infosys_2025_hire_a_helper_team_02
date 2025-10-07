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

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", upload.single("profile_image"), async (req, res) => {
  try {
    const { first_name, last_name, phone_number, email_id, password } = req.body;

    if (!first_name || !last_name || !email_id || !password) {
      return res.json({ success: false, message: "Please provide all required fields" });
    }


    let profile_image = null;
    if (req.file) {
      profile_image = {
        data: req.file.buffer,       
        contentType: req.file.mimetype, 
      };
    }

   
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

  
    const hashedPassword = await bcrypt.hash(password, 10);

    otpStore[email_id] = {
      otp,
      userData: {
        first_name,
        last_name,
        phone_number,
        email_id,
        password: hashedPassword,
        profile_image, 
      },
      expiresAt: Date.now() + 5 * 60 * 1000,
    };

    
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
