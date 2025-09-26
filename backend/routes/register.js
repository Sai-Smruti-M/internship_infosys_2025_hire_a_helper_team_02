const express = require("express");
const nodemailer = require("nodemailer");
const otpStore = require("./otpStore");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const upload=require("../middleware/upload")
dotenv.config();

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});



router.post("/", upload.single("profile_image"), async (req, res) => {
  try {
    const { first_name, last_name, phone_number, email_id, password } = req.body;

    if (!first_name || !last_name || !email_id || !password) {
      return res.json({ success: false, message: "Please provide all required fields" });
    }

  
    const profile_picture = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : "http://localhost:5000/uploads/profile_picture.jpg";

    
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
        profile_picture,
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

router.post("/resend", async (req, res) => {
  try {
    const { email_id } = req.body;

    if (!email_id) {
      return res.json({ success: false, message: "Email is required" });
    }

   
    if (!otpStore[email_id]) {
      return res.json({
        success: false,
        message: "No pending registration found. Please register first.",
      });
    }

   
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    
    otpStore[email_id].otp = otp;
    otpStore[email_id].expiresAt = Date.now() + 5 * 60 * 1000;

    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email_id,
      subject: "Resend - Verify your Email",
      text: `Your new OTP is ${otp}`,
    });

    res.json({ success: true, message: "New OTP sent to your email." });
  } catch (error) {
    console.error("Error in resend OTP route:", error);
    res.json({ success: false, message: "Server error", error: error.message });
  }
});




module.exports = router;
