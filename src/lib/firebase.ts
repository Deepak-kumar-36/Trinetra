import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your actual Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyForNow",
  authDomain: "trinetra-mvp.firebaseapp.com",
  projectId: "trinetra-mvp",
  storageBucket: "trinetra-mvp.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
