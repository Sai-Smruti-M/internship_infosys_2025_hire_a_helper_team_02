const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const upload = require("../middleware/upload");


router.post("/", upload.single("picture"), async (req, res) => {
  try {
    const {
      user_id,
      title,
      description,
      location,
      start_time,
      end_time,
      status,
      category,
    } = req.body;

    // Basic validation (optional – extend as needed)
    if (!user_id || !title) {
      return res.status(400).json({ success: false, message: "user_id and title are required" });
    }

    const newTask = new Task({
      user_id,
      title,
      description,
      location,
      start_time,
      end_time,
      status,
      category,
      picture: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await newTask.save();
    return res.status(201).json({ success: true, message: "Task created successfully", task: newTask });
  } catch (error) {
    console.error("Add Task Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
