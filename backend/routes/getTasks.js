
const express = require("express");
const router = express.Router();
const Task = require("../models/Task");


router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("user_id", "first_name last_name email_id profile_picture"); 
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks", error: err });
  }
});

module.exports = router;
