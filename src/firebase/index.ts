import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Initialize Firebase
const app = initializeApp({
  apiKey: import.meta.env.VITE_APIKEY,
  appId:
    import.meta.env.VITE_APPID || "1:938280289868:web:e36c48cfbd55e4a8de96e",
  projectId: import.meta.env.VITE_PROJECTID || "zingmp3-clone-61799",
  authDomain:
    import.meta.env.VITE_AUTHDOMAIN || "zingmp3-clone-61799.firebaseapp.com",
});

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };
