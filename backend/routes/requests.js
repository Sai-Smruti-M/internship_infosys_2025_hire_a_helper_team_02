const express = require("express");
const router = express.Router();
const Request = require("../models/Requests");
const AcceptedTask = require("../models/AcceptedTasks");
const Task = require("../models/Task");
const Notification = require("../models/Notification"); 


router.post("/", async (req, res) => {
  const { task_id, requester_id, task_owner_id, message } = req.body;

  if (!task_id || !requester_id || !task_owner_id) {
    return res.status(400).json({ message: "task_id, requester_id, and task_owner_id are required" });
  }

  try {
    
    const newRequest = new Request({
      task_id,
      requester_id,
      task_owner_id,
      status: "pending",
      message: message || "", 
    });
    await newRequest.save();

    
    await Task.findByIdAndUpdate(task_id, { is_request_sent: true });

   
    const requesterUser = await Request.populate(newRequest, { path: "requester_id", select: "first_name last_name" });
    const task = await Task.findById(task_id);

    const notificationBody = `${requesterUser.requester_id.first_name} ${requesterUser.requester_id.last_name} sent a request for your task "${task.title}".`;
    
    await Notification.create({
      user_id: task_owner_id,
      body: notificationBody,
    });

    res.json({ success: true, message: "Request sent successfully", data: newRequest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send request", error: err.message });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const requests = await Request.find({ task_owner_id: userId })
      .populate("requester_id", "first_name last_name email_id rating reviews profile_picture")
      .populate("task_id", "title description start_time end_time location category picture is_request_sent");

    const formattedRequests = requests.map((req) => ({
      _id: req._id,
      status: req.status,
      requester: req.requester_id,
      task: req.task_id,
    }));

    res.json(formattedRequests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching requests", error: err.message });
  }
});


router.put("/:requestId/status", async (req, res) => {
  const { requestId } = req.params;
  const { status } = req.body; 
  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const request = await Request.findById(requestId)
      .populate("requester_id", "first_name last_name")
      .populate("task_id", "title");

    if (!request) return res.status(404).json({ message: "Request not found" });

    
    request.status = status;
    await request.save();

    
    if (status === "accepted") {
      await AcceptedTask.create({
        user_id: request.requester_id._id,
        task_id: request.task_id._id,
        status: "accepted",
      });
    }

    
    if (status === "rejected") {
      await Task.findByIdAndUpdate(request.task_id._id, { is_request_sent: false });
    }

   
    const notificationMessage =
      status === "accepted"
        ? `Your request for the task "${request.task_id.title}" has been accepted.`
        : `Your request for the task "${request.task_id.title}" has been declined.`;

    await Notification.create({
      user_id: request.requester_id._id,
      body: notificationMessage,
    });

    res.json({ success: true, message: `Request ${status}`, data: request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update request status", error: err.message });
  }
});


router.get("/requester/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const requests = await Request.find({ requester_id: userId })
      .populate("task_id", "title description start_time end_time location category picture")
      .populate("task_owner_id", "first_name last_name");

    const formattedRequests = requests.map((req) => ({
      _id: req._id,
      status: req.status,
      createdAt: req.createdAt,
      task: req.task_id,
      task_owner: req.task_owner_id,
    }));

    res.json(formattedRequests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching my requests", error: err.message });
  }
});

module.exports = router;
