import Navbar from "./decoration/Navbar";
import Footer from "./decoration/footer";
import { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { motion } from "framer-motion";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    
    try {
      await addDoc(collection(db, "feedbacks"), {
        name,
        email,
        subject,
        message,
        createdAt: Timestamp.now()
      });
      setStatus("success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      
      // Clear success message after 5 seconds
      setTimeout(() => setStatus(""), 5000);
    } catch (err) {
      console.error("Firestore error:", err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white py-20 px-6 mt-10">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
              Get in Touch
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
              Have questions or feedback? We'd love to hear from you. Our team is here to help!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="flex-1 py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          
          {/* Left Side - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Let's Connect
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Whether you have a question about features, pricing, need support, 
                or anything else, our team is ready to answer all your questions.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📧</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">Email Us</h3>
                    <p className="text-gray-600 text-sm mb-2">We'll respond within 24 hours</p>
                    <a href="mailto:support@scribesense.com" className="text-indigo-600 hover:text-indigo-700 font-medium">
                      support@scribesense.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">💬</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">Live Chat</h3>
                    <p className="text-gray-600 text-sm mb-2">Available Mon-Fri, 9AM-6PM EST</p>
                    <button className="text-purple-600 hover:text-purple-700 font-medium">
                      Start a conversation →
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📍</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">Office Location</h3>
                    <p className="text-gray-600 text-sm">
                      123 Innovation Drive<br />
                      San Francisco, CA 94102<br />
                      United States
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <button className="w-12 h-12 bg-white rounded-xl border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all flex items-center justify-center">
                  <span className="text-xl">𝕏</span>
                </button>
                <button className="w-12 h-12 bg-white rounded-xl border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all flex items-center justify-center">
                  <span className="text-xl">in</span>
                </button>
                <button className="w-12 h-12 bg-white rounded-xl border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all flex items-center justify-center">
                  <span className="text-xl">f</span>
                </button>
                <button className="w-12 h-12 bg-white rounded-xl border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all flex items-center justify-center">
                  <span className="text-xl">📷</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-100">
              <h2 className="text-3xl font-bold mb-2 text-gray-900">Send us a Message</h2>
              <p className="text-gray-600 mb-8">Fill out the form below and we'll get back to you shortly.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-gray-800"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-gray-800"
                    placeholder="Enter Email here"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Subject Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-gray-800"
                    placeholder="Enter Subject?"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>

                {/* Message Textarea */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-gray-800 resize-none"
                    placeholder="Tell us more about your inquiry..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Send Message"
                  )}
                </button>

                {/* Success Message */}
                {status === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-green-50 border border-green-200 rounded-xl"
                  >
                    <p className="text-green-700 text-sm text-center font-medium flex items-center justify-center gap-2">
                      <span>✅</span>
                      Message sent successfully! We'll get back to you soon.
                    </p>
                  </motion.div>
                )}

                {/* Error Message */}
                {status === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border border-red-200 rounded-xl"
                  >
                    <p className="text-red-600 text-sm text-center font-medium flex items-center justify-center gap-2">
                      <span>⚠</span>
                      Error sending message. Please try again.
                    </p>
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Quick answers to common questions
            </p>
          </div>

          <div className="space-y-4">
            <details className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-indigo-300 transition-colors">
              <summary className="font-bold text-lg text-gray-900 cursor-pointer">
                How accurate is the OCR technology?
              </summary>
              <p className="mt-3 text-gray-600">
                Our AI-powered OCR achieves 95%+ accuracy on handwritten documents, even with messy handwriting or poor image quality.
              </p>
            </details>

            <details className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-indigo-300 transition-colors">
              <summary className="font-bold text-lg text-gray-900 cursor-pointer">
                What file formats are supported?
              </summary>
              <p className="mt-3 text-gray-600">
                We support JPG, PNG, PDF, and most common image formats. Files can be up to 10MB in size.
              </p>
            </details>

            <details className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-indigo-300 transition-colors">
              <summary className="font-bold text-lg text-gray-900 cursor-pointer">
                Is my data secure and private?
              </summary>
              <p className="mt-3 text-gray-600">
                Yes! All documents are encrypted during upload and processing. We never share your data with third parties.
              </p>
            </details>

            <details className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-indigo-300 transition-colors">
              <summary className="font-bold text-lg text-gray-900 cursor-pointer">
                How long does processing take?
              </summary>
              <p className="mt-3 text-gray-600">
                Most documents are processed in under 10 seconds. Larger or more complex documents may take up to 30 seconds.
              </p>
            </details>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}