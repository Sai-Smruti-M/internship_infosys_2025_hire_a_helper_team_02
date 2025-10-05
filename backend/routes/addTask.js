const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const multer = require("multer");

// Use memoryStorage to store file in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("picture"), async (req, res) => {
  try {
    const { user_id, title, description, location, start_time, end_time, status, category } = req.body;

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
      picture: req.file ? { data: req.file.buffer, contentType: req.file.mimetype } : null,
    });

    await newTask.save();
    return res.status(201).json({ success: true, message: "Task created successfully", task: newTask });
  } catch (error) {
    console.error("Add Task Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
