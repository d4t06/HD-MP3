import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPNpckpYiu009eSzHz_1YMlwHLtScgVjE",
  authDomain: "zingmp3-clone-61799.firebaseapp.com",
  projectId: "zingmp3-clone-61799",
  storageBucket: "zingmp3-clone-61799.appspot.com",
  messagingSenderId: "938280289868",
  appId: "1:938280289868:web:1b426fc2dba5d03dde96e9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app)

// Initialize Auth
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

// Initialize Storage
const store = getStorage(app)

export {db, store, auth, provider}