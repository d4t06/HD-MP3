import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Initialize Firebase
const app = initializeApp({
  apiKey: import.meta.env.VITE_APIKEY,
  // storageBucket: "zingmp3-clone-61799.appspot.com",
  appId: "1:938280289868:web:e36c48cfbd55e4a8de96e",
  projectId: "zingmp3-clone-61799",
  authDomain: "zingmp3-clone-61799.firebaseapp.com",
  // messagingSenderId: "938280289868",
});

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };
