const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv"); 
dotenv.config();

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email_id, password } = req.body;
    if (!email_id || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    const user = await User.findOne({ email_id });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid password" });

    const payload = { id: user._id, email_id: user.email_id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    // ✅ Convert binary profile image to Base64 string for frontend
    let profileImageBase64 = null;
    if (user.profile_image && user.profile_image.data) {
      profileImageBase64 = `data:${user.profile_image.contentType};base64,${user.profile_image.data.toString("base64")}`;
    }

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email_id: user.email_id,
        phone_number: user.phone_number,
        profile_image: profileImageBase64, // Updated field
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

module.exports = router;
