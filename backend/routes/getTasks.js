const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const User = require("../models/User"); 

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks", error: err });
  }
});


router.get("/user/:id", async (req, res) => {
  try {
    
    const user = await User.findById(req.params.id).select("first_name last_name email_id profile_picture");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    res.json({
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email_id,
      profile_picture: user.profile_picture,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching user", error: err.message });
  }
});

module.exports = router;
