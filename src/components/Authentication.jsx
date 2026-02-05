import Navbar from "./decoration/Navbar";
import Footer from "./decoration/footer";
import { useState } from "react";
import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Authintication() {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login / Signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  // -----------------------------
  // Handle Email/Password Submit
  // -----------------------------
  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      return setError("⚠ Please fill in all fields.");
    }

    try {
      if (isLogin) {
        // 🔹 LOGIN FLOW
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/upload");
      } else {
        // 🔹 SIGNUP FLOW
        if (password !== confirmPassword)
          return setError("❌ Passwords do not match.");

        await createUserWithEmailAndPassword(auth, email, password);
        navigate("/upload");
      }
    } catch (err) {
      // 🔹 Smart handling: try to sign up if user doesn’t exist
      if (err.code === "auth/user-not-found" && isLogin) {
        setError("User not found. Try signing up instead.");
      } else if (err.code === "auth/email-already-in-use" && !isLogin) {
        setError("User already exists. Try logging in instead.");
      } else {
        setError(err.message);
      }
    }
  };

  // -----------------------------
  // Google Auth (common for both)
  // -----------------------------
  const handleGoogleAuth = async () => {
    setError("");
    try {
      await signInWithPopup(auth, provider);
      navigate("/ ");
    } catch (err) {
      setError("Google authentication failed.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 flex justify-center items-center p-10 bg-gray-50">
        <form
          className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
          onSubmit={handleAuth}
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>

          {/* Email */}
          <input
            className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password */}
          <input
            className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Confirm Password (only in signup mode) */}
          {!isLogin && (
            <input
              className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}

          {/* Main Button */}
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition"
            type="submit"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>

          {/* Divider */}
          <div className="mt-4 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-2 text-gray-500 text-sm">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Continue with Google */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            className="flex items-center justify-center gap-2 mt-4 w-full border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 transition"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google logo"
              className="w-5 h-5"
            />
            <span className="text-gray-700 font-medium">
              Continue with Google
            </span>
          </button>

          {/* Toggle Between Login / Signup */}
          <p className="mt-4 text-center text-sm text-gray-600">
            {isLogin ? (
              <>
                Don’t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-blue-600 hover:underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-blue-600 hover:underline"
                >
                  Login
                </button>
              </>
            )}
          </p>

          {/* Error Message */}
          {error && (
            <p className="mt-3 text-red-600 text-center text-sm">{error}</p>
          )}
        </form>
      </div>
      <Footer />
    </div>
  );
}