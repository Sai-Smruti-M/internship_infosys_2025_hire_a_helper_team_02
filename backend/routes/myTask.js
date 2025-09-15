const express = require("express");
const Task = require("../models/Task");

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

module.exports = router;
