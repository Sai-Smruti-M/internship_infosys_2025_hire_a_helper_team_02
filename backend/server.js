const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const registerRoute = require("./routes/register");
const verifyOtpRoute = require("./routes/verifyOtp");
const loginRoute = require("./routes/login");
const addtaskRoute=require("./routes/addTask")
const myTasksRoute=require("./routes/myTask")
const path = require("path");
const getTasksRoute = require("./routes/getTasks");
const settingsRoute=require('./routes/settings');
const forgotPasswordRoute = require("./routes/forgotPassword");

const requestsRouter = require("./routes/requests");
const acceptedTasksRoute = require("./routes/acceptedTasks");
const notificationsRoute = require("./routes/notifications");


const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use("/requests", requestsRouter);
app.use("/add-tasks", addtaskRoute);
app.use("/register", registerRoute);
app.use("/verify-otp", verifyOtpRoute); 
app.use("/login", loginRoute);
app.use("/my-tasks", myTasksRoute);
app.use("/tasks", getTasksRoute);
app.use('/api/settings',settingsRoute );
app.use("/forgot-password", forgotPasswordRoute);
app.use("/accepted-tasks", acceptedTasksRoute);
app.use("/notifications", notificationsRoute);



app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
