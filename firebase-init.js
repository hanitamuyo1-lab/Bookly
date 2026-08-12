// Firebase setup — project: bookly-c1f58
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB9QoRy9p_lBhQwpkIBiTgIW5hLdMlF-BM",
  authDomain: "bookly-c1f58.firebaseapp.com",
  projectId: "bookly-c1f58",
  storageBucket: "bookly-c1f58.firebasestorage.app",
  messagingSenderId: "341639877635",
  appId: "1:341639877635:web:786c99e2a6c0fc93c1aa36",
  measurementId: "G-3N6TTVX2J3",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
