import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaExclamationTriangle,
  FaArrowLeft,
} from "react-icons/fa";
import { motion } from "framer-motion";

export default function NotFound() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = JSON.parse(localStorage.getItem("userId"));
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e) =>
      setMousePosition({ x: e.clientX, y: e.clientY });

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoToDashboard = () => {
    if (user && userId) {
      navigate(`/dashboard/${userId}`);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100 text-gray-900 overflow-hidden">
      <section className="relative flex flex-col items-center justify-center text-center px-6 bg-gradient-to-br from-blue-800 via-blue-700 to-blue-700 text-white overflow-hidden h-screen">
        {/* Enhanced animated background elements */}
        <motion.div
          className="absolute top-0 left-0 w-72 h-72 bg-blue-400/20 rounded-full blur-xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            transform: `translateX(${mousePosition.x * 0.01}px)`,
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/15 rounded-full blur-2xl"
          animate={{
            x: [0, -30, 0],
            y: [0, -40, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          style={{
            transform: `translateX(-${mousePosition.x * 0.008}px)`,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-lg"
          animate={{
            x: [0, 40, 0],
            y: [0, -20, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
            delay: 2,
          }}
          style={{
            transform: `translateX(${mousePosition.y * 0.005}px)`,
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/3 w-48 h-48 bg-yellow-400/10 rounded-full blur-xl"
          animate={{
            x: [0, -25, 0],
            y: [0, 35, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          style={{
            transform: `translateX(-${mousePosition.x * 0.006}px)`,
          }}
        />

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: 0,
              }}
              animate={{
                y: [null, -100, -200],
                opacity: [0, 0.8, 0],
                x: [null, Math.random() * 100 - 50],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center justify-center space-y-8 max-w-4xl z-10"
        >
          {/* Enhanced 404 Icon with hover effects */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{
              scale: 1.1,
              rotate: [0, -10, 10, -10, 0],
              transition: { duration: 0.5 },
            }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-8xl md:text-9xl mb-4"
          >
            <FaExclamationTriangle className="text-yellow-400 drop-shadow-2xl filter hover:drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]" />
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
            Oops! Looks like this page ghosted you. 👻
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg md:text-l leading-relaxed max-w-2xl mb-8"
          >
            It looked promising at first… but like a tenant after lease renewal day, it’s disappeared without a word. Don’t worry though.. we’ve got plenty of listings that won’t pull the same stunt.
          </motion.p>

          {/* Enhanced Action Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex gap-4 flex-wrap justify-center"
          >
            {user && userId && (
              <motion.button
                onClick={handleGoToDashboard}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-white to-gray-50 text-blue-700 font-bold px-8 py-3 rounded-full shadow-lg hover:from-gray-100 hover:to-gray-200 hover:text-blue-800 transition-all duration-300 flex items-center gap-2 group"
              >
                <FaHome />
                Go Home
              </motion.button>
            )}

            <motion.button
              onClick={handleGoBack}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border-2 border-white text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-white hover:text-blue-700 transition-all duration-300 flex items-center gap-2 group"
            >
              <FaArrowLeft className="group-hover:animate-pulse" />
              Go Back
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Background Animation Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
      </section>
    </div>
  );
}
