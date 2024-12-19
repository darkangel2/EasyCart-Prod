import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQkaXwoguzwGkX2UyJWmx5yxa_OLej4pI",
  authDomain: "n-cart-56dc0.firebaseapp.com",
  projectId: "n-cart-56dc0",
  storageBucket: "n-cart-56dc0.firebasestorage.app",
  messagingSenderId: "457378096896",
  appId: "1:457378096896:web:8988da4840ae852d05b5e5",
  measurementId: "G-HBLK54E5VR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore

export { auth, db };
export default firebaseConfig;