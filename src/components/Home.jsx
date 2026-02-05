import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./decoration/Navbar";
import Footer from "./decoration/footer";
import { motion, useAnimation } from "framer-motion";
import './output.css'

export default function Home() {
  const navigate = useNavigate();
  const controls = useAnimation();

  useEffect(() => {
    controls.start({ opacity: 1, y: 0 });
  }, [controls]);

  const handleGetStarted = () => navigate("/register");

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <motion.section
        className="relative flex flex-col items-center justify-center flex-1 px-6 py-32 text-center bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white overflow-hidden"
        initial={{ opacity: 0, y: -30 }}
        animate={controls}
        transition={{ duration: 1 }}
      >
        {/* Soft background glows */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10"
        >
          <div className="inline-block mb-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
            ✨ AI-Powered Document Intelligence
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 leading-tight">
            Transform Handwriting into
            <span className="block bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 text-transparent bg-clip-text">
              Digital Intelligence
            </span>
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mb-10 text-gray-200 leading-relaxed">
            Convert handwritten documents to searchable text with AI-powered summarization, keyword extraction, and intelligent highlighting—all in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleGetStarted}
              className="group bg-white text-indigo-600 font-bold px-10 py-4 rounded-xl shadow-2xl hover:shadow-white/20 hover:scale-105 transition-all duration-300"
            >
              Get Started Free
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </button>
            {/* <button
              onClick={() => navigate("/demo")}
              className="bg-transparent border-2 border-white text-white font-bold px-10 py-4 rounded-xl hover:bg-white hover:text-indigo-600 transition-all duration-300"
            >
              Watch Demo
            </button> */}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative z-10 mt-20 grid grid-cols-2 md:grid-cols-3 gap-8 max-w-3xl"
        >
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">95%+</div>
            <div className="text-sm text-gray-300">OCR Accuracy</div>
          </div>
          <div className="text-center border-l border-r border-white/20 hidden md:block">
            <div className="text-4xl font-bold mb-2">90+</div>
            <div className="text-sm text-gray-300">Languages Supported</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">5s</div>
            <div className="text-sm text-gray-300">Avg Processing Time</div>
          </div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="px-6 py-24 bg-white"
        initial={{ opacity: 0, y: 30 }}
        animate={controls}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            Powerful Features for Document Intelligence
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-16">
            Everything you need to digitize, analyze, and understand handwritten content
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature cards */}
            {[
              {
                icon: "📝",
                title: "Advanced OCR",
                color: "from-indigo-500 to-purple-500",
                text: [
                  "95%+ accuracy rate",
                  "Multi-language support",
                  "Handles poor quality images",
                ],
              },
              {
                icon: "🤖",
                title: "AI Summarization",
                color: "from-purple-500 to-pink-500",
                text: [
                  "Intelligent key point extraction",
                  "Customizable summary length",
                  "Context-aware analysis",
                ],
              },
              {
                icon: "🎯",
                title: "Smart Highlighting",
                color: "from-pink-500 to-orange-500",
                text: [
                  "Keyword extraction",
                  "Date & entity recognition",
                  "Visual highlighting",
                ],
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="group bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${f.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <span className="text-3xl">{f.icon}</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{f.title}</h3>
                <ul className="space-y-2 text-sm text-gray-600 text-left">
                  {f.text.map((t, j) => (
                    <li key={j} className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span> {t}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="px-6 py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white"
        initial={{ opacity: 0 }}
        animate={controls}
        transition={{ duration: 1, delay: 0.9 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Documents?
          </h2>
          <p className="text-xl mb-10 text-gray-100">
            Join thousands of users who are already digitizing their handwritten content with ScribeSense.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="bg-white text-indigo-600 font-bold px-10 py-4 rounded-xl shadow-lg hover:scale-105 transition-transform"
            >
              Start Free Trial
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="bg-transparent border-2 border-white text-white font-bold px-10 py-4 rounded-xl hover:bg-white/10 transition-all"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}