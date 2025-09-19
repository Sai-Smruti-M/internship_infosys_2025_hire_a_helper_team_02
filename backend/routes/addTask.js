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
    res.json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    console.error(error);
    res.json({ message: "Server error" });
  }
});

module.exports = router;
