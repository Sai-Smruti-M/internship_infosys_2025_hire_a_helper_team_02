const mongoose=require("mongoose")

const userSchema=new mongoose.Schema(
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
    profile_picture: {
      type: String, 
      default: null,
    },
  },
  { timestamps: true }
)

const User=mongoose.model("User",userSchema)

module.exports = User;