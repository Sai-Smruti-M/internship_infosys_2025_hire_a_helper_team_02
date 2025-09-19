const nodemailer=require("nodemailer")
const express = require("express");
const dotenv=require("dotenv")

dotenv.config()
const router = express.Router();

const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
})

router.post("/",async(req,res)=>{
    try {
        const{email}=req.body
        if (!email){
            return res.json({ message: "Email required" });
        } 
        
        const otp=Math.floor(1000+Math.random()*9000).toString()

        await transporter.sendMail({
             from: process.env.EMAIL_USER,
             to: email,
             subject: "Your OTP Code",
             text: `Your OTP is ${otp}`
        })

         res.json({ message: "OTP sent successfully " });


    } catch (error) {
        res.json({ error: err.message });
    }
})

module.exports = router;