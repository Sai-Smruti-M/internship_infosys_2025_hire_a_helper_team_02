const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String },
  location: { type: String },
  start_time: { type: Date, required: true },
  end_time: { type: Date },
  status: { type: String, default: "pending" },
  category: { type: String },
  picture: { type: String },

  
  is_request_sent: {
    type: Boolean,
    default: false, 
  },
});

module.exports = mongoose.model("Task", TaskSchema);
