import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyASFy9PmtwHt9Pa_SvHy5jHlj1EfugsRk4",
  authDomain: "trinetra-f1bbf.firebaseapp.com",
  projectId: "trinetra-f1bbf",
  storageBucket: "trinetra-f1bbf.firebasestorage.app",
  messagingSenderId: "99369902243",
  appId: "1:99369902243:web:fa29e9e1897edd0143df16"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
