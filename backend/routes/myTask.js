const express = require("express");
const Task = require("../models/Task");
const mongoose = require("mongoose");

const router = express.Router();
router.get("/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const tasks = await Task.find({ user_id });
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a task (only by owner)
router.delete('/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { user_id } = req.query; // expecting ?user_id=...

    if (!user_id) {
      return res.status(400).json({ success: false, message: 'user_id is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ success: false, message: 'Invalid task id' });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    if (task.user_id.toString() !== user_id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();
    return res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', { message: error.message, stack: error.stack });
    return res.status(500).json({ success: false, message: 'Server error deleting task' });
  }
});

module.exports = router;
