import "./App.css";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import Home from "./components/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";
import Dashboard from "./components/Dashboard.jsx";
import PasswordReset from "./components/PasswordReset.jsx";
import { setNavigate } from "./utils/navigation";

// Component inside Router that can use useNavigate
function AppContent() {
  const navigate = useNavigate();

  useEffect(() => {
    // Set up the navigation function for use in axios interceptors
    setNavigate(navigate);
  }, [navigate]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<PasswordReset />} />
        <Route path="/dashboard/:userId/*" element={<Dashboard />} />
      </Routes>
      <ToastContainer
        theme="colored"
      />
    </>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      <Router>
        <AppContent />
      </Router>
    </div>
  );
}

export default App;