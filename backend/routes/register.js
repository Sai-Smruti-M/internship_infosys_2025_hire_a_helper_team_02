const express = require("express");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const otpStore = require("./otpStore"); 
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs"); 
dotenv.config();

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,  
    pass: process.env.EMAIL_PASS,  
  },
});

router.post("/", async (req, res) => {
  try {
    const { first_name, last_name, phone_number, email_id, password, profile_picture } = req.body;

    if (!first_name || !last_name || !email_id || !password) {
      return res.json({ success: false, message: "Please provide all required fields" });
    }

    
    if (otpStore[email_id]) {
      return res.json({ success: false, message: "OTP already sent. Please verify or wait to resend." });
    }

    
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
   
    otpStore[email_id] = {
      otp,
      userData: {
        id: uuidv4(),
        first_name,
        last_name,
        phone_number,
        email_id,
        password: hashedPassword,
        profile_picture: profile_picture || null,
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
