import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBook } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 text-white transition-all duration-300 ${
        scrolled 
          ? "bg-gray-900/95 backdrop-blur-md shadow-lg" 
          : "bg-gray-900"
      }`}
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo with Book Icon */}
      <Link to="/" className="flex items-center space-x-4 text-2xl font-bold hover:opacity-80 transition-opacity">
        <FaBook className="text-yellow-400 w-6 h-6" />
        <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-transparent bg-clip-text">
          ScribeSense
        </span>
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center space-x-16 text-lg font-medium">
        <Link
          to="/"
          className={`relative hover:text-yellow-400 transition-colors duration-200 ${
            location.pathname === "/" ? "text-yellow-400" : ""
          }`}
        >
          Home
          {location.pathname === "/" && (
            <motion.div
              layoutId="underline"
              className="absolute -bottom-1 left-0 right-0 h-0.5 bg-yellow-400"
            />
          )}
        </Link>
        <Link
          to="/contact"
          className={`relative hover:text-yellow-400 transition-colors duration-200 ${
            location.pathname === "/contact" ? "text-yellow-400" : ""
          }`}
        >
          Contact
          {location.pathname === "/contact" && (
            <motion.div
              layoutId="underline"
              className="absolute -bottom-1 left-0 right-0 h-0.5 bg-yellow-400"
            />
          )}
        </Link>
       
        <Link
          to="/register"
          className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Upload&Analyse
        </Link>
      </div>
    </motion.nav>
  );
}