// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLNtmy2mTXLCWjzb0i7H9rUOrjmvXldtQ",
  authDomain: "winnereliminating.firebaseapp.com",
  projectId: "winnereliminating",
  storageBucket: "winnereliminating.firebasestorage.app",
  messagingSenderId: "396911124975",
  appId: "1:396911124975:web:4bfcba5d036d9a1f52d61a",
  measurementId: "G-K7NPRJJ7NL"
};

// Initialize Firebase
// Use getApps() to prevent re-initialization during hot-reloading
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Analytics needs to be handled differently because it only works in the browser
let analytics: any = null;

if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, analytics };

