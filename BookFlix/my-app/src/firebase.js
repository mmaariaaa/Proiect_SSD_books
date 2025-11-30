// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDWb_H1rebH58itu63JBZf0QuPxOUaBleA",
  authDomain: "bookflix-3bab2.firebaseapp.com",
  projectId: "bookflix-3bab2",
  storageBucket: "bookflix-3bab2.appspot.com",
  messagingSenderId: "169368305858",
  appId: "1:169368305858:web:c7f1274458f8802151bb5b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// SERVICES
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
