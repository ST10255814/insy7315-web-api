import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCreditCard,
  FaShieldAlt,
  FaChartLine,
  FaUsers,
  FaBuilding,
} from "react-icons/fa";
import { motion } from "framer-motion";

export default function Home() {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setOffsetY(window.pageYOffset);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cardAnimation = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
    }),
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 overflow-x-hidden">
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-36 pb-24 md:pt-40 md:pb-28 bg-blue-700 text-white overflow-hidden">
        <div
          className="absolute top-0 left-0 w-72 h-72 bg-blue-400/20 rounded-full"
          style={{ transform: `translateY(${offsetY * 0.3}px)` }}
        />
        <div
          className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/15 rounded-full"
          style={{ transform: `translateY(-${offsetY * 0.2}px)` }}
        />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center justify-center space-y-5 max-w-3xl"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-extrabold drop-shadow-lg"
          >
            RentWise
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl leading-relaxed max-w-2xl"
          >
            Smart Rentals, Simple Management — streamline operations, manage
            tenants, track finances, and simplify property administration.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex gap-4 flex-wrap justify-center"
          >
            <Link
              to="/register"
              className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-full shadow-md hover:bg-white hover:text-blue-700 hover:shadow-lg transition transform hover:scale-105"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="bg-white text-blue-700 font-bold px-8 py-3 rounded-full shadow-md hover:bg-gray-100 hover:text-blue-800 hover:shadow-lg transition transform hover:scale-105"
            >
              Login
            </Link>
          </motion.div>
        </motion.div>
      </section>
      <section className="flex flex-col items-center text-center px-6 py-16 gap-10 bg-gray-50">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-blue-700 mb-2"
        >
          Why Choose RentWise?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          viewport={{ once: true }}
          className="text-gray-700 max-w-3xl mb-10 text-2xl"
        >
          RentWise gives administrators full control over properties, tenants,
          and finances while providing actionable insights and streamlined
          management.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8 w-full max-w-6xl">
          {[
            {
              icon: (
                <FaBuilding className="text-blue-700 text-5xl mb-4 mx-auto" />
              ),
              title: "Property Management",
              desc: "Centralize and monitor all your properties, track availability, and manage leases with ease.",
            },
            {
              icon: <FaUsers className="text-blue-700 text-5xl mb-4 mx-auto" />,
              title: "Tenant Oversight",
              desc: "Track tenant profiles, leases, communication history, and rent payments efficiently.",
            },
            {
              icon: (
                <FaChartLine className="text-blue-700 text-5xl mb-4 mx-auto" />
              ),
              title: "Financial Insights",
              desc: "Generate reports, visualize trends, and make informed decisions to optimize revenue.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              whileInView="visible"
              variants={cardAnimation}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 15px rgba(59,130,246,0.4)",
                borderColor: "#3B82F6",
              }}
              className="bg-gradient-to-br from-blue-50 to-white rounded-3xl shadow-md p-8 w-full border border-blue-100 transition-all duration-300 text-center"
            >
              {feature.icon}
              <h3 className="text-2xl font-semibold text-blue-700 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-700 text-base">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <section className="flex flex-col items-center text-center px-6 py-16 gap-10 bg-white">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-blue-700 mb-2"
        >
          How It Works
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          viewport={{ once: true }}
          className="text-gray-700 max-w-3xl mb-10 text-2xl"
        >
          RentWise makes property management effortless — add properties, manage
          tenants, monitor finances, and track performance all from one
          dashboard.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8 w-full max-w-6xl">
          {[
            {
              icon: (
                <FaCreditCard className="text-blue-700 text-4xl mb-4 mx-auto" />
              ),
              title: "Add Properties",
              desc: "Easily add new properties, upload details, and keep everything organized.",
            },
            {
              icon: <FaUsers className="text-blue-700 text-4xl mb-4 mx-auto" />,
              title: "Manage Tenants",
              desc: "Track lease agreements, payments, and tenant history effortlessly.",
            },
            {
              icon: (
                <FaShieldAlt className="text-blue-700 text-4xl mb-4 mx-auto" />
              ),
              title: "Monitor Finances",
              desc: "Visualize rent collection, occupancy, and revenue trends in real time.",
            },
          ].map((step, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              whileInView="visible"
              variants={cardAnimation}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 15px rgba(59,130,246,0.4)",
                borderColor: "#3B82F6",
              }}
              className="bg-blue-50 rounded-3xl shadow-md p-6 w-full border border-blue-100 transition-all duration-300 text-center"
            >
              {step.icon}
              <h3 className="text-xl font-semibold text-blue-700 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-700 text-base">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <footer className="w-full bg-white text-blue-700 text-center py-8 border-t border-blue-200">
        <p className="mb-2 font-semibold">
          RentWise – Smart Rentals, Simple Management
        </p>
        <p>© {new Date().getFullYear()} RentWise. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
