// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAWC2BTHS_hm04508CBZKuRw95a1JQTEeQ",
  authDomain: "travelog-22f05.firebaseapp.com",
  projectId: "travelog-22f05",
  storageBucket: "travelog-22f05.firebasestorage.app",
  messagingSenderId: "622670897999",
  appId: "1:622670897999:web:c91c633d2116a1c368db3a",
  measurementId: "G-XX8RGNNMQ2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
let analytics: any;
isSupported().then((yes) => {
  if(yes) {
    analytics = getAnalytics(app);
  } else {
    console.log("Analytics not support");
    
  }
})
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };