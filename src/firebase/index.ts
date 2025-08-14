import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Initialize Firebase
const app = initializeApp({
  apiKey: import.meta.env.VITE_APIKEY,
  appId: import.meta.env.VITE_APPID,
  projectId: import.meta.env.VITE_PROJECTID,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
});

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };
