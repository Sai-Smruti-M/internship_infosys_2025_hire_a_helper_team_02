# 🌟 Hire-a-Helper

**Hire-a-Helper** is an on-demand task assistance web application designed to connect people who need tasks done with reliable helpers in their community.  
Built with the **MERN stack**, this platform enables users to post tasks, find help, and manage requests easily and securely.



---

## 📑 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [API Endpoints](#api-endpoints)
- [Team Members](#team-members)

---

## 🚀 Features

- **User Authentication**  
  Secure registration with email OTP verification, login, and “forgot password” functionality.

- **Task Management**  
  Users can create, view, and delete their own tasks.

- **Interactive Task Feed**  
  Browse, search, and filter available tasks posted by others.

- **Request System**  
  Helpers can send requests to assist with a task, and task owners can accept or decline requests.

- **Dashboard & Profile Management**
  - **My Tasks:** View and manage all tasks created by you.  
  - **My Requests:** Track requests sent to help others.  
  - **Settings:** Update profile, bio, password, and profile picture.

- **Notification System**  
  Get real-time updates for important actions like new requests or accepted/declined requests.

- **Responsive Design**  
  Mobile-first interface using **Tailwind CSS**, ensuring smooth performance on all devices.

---

## 🧩 Tech Stack

### **Frontend**
- ⚛️ React – UI development  
- ⚡ Vite – Fast development environment  
- 🎨 Tailwind CSS – Utility-first styling  
- 🧭 React Router – Client-side routing  
- 🌐 Axios – HTTP requests  
- 🔔 React Toastify – Notifications

### **Backend**
- 🟩 Node.js – Server runtime  
- 🚏 Express.js – RESTful API framework  
- 🍃 MongoDB – NoSQL database  
- 🧠 Mongoose – ODM for MongoDB  
- 🔐 JSON Web Tokens (JWT) – Authentication  
- 🧂 Bcrypt.js – Password hashing  
- 📧 Nodemailer – Email/OTP service  
- 🖼️ Multer – File uploads (profile pictures)

---

## 📂 Project Structure

```
/
├── backend/
│   ├── models/        # Mongoose schemas (User, Task, Request, etc.)
│   ├── routes/        # API route definitions
│   ├── middleware/    # Custom middleware (auth, upload)
│   └── server.js      # Main server entry point
│
└── frontend/
    ├── src/
    │   ├── components/  # React components for pages/features
    │   ├── contexts/    # React context (e.g., theme management)
    │   └── App.jsx      # Main app component with routing
    └── public/          # Static assets
```

---

## ⚙️ Setup and Installation

### **Prerequisites**
- [Node.js](https://nodejs.org/) (v18.0+)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/) (local or Atlas cloud)

---

### **1. Clone the Repository**
```bash
git clone <your-repository-url>
cd internship_infosys_2025_hire_a_helper_team_02-SridharBranch
```

---

### **2. Backend Setup**
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:
```env
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret_key>
EMAIL_USER=<your_gmail_address>
EMAIL_PASS=<your_gmail_app_password>
PORT=5000
```

Start the backend server:
```bash
npm start
```
Backend runs at: **http://localhost:5000**

---

### **3. Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: **http://localhost:5173**

---

## 🔗 API Endpoints

### **Authentication**
| Method | Endpoint | Description |
|---------|-----------|-------------|
| POST | `/register` | Register a new user |
| POST | `/verify-otp` | Verify email with OTP |
| POST | `/login` | Log in and get JWT token |
| POST | `/forgot-password/...` | Handle password reset |

### **Tasks**
| Method | Endpoint | Description |
|---------|-----------|-------------|
| GET | `/tasks` | Get all tasks for the feed |
| POST | `/add-tasks` | Create a new task |
| GET | `/my-tasks/:user_id` | Get all tasks created by a user |
| DELETE | `/my-tasks/:taskId` | Delete a specific task |

### **Requests**
| Method | Endpoint | Description |
|---------|-----------|-------------|
| POST | `/requests` | Send a request to help |
| GET | `/requests/user/:userId` | Get all requests received |
| GET | `/requests/requester/:userId` | Get all requests sent |
| PUT | `/requests/:requestId/status` | Accept or reject a request |

### **User Settings**
| Method | Endpoint | Description |
|---------|-----------|-------------|
| PUT | `/api/settings/:id` | Update profile info |
| POST | `/api/settings/:id` | Upload profile picture |
| POST | `/api/settings/change-password/:id` | Change password |

### **Notifications**
| Method | Endpoint | Description |
|---------|-----------|-------------|
| GET | `/notifications/user/:userId` | Get all user notifications |

---

## 👥 Team Members

| Name |
|------|
| **Sai Smruti Moharana** |
| **Sridhar Elumalai** |
| **Killamsetty Sai Venkata Harish** |
| **Pavithra** |
| **Priyadharshini** |
| **Chinmayi S** | 

---

### 🏁 Conclusion

> **Hire-a-Helper** empowers communities by bridging the gap between those who need assistance and those willing to help — making everyday tasks simpler, faster, and more reliable.

---
