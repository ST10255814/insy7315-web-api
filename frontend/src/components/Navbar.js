import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaSignOutAlt,
  FaUserCircle,
  FaBuilding,
  FaChartBar,
  FaSignInAlt,
  FaUserPlus,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobileMenu = () => setMobileOpen(!mobileOpen);

  const menuVariants = {
    hidden: { opacity: 0, scaleY: 0, transformOrigin: "top" },
    visible: { opacity: 1, scaleY: 1, transition: { duration: 0.25, ease: "easeOut" } },
    exit: { opacity: 0, scaleY: 0, transition: { duration: 0.2, ease: "easeIn" } },
  };

  return (
    <nav className="bg-white shadow-lg w-full fixed top-0 z-50 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between py-4 relative">
        {/* Brand fixed left */}
        <h1
          className="text-3xl md:text-4xl font-extrabold text-blue-700 cursor-pointer hover:text-blue-800 transition"
          onClick={() => navigate("/")}
        >
          RentWise
        </h1>

        {/* Desktop Nav Links (centered) */}
        {user && (
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-6 text-lg">
            <NavLink
              to="/properties"
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3 py-2 rounded-md ${
                  isActive
                    ? "text-blue-700 font-semibold border-b-2 border-blue-700"
                    : "text-gray-700 hover:text-blue-700 transition duration-300"
                }`
              }
            >
              <FaBuilding className="w-5 h-5" />
              <span>Properties</span>
            </NavLink>
            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3 py-2 rounded-md ${
                  isActive
                    ? "text-blue-700 font-semibold border-b-2 border-blue-700"
                    : "text-gray-700 hover:text-blue-700 transition duration-300"
                }`
              }
            >
              <FaChartBar className="w-5 h-5" />
              <span>Analytics</span>
            </NavLink>
          </div>
        )}

        {/* Desktop User Actions fixed right */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <span className="flex items-center space-x-2 px-3 py-2 text-gray-800 font-medium">
                <FaUserCircle className="text-blue-700 text-2xl" />
                <span>Welcome, {user}</span>
              </span>
              <button className="flex items-center space-x-2 px-5 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-transform transform hover:scale-105">
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-5 py-2 rounded-lg border border-blue-700 transition-transform transform hover:scale-105 ${
                    isActive
                      ? "bg-blue-700 text-white"
                      : "bg-white text-blue-700 hover:bg-blue-700 hover:text-white"
                  }`
                }
              >
                <FaSignInAlt />
                <span>Login</span>
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-5 py-2 rounded-lg border border-blue-700 transition-transform transform hover:scale-105 ${
                    isActive
                      ? "bg-blue-700 text-white"
                      : "bg-white text-blue-700 hover:bg-blue-700 hover:text-white"
                  }`
                }
              >
                <FaUserPlus />
                <span>Register</span>
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMobileMenu}>
            {mobileOpen ? (
              <FaTimes className="text-2xl text-blue-700" />
            ) : (
              <FaBars className="text-2xl text-blue-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden origin-top bg-white shadow-lg w-full flex flex-col space-y-4 py-6 px-6 rounded-b-xl border-t border-gray-200 overflow-hidden"
          >
            {user && (
              <>
                <NavLink
                  to="/properties"
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-4 rounded-md ${
                      isActive ? "bg-blue-100 text-blue-700" : "hover:bg-blue-50"
                    } transition`
                  }
                  onClick={() => setMobileOpen(false)}
                >
                  <FaBuilding className="w-5 h-5" />
                  <span>Properties</span>
                </NavLink>
                <NavLink
                  to="/analytics"
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-4 rounded-md ${
                      isActive ? "bg-blue-100 text-blue-700" : "hover:bg-blue-50"
                    } transition`
                  }
                  onClick={() => setMobileOpen(false)}
                >
                  <FaChartBar className="w-5 h-5" />
                  <span>Analytics</span>
                </NavLink>
              </>
            )}

            <div className="flex flex-col space-y-4 mt-2">
              {user ? (
                <>
                  <span className="flex items-center space-x-3 px-4 py-4 bg-gray-100 rounded-md">
                    <FaUserCircle className="text-blue-700 text-2xl" />
                    <span>Welcome, {user}</span>
                  </span>
                  <button className="flex items-center space-x-3 px-4 py-4 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition">
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-4 rounded-md border border-blue-700 ${
                        isActive
                          ? "bg-blue-700 text-white"
                          : "bg-white text-blue-700 hover:bg-blue-700 hover:text-white"
                      } transition`
                    }
                    onClick={() => setMobileOpen(false)}
                  >
                    <FaSignInAlt />
                    <span>Login</span>
                  </NavLink>
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-4 rounded-md border border-blue-700 ${
                        isActive
                          ? "bg-blue-700 text-white"
                          : "bg-white text-blue-700 hover:bg-blue-700 hover:text-white"
                      } transition`
                    }
                    onClick={() => setMobileOpen(false)}
                  >
                    <FaUserPlus />
                    <span>Register</span>
                  </NavLink>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
