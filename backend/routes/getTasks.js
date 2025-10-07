   const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("user_id", "first_name last_name email_id profile_image"); 

    const tasksWithImages = tasks.map(task => {
     
      let taskImage = null;
      if (task.picture && task.picture.data) {
        taskImage = `data:${task.picture.contentType};base64,${task.picture.data.toString("base64")}`;
      }

      
      const userObj = task.user_id ? task.user_id.toObject() : null;

     
      let profileImage = null;
      if (userObj?.profile_image && userObj.profile_image.data) {
        profileImage = `data:${userObj.profile_image.contentType};base64,${userObj.profile_image.data.toString("base64")}`;
      }

      return {
        ...task.toObject(),
        picture: taskImage,
        user_id: userObj
          ? { ...userObj, profile_picture: profileImage }
          : null,
      };
    });

    res.json(tasksWithImages);
  } catch (err) {
    console.error("Error fetching tasks:", err); 
    res.status(500).json({ message: "Error fetching tasks", error: err.message });
  }
});

module.exports = router;
