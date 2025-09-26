
// routes/notifications.js

const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");


// Get all notifications for a user

router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const notifications = await Notification.find({ user_id: userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching notifications", error: err.message });
  }
});

module.exports = router;
