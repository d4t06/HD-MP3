import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import firebaseConfig from "./firebaseConfig";

// Your web app's Firebase configuration

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
