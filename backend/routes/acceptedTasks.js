const express = require("express");
const router = express.Router();
const AcceptedTask = require("../models/AcceptedTasks");


router.post("/", async (req, res) => {
  const { user_id, task_id, status } = req.body;

  if (!user_id || !task_id) {
    return res.status(400).json({ message: "user_id and task_id are required" });
  }

  try {
    const acceptedTask = new AcceptedTask({ user_id, task_id, status: status || "accepted" });
    await acceptedTask.save();
    res.json({ success: true, message: "Task accepted successfully", data: acceptedTask });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to accept task", error: err.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const tasks = await AcceptedTask.find()
      .populate("user_id", "first_name last_name email_id")
      .populate("task_id", "title description start_time end_time location category");
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching accepted tasks", error: err.message });
  }
});

module.exports = router;
