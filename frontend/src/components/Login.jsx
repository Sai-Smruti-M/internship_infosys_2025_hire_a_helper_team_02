import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [showBackLogoutConfirm, setShowBackLogoutConfirm] = useState(false);



  const [showPassword, setShowPassword] = useState(false); 



  useEffect(() => {
    // If user + token exist, user navigated here while authenticated (likely via back button)
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (user && token) {
      setShowBackLogoutConfirm(true);
    }
  }, []);

  const handleConfirmLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setShowBackLogoutConfirm(false);
    toast.info('Logged out');
  };

  const handleStayLoggedIn = () => {
    // Send them back to dashboard
    navigate('/feed', { replace: true });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_id: email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Login successful");
        navigate("/feed");
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-600 to-cyan-400 px-4 relative">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 p-8 bg-white/90 rounded-xl shadow-xl">
            <span className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" aria-hidden="true" />

            <p className="text-gray-700 font-semibold">Authenticating...</p>

            <p className="text-xs text-gray-500">Please wait</p>
          </div>
        </div>
      )}

      <div className={`bg-white shadow-md rounded-xl p-8 w-full max-w-md ${showBackLogoutConfirm ? 'opacity-40 pointer-events-none select-none' : ''}`}>

        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 text-sm">Sign in to your Hire-a-Helper account</p>
        </div>

  <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
              <span className="text-gray-700">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-blue-600 hover:underline">
              Forgot your password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white font-semibold bg-gradient-to-r from-indigo-500 to-cyan-400 transition flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}`}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to={"/register"} className="text-blue-600 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>

      {showBackLogoutConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-gray-800">
            <h2 className="text-lg font-semibold mb-2">You are still logged in</h2>
            <p className="text-sm text-gray-600 mb-4">
              You navigated back to the login page while your session is active. Do you want to log out?
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleStayLoggedIn}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm font-medium"
              >
                Stay Logged In
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white text-sm font-medium"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
