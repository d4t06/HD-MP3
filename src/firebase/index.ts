import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Initialize Firebase
const app = initializeApp({
  apiKey: import.meta.env.VITE_APIKEY,
  appId: import.meta.env.VITE_APPID,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
});

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Initialize Storage
const stores = getStorage(app);

export { db, stores, auth, provider };
