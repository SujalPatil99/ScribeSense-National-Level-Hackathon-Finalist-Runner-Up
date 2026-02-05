// Firebase 9 modular SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB1u-RrZcJ7mAvVQqDpHva2Ur5-xY1DHFk",
  authDomain: "scribesense1.firebaseapp.com",
  projectId: "scribesense1",
  storageBucket: "scribesense1.firebasestorage.app",
  messagingSenderId: "889831715885",
  appId: "1:889831715885:web:c09a61eb124bcb7f62f4a4",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);