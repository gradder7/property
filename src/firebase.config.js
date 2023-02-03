// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD-RE4GkQVE-I_F0nbW1vXQoow8TUlpOHU",
  authDomain: "property-cd347.firebaseapp.com",
  projectId: "property-cd347",
  storageBucket: "property-cd347.appspot.com",
  messagingSenderId: "375786551829",
  appId: "1:375786551829:web:eff6accc9690a722ebac1c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db =getFirestore();
