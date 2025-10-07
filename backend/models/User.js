const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      trim: true,
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
    },
    phone_number: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/, 
    },
    email_id: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    profile_image: {
      data: Buffer,       
      contentType: String 
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "Hey there! I am using this app.",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
