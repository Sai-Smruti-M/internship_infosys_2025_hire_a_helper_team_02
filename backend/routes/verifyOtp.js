const express = require("express");
const User = require("../models/User");
const otpStore = require("./otpStore");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.json({ success: false, message: "Email and OTP are required" });
    }

    const otpData = otpStore[email];
    if (!otpData) {
      return res.json({ success: false, message: "OTP expired or not found" });
    }

    if (otpData.otp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (otpData.expiresAt < Date.now()) {
      delete otpStore[email];
      return res.json({ success: false, message: "OTP expired" });
    }

    
    const { first_name, last_name, email_id, password, phone_number, profile_image } =
      otpData.userData;

    const userData = {
      first_name,
      last_name,
      email_id,
      password,
      phone_number,
      isVerified: true,
      
      profile_image: profile_image
        ? {
            data: profile_image.data,
            contentType: profile_image.contentType,
          }
        : {
            data: null,
            contentType: null,
          },
    };

   
    const newUser = new User(userData);
    await newUser.save();

 
    delete otpStore[email];

    res.json({ success: true, message: "Email verified & user registered successfully!" });
  } catch (error) {
    console.error("Error in OTP verification:", error);
    res.json({ success: false, message: "Server error", error: error.message });
  }
});

module.exports = router;
