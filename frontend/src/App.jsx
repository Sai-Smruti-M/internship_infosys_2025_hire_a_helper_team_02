import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Login from './components/Login'
import Signup from './components/Signup'
import EmailVerification from './components/EmailVerification'
import Feed from './components/Feed'
import MyTasks from './components/MyTasks'
import Requests from './components/Requests'
import MyRequests from './components/MyRequests'
import Setting from './components/Setting'
import Layout from './Layout'
import AddTasks from './components/AddTasks'
import Notifications from './components/Notifications'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ForgotPassword from './components/ForgotPassword'
import ProtectedRoute from './ProtectedRoute'

function App() {

  const [notifications, setNotifications] = useState([]);
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const fetchNotifications = async () => {
  if (!storedUser?.id) return;
  try {
    const res = await axios.get(
      `http://localhost:5000/notifications/user/${storedUser.id}`
    );
    setNotifications(res.data);
  } catch (err) {
    console.error("Error fetching notifications:", err);
  }
};

useEffect(() => {
  fetchNotifications();
}, [storedUser]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/email" element={<EmailVerification />} />

          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/feed" element={<Feed notifications={notifications} refreshNotifications={fetchNotifications} />} />
            <Route path="/tasks" element={<MyTasks notifications={notifications} />} />
            <Route path="/requests" element={<Requests notifications={notifications} refreshNotifications={fetchNotifications}/>} />
            <Route path="/my-requests" element={<MyRequests notifications={notifications} />} />
            <Route path="/add-task" element={<AddTasks notifications={notifications}/>} />
            <Route path="/settings" element={<Setting notifications={notifications} />} />
            <Route path="/notification" element={<Notifications notifications={notifications} />} />
            
          </Route>

        </Routes>
      </BrowserRouter>

      <ToastContainer 
        position="top-center"   
        autoClose={3000}       
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        draggable
        theme="colored"        
      />
    </>
  )
}

export default App
