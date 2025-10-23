import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaSearch, FaExclamationTriangle } from "react-icons/fa";
import { motion } from "framer-motion";

export default function NotFound() {
  const [offsetY, setOffsetY] = useState(0);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = JSON.parse(localStorage.getItem("userId"));
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setOffsetY(window.pageYOffset);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoToDashboard = () => {
    if (user && userId) {
      navigate(`/dashboard/${userId}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100 text-gray-900 overflow-x-hidden">
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-36 pb-24 md:pt-40 md:pb-28 bg-blue-700 text-white overflow-hidden min-h-screen">
        {/* Animated background elements */}
        <div
          className="absolute top-0 left-0 w-72 h-72 bg-blue-400/20 rounded-full"
          style={{ transform: `translateY(${offsetY * 0.3}px)` }}
        />
        <div
          className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/15 rounded-full"
          style={{ transform: `translateY(-${offsetY * 0.2}px)` }}
        />
        <div
          className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full"
          style={{ transform: `translateY(${offsetY * 0.1}px)` }}
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center justify-center space-y-8 max-w-4xl z-10"
        >
          {/* 404 Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-8xl md:text-9xl mb-4"
          >
            <FaExclamationTriangle className="text-yellow-400 drop-shadow-lg" />
          </motion.div>

          {/* 404 Text */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-6xl md:text-8xl font-extrabold drop-shadow-lg mb-2"
          >
            404
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Page Not Found
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg md:text-xl leading-relaxed max-w-2xl mb-8"
          >
            Oops! It looks like the page you're looking for has moved, been deleted, or doesn't exist. 
            Don't worry though, you can get back on track with RentWise.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex gap-4 flex-wrap justify-center"
          >
            <button
              onClick={handleGoHome}
              className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-full shadow-md hover:bg-white hover:text-blue-700 hover:shadow-lg transition transform hover:scale-105 flex items-center gap-2"
            >
              <FaHome />
              Go Home
            </button>

            {user && userId && (
              <button
                onClick={handleGoToDashboard}
                className="bg-white text-blue-700 font-bold px-8 py-3 rounded-full shadow-md hover:bg-gray-100 hover:text-blue-800 hover:shadow-lg transition transform hover:scale-105 flex items-center gap-2"
              >
                <FaSearch />
                Dashboard
              </button>
            )}

            <button
              onClick={handleGoBack}
              className="bg-transparent border-2 border-white text-white font-semibold px-8 py-3 rounded-full shadow-md hover:bg-white hover:text-blue-700 hover:shadow-lg transition transform hover:scale-105"
            >
              Go Back
            </button>
          </motion.div>

          {/* Additional Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 max-w-2xl"
          >
            <h3 className="text-xl font-semibold mb-4">Need Help?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Quick Links:</h4>
                <ul className="space-y-1">
                  <li>
                    <Link to="/" className="hover:text-yellow-300 transition-colors underline">
                      Homepage
                    </Link>
                  </li>
                  {!user && (
                    <>
                      <li>
                        <Link to="/login" className="hover:text-yellow-300 transition-colors underline">
                          Login
                        </Link>
                      </li>
                      <li>
                        <Link to="/register" className="hover:text-yellow-300 transition-colors underline">
                          Register
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Common Issues:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Check the URL for typos</li>
                  <li>• The page may have been moved</li>
                  <li>• You may need to log in first</li>
                  <li>• Try refreshing the page</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}