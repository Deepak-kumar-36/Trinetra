import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB_Dd0KZrU4E9C4U_3r6UKodxXleGdbmXw",
  authDomain: "trinetra-c4d6f.firebaseapp.com",
  projectId: "trinetra-c4d6f",
  storageBucket: "trinetra-c4d6f.firebasestorage.app",
  messagingSenderId: "677283899294",
  appId: "1:677283899294:web:4c9e76b1495f206173988f"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
