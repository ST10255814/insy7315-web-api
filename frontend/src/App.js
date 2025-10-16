import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./lib/queryClient.js";
import Home from "./components/Home.js";
import Navbar from "./components/Navbar.js";
import Login from "./components/Login.js";
import Register from "./components/Register.js";
import ForgotPassword from "./components/ForgotPassword.js";
import Dashboard from "./components/Dashboard.js";
import PasswordReset from "./components/PasswordReset.js";

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </Router>
  );
}

export default App;
