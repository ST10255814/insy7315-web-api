import { NavLink, useNavigate } from "react-router-dom";
import {
  FaSignOutAlt,
  FaUserCircle,
  FaBuilding,
  FaChartBar,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const activeClass = "text-blue-700 font-semibold border-b-2 border-blue-700";
  const normalClass =
    "text-gray-700 hover:text-blue-700 transition duration-300";

  return (
    <nav className="bg-white shadow-lg py-4 w-full fixed top-0 z-50 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <h1
          className="text-3xl md:text-4xl font-extrabold text-blue-700 cursor-pointer tracking-tight hover:text-blue-800 transition"
          onClick={() => navigate("/")}
        >
          RentWise
        </h1>
        {user && (
          <div className="hidden md:flex space-x-8 text-lg">
            <NavLink
              to="/properties"
              className={({ isActive }) =>
                `flex items-center space-x-2 ${
                  isActive ? activeClass : normalClass
                }`
              }
            >
              <FaBuilding className="w-5 h-5" />
              <span>Properties</span>
            </NavLink>
            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                `flex items-center space-x-2 ${
                  isActive ? activeClass : normalClass
                }`
              }
            >
              <FaChartBar className="w-5 h-5" />
              <span>Analytics</span>
            </NavLink>
          </div>
        )}
        <div className="flex items-center space-x-4 text-lg">
          {user ? (
            <>
              <span className="text-gray-800 font-medium flex items-center space-x-2">
                <FaUserCircle className="text-blue-700 text-2xl" />
                <span>Welcome, {user}</span>
              </span>
              <button
                className="bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-800 hover:shadow-lg transition-transform transform hover:scale-105"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-5 py-2 rounded-lg border border-blue-700 ${
                    isActive
                      ? "bg-blue-700 text-white"
                      : "text-blue-700 bg-white"
                  } hover:bg-blue-700 hover:text-white transition-transform transform hover:scale-105 shadow-sm`
                }
              >
                <FaSignInAlt />
                <span>Login</span>
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-5 py-2 rounded-lg border border-blue-700 ${
                    isActive
                      ? "bg-blue-700 text-white"
                      : "bg-blue-700 text-white"
                  } hover:bg-white hover:text-blue-700 transition-transform transform hover:scale-105 shadow-md`
                }
              >
                <FaUserPlus />
                <span>Register</span>
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
