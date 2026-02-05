// import Navbar from "./decoration/Navbar";
// import Footer from "./decoration/footer";
// import { useState } from "react";
// import { auth } from "./firebase";
// import {
//   signInWithEmailAndPassword,
//   GoogleAuthProvider,
//   signInWithPopup,
// } from "firebase/auth";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   // ---------------------
//   // Email/Password Login
//   // ---------------------
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       navigate("/upload");
//     } catch (err) {
//       if (err.code === "auth/user-not-found") {
//         setError("No account found with this email.");
//       } else if (err.code === "auth/wrong-password") {
//         setError("Incorrect password. Please try again.");
//       } else if (err.code === "auth/invalid-email") {
//         setError("Invalid email format.");
//       } else if (err.code === "auth/too-many-requests") {
//         setError("Too many failed attempts. Please try again later.");
//       } else {
//         setError("Login failed. Please check your credentials.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------------------
//   // Google Login
//   // ---------------------
//   const handleGoogleLogin = async () => {
//     setError("");
//     setLoading(true);
//     try {
//       const provider = new GoogleAuthProvider();
//       await signInWithPopup(auth, provider);
//       navigate("/upload");
//     } catch (err) {
//       setError("Google login failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col min-h-screen mt-15">
//       <Navbar />
      
//       <div className="flex-1 flex bg-white">
//         <div className="w-full grid md:grid-cols-2">
          
//           {/* Left Side - Branding */}
//           <motion.div
//             initial={{ opacity: 0, x: -50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8 }}
//             className="hidden md:flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 min-h-screen p-12"
//           >
//             <div className="max-w-lg text-white">
//               <h1 className="text-5xl font-extrabold mb-6">
//                 Welcome to<br />
//                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-200 to-purple-200">
//                   ScribeSense
//                 </span>
//               </h1>
//               <p className="text-xl mb-8 text-gray-100 leading-relaxed">
//                 Transform handwritten documents into digital intelligence with AI-powered OCR, 
//                 summarization, and keyword highlighting.
//               </p>
              
//               <div className="space-y-4">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
//                     <span className="text-2xl">⚡</span>
//                   </div>
//                   <div>
//                     <h3 className="font-bold">Lightning Fast</h3>
//                     <p className="text-sm text-gray-200">Process documents in under 10 seconds</p>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
//                     <span className="text-2xl">🎯</span>
//                   </div>
//                   <div>
//                     <h3 className="font-bold">95%+ Accuracy</h3>
//                     <p className="text-sm text-gray-200">Industry-leading OCR technology</p>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
//                     <span className="text-2xl">🌍</span>
//                   </div>
//                   <div>
//                     <h3 className="font-bold">Multi-Language</h3>
//                     <p className="text-sm text-gray-200">Support for 20+ languages</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </motion.div>

//           {/* Right Side - Login Form */}
//           <motion.div
//             initial={{ opacity: 0, x: 50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8 }}
//             className="flex items-center justify-center min-h-screen p-8 bg-gray-50"
//           >
//             <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-lg">
//               <div className="text-center mb-8">
//                 <h2 className="text-4xl font-bold text-gray-900 mb-2">
//                   Welcome Back
//                 </h2>
//                 <p className="text-gray-600">
//                   Sign in to continue to ScribeSense
//                 </p>
//               </div>

//               <form onSubmit={handleLogin}>
//                 {/* Email Input */}
//                 <div className="mb-5">
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Email Address
//                   </label>
//                   <div className="relative">
//                     <input
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
//                       type="email"
//                       placeholder="you@example.com"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       required
//                     />
//                     <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
//                       ✉
//                     </span>
//                   </div>
//                 </div>

//                 {/* Password Input */}
//                 <div className="mb-6">
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Password
//                   </label>
//                   <div className="relative">
//                     <input
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
//                       type={showPassword ? "text" : "password"}
//                       placeholder="••••••••"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       required
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                     >
//                       {showPassword ? "👁" : "🔒"}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Remember Me & Forgot Password */}
//                 <div className="flex items-center justify-between mb-6">
//                   <label className="flex items-center cursor-pointer">
//                     <input
//                       type="checkbox"
//                       className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                     />
//                     <span className="ml-2 text-sm text-gray-600">Remember me</span>
//                   </label>
//                   <button
//                     type="button"
//                     onClick={() => navigate("/forgot-password")}
//                     className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
//                   >
//                     Forgot password?
//                   </button>
//                 </div>

//                 {/* Login Button */}
//                 <button
//                   className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl w-full font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
//                   type="submit"
//                   disabled={loading}
//                 >
//                   {loading ? (
//                     <span className="flex items-center justify-center gap-2">
//                       <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                       </svg>
//                       Signing in...
//                     </span>
//                   ) : (
//                     "Sign In"
//                   )}
//                 </button>
//               </form>

//               {/* Divider */}
//               <div className="mt-6 mb-6 flex items-center">
//                 <div className="flex-grow border-t border-gray-300"></div>
//                 <span className="mx-4 text-gray-500 text-sm font-medium">OR</span>
//                 <div className="flex-grow border-t border-gray-300"></div>
//               </div>

//               {/* Continue with Google */}
//               <button
//                 type="button"
//                 onClick={handleGoogleLogin}
//                 disabled={loading}
//                 className="flex items-center justify-center gap-3 w-full border-2 border-gray-300 px-6 py-3 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <img
//                   src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
//                   alt="Google logo"
//                   className="w-5 h-5"
//                 />
//                 <span className="text-gray-700">Continue with Google</span>
//               </button>

//               {/* Error Message */}
//               {error && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl"
//                 >
//                   <p className="text-red-600 text-sm text-center font-medium flex items-center justify-center gap-2">
//                     <span>⚠</span>
//                     {error}
//                   </p>
//                 </motion.div>
//               )}

//               {/* Sign Up Link */}
//               <div className="mt-8 text-center">
//                 <p className="text-gray-600">
//                   Don't have an account?{" "}
//                   <button
//                     type="button"
//                     onClick={() => navigate("/register")}
//                     className="text-indigo-600 hover:text-indigo-700 font-bold"
//                   >
//                     Sign Up
//                   </button>
//                 </p>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>
      
//       <Footer />
//     </div>
//   );
// }

// import Navbar from "./decoration/Navbar";
// import Footer from "./decoration/footer";
// import { useState } from "react";
// import { auth } from "./firebase";
// import {
//   signInWithEmailAndPassword,
//   GoogleAuthProvider,
//   signInWithPopup,
// } from "firebase/auth";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   // ---------------------
//   // Email/Password Login
//   // ---------------------
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       navigate("/upload");
//     } catch (err) {
//       if (err.code === "auth/user-not-found") {
//         setError("No account found with this email.");
//       } else if (err.code === "auth/wrong-password") {
//         setError("Incorrect password. Please try again.");
//       } else if (err.code === "auth/invalid-email") {
//         setError("Invalid email format.");
//       } else if (err.code === "auth/too-many-requests") {
//         setError("Too many failed attempts. Please try again later.");
//       } else {
//         setError("Login failed. Please check your credentials.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------------------
//   // Google Login
//   // ---------------------
//   const handleGoogleLogin = async () => {
//     setError("");
//     setLoading(true);
//     try {
//       const provider = new GoogleAuthProvider();
//       await signInWithPopup(auth, provider);
//       navigate("/upload");
//     } catch (err) {
//       setError("Google login failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col min-h-screen">
//       <Navbar />
      
//       <div className="flex-1 flex bg-white pt-16">
//         <div className="w-full grid md:grid-cols-2 min-h-screen">
          
//           {/* Left Side - Branding */}
//           <motion.div
//             initial={{ opacity: 0, x: -50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8 }}
//             className="hidden md:flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-12 min-h-screen"
//           >
//             <div className="max-w-lg text-white">
//               <h1 className="text-5xl font-extrabold mb-6">
//                 Welcome to<br />
//                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-200 to-purple-200">
//                   ScribeSense
//                 </span>
//               </h1>
//               <p className="text-xl mb-8 text-gray-100 leading-relaxed">
//                 Transform handwritten documents into digital intelligence with AI-powered OCR, 
//                 summarization, and keyword highlighting.
//               </p>
              
//               <div className="space-y-4">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
//                     <span className="text-2xl">⚡</span>
//                   </div>
//                   <div>
//                     <h3 className="font-bold">Lightning Fast</h3>
//                     <p className="text-sm text-gray-200">Process documents in under 10 seconds</p>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
//                     <span className="text-2xl">🎯</span>
//                   </div>
//                   <div>
//                     <h3 className="font-bold">95%+ Accuracy</h3>
//                     <p className="text-sm text-gray-200">Industry-leading OCR technology</p>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
//                     <span className="text-2xl">🌍</span>
//                   </div>
//                   <div>
//                     <h3 className="font-bold">Multi-Language</h3>
//                     <p className="text-sm text-gray-200">Support for 20+ languages</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </motion.div>

//           {/* Right Side - Login Form */}
//           <motion.div
//             initial={{ opacity: 0, x: 50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8 }}
//             className="flex items-center justify-center p-8 bg-gray-50 min-h-screen"
//           >
//             <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-lg">
//               <div className="text-center mb-8">
//                 <h2 className="text-4xl font-bold text-gray-900 mb-2">
//                   Welcome Back
//                 </h2>
//                 <p className="text-gray-600">
//                   Sign in to continue to ScribeSense
//                 </p>
//               </div>

//               <form onSubmit={handleLogin}>
//                 {/* Email Input */}
//                 <div className="mb-5">
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Email Address
//                   </label>
//                   <div className="relative">
//                     <input
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
//                       type="email"
//                       placeholder="you@example.com"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       required
//                     />
//                     <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
//                       ✉
//                     </span>
//                   </div>
//                 </div>

//                 {/* Password Input */}
//                 <div className="mb-6">
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Password
//                   </label>
//                   <div className="relative">
//                     <input
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
//                       type={showPassword ? "text" : "password"}
//                       placeholder="••••••••"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       required
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                     >
//                       {showPassword ? "👁" : "🔒"}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Remember Me & Forgot Password */}
//                 <div className="flex items-center justify-between mb-6">
//                   <label className="flex items-center cursor-pointer">
//                     <input
//                       type="checkbox"
//                       className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                     />
//                     <span className="ml-2 text-sm text-gray-600">Remember me</span>
//                   </label>
//                   <button
//                     type="button"
//                     onClick={() => navigate("/forgot-password")}
//                     className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
//                   >
//                     Forgot password?
//                   </button>
//                 </div>

//                 {/* Login Button */}
//                 <button
//                   className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl w-full font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
//                   type="submit"
//                   disabled={loading}
//                 >
//                   {loading ? (
//                     <span className="flex items-center justify-center gap-2">
//                       <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                       </svg>
//                       Signing in...
//                     </span>
//                   ) : (
//                     "Sign In"
//                   )}
//                 </button>
//               </form>

//               {/* Divider */}
//               <div className="mt-6 mb-6 flex items-center">
//                 <div className="flex-grow border-t border-gray-300"></div>
//                 <span className="mx-4 text-gray-500 text-sm font-medium">OR</span>
//                 <div className="flex-grow border-t border-gray-300"></div>
//               </div>

//               {/* Continue with Google */}
//               <button
//                 type="button"
//                 onClick={handleGoogleLogin}
//                 disabled={loading}
//                 className="flex items-center justify-center gap-3 w-full border-2 border-gray-300 px-6 py-3 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <img
//                   src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
//                   alt="Google logo"
//                   className="w-5 h-5"
//                 />
//                 <span className="text-gray-700">Continue with Google</span>
//               </button>

//               {/* Error Message */}
//               {error && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl"
//                 >
//                   <p className="text-red-600 text-sm text-center font-medium flex items-center justify-center gap-2">
//                     <span>⚠</span>
//                     {error}
//                   </p>
//                 </motion.div>
//               )}

//               {/* Sign Up Link */}
//               <div className="mt-8 text-center">
//                 <p className="text-gray-600">
//                   Don't have an account?{" "}
//                   <button
//                     type="button"
//                     onClick={() => navigate("/register")}
//                     className="text-indigo-600 hover:text-indigo-700 font-bold"
//                   >
//                     Sign Up
//                   </button>
//                 </p>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>
      
//       <Footer />
//     </div>
//   );
// }
import Navbar from "./decoration/Navbar";
import Footer from "./decoration/footer";
import { useState } from "react";
import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // ---------------------
  // Email/Password Login
  // ---------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/upload");
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email format.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later.");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ---------------------
  // Google Login
  // ---------------------
  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/upload");
    } catch (err) {
      setError("Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Centered Login Form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-8 mt-15">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-white p-10 rounded-2xl shadow-lg"
        >
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600">
              Sign in to continue to ScribeSense
            </p>
          </div>

          <form onSubmit={handleLogin}>
            {/* Email Input */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  ✉
                </span>
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? "👁" : "🔒"}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl w-full font-semibold hover:from-purple-700 hover:to-purple-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 mb-6 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500 text-sm font-medium">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Continue with Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex items-center justify-center gap-3 w-full border border-gray-300 px-6 py-3 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed bg-white"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google logo"
              className="w-5 h-5"
            />
            <span className="text-gray-700">Continue with Google</span>
          </button>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl"
            >
              <p className="text-red-600 text-sm text-center font-medium flex items-center justify-center gap-2">
                <span>⚠</span>
                {error}
              </p>
            </motion.div>
          )}

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-purple-600 hover:text-purple-700 font-semibold"
              >
                Sign Up
              </button>
            </p>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
}