const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Request = require("../models/Requests");
const AcceptedTask = require("../models/AcceptedTasks");
const Task = require("../models/Task");
const Notification = require("../models/Notification");

// Helper: Convert image buffer to Base64
const bufferToBase64 = (image) => {
  if (!image || !image.data) return null;
  return `data:${image.contentType};base64,${image.data.toString("base64")}`;
};

// 📩 CREATE A NEW REQUEST
router.post("/", async (req, res) => {
  const { task_id, requester_id, task_owner_id } = req.body;

  if (!task_id || !requester_id || !task_owner_id) {
    return res.status(400).json({
      message: "task_id, requester_id, and task_owner_id are required",
    });
  }

  try {
    const newRequest = new Request({
      task_id,
      requester_id,
      task_owner_id,
      status: "pending",
    });
    await newRequest.save();

    // ✅ Update Task → mark as request sent + in progress
    await Task.findByIdAndUpdate(task_id, {
      is_request_sent: true,
      status: "in progress",
    });

    // ✅ Send Notification to task owner
    const requesterUser = await Request.populate(newRequest, {
      path: "requester_id",
      select: "first_name last_name profile_image",
    });
    const task = await Task.findById(task_id);

    const notificationBody = `${requesterUser.requester_id.first_name} ${requesterUser.requester_id.last_name} sent a request for your task "${task?.title || "Deleted Task"}".`;
    await Notification.create({ user_id: task_owner_id, body: notificationBody });

    res.json({
      success: true,
      message: "Request sent successfully",
      data: newRequest,
    });
  } catch (err) {
    console.error("Create Request Error:", err);
    res.status(500).json({
      message: "Failed to send request",
      error: err.message,
    });
  }
});

// 📥 GET REQUESTS FOR A TASK OWNER
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const requests = await Request.find({ task_owner_id: userId })
      .populate("requester_id", "first_name last_name email_id profile_image")
      .populate("task_id", "title description start_time end_time location category is_request_sent status");

    const formattedRequests = requests.map((req) => {
      const requesterImage = bufferToBase64(req.requester_id?.profile_image);

      return {
        _id: req._id,
        status: req.status,
        requester: req.requester_id
          ? {
              ...req.requester_id.toObject(),
              profile_picture: requesterImage,
            }
          : null,
        task: req.task_id ? { ...req.task_id.toObject() } : null,
      };
    });

    res.json(formattedRequests);
  } catch (err) {
    console.error("Get Requests Error:", err);
    res.status(500).json({
      message: "Error fetching requests",
      error: err.message,
    });
  }
});

// 📤 GET REQUESTS SENT BY A REQUESTER
router.get("/requester/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const requests = await Request.find({ requester_id: userId })
      .populate("task_id", "title description start_time end_time location category picture status")
      .populate("task_owner_id", "first_name last_name profile_image");

    const formattedRequests = requests.map((req) => {
      const taskImage = bufferToBase64(req.task_id?.picture);
      const ownerImage = bufferToBase64(req.task_owner_id?.profile_image);

      return {
        _id: req._id,
        status: req.status,
        createdAt: req.createdAt,
        task: req.task_id
          ? { ...req.task_id.toObject(), picture: taskImage }
          : null,
        task_owner: req.task_owner_id
          ? { ...req.task_owner_id.toObject(), profile_picture: ownerImage }
          : null,
      };
    });

    res.json(formattedRequests);
  } catch (err) {
    console.error("Get My Requests Error:", err);
    res.status(500).json({
      message: "Error fetching my requests",
      error: err.message,
    });
  }
});

// 🟢 UPDATE REQUEST STATUS (accept/reject)
router.put("/:requestId/status", async (req, res) => {
  const { requestId } = req.params;
  const { status } = req.body;

  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  if (!mongoose.Types.ObjectId.isValid(requestId)) {
    return res.status(400).json({ message: "Invalid requestId" });
  }

  try {
    const request = await Request.findById(requestId)
      .populate("requester_id", "first_name last_name profile_image")
      .populate("task_id", "title");

    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = status;
    await request.save();

    if (status === "accepted") {
      // ✅ Add to AcceptedTasks & mark task as accepted
      await AcceptedTask.create({
        user_id: request.requester_id._id,
        task_id: request.task_id._id,
        status: "accepted",
      });

      await Task.findByIdAndUpdate(request.task_id._id, {
        status: "accepted",
      });
    } else if (status === "rejected") {
      // ✅ Revert task to pending
      await Task.findByIdAndUpdate(request.task_id._id, {
        is_request_sent: false,
        status: "pending",
      });
    }

    const notificationMessage =
      status === "accepted"
        ? `Your request for the task "${request.task_id?.title || "Deleted Task"}" has been accepted.`
        : `Your request for the task "${request.task_id?.title || "Deleted Task"}" has been declined.`;

    await Notification.create({
      user_id: request.requester_id._id,
      body: notificationMessage,
    });

    res.json({ success: true, message: `Request ${status}`, data: request });
  } catch (err) {
    console.error("Update Request Status Error:", err);
    res.status(500).json({
      message: "Failed to update request status",
      error: err.message,
    });
  }
});

module.exports = router;
