// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDH_eE-_IE3_mATOwbHY1BOC2Ze4JdwKhY",
  authDomain: "crop-yeild.firebaseapp.com",
  databaseURL: "https://crop-yeild-default-rtdb.firebaseio.com",
  projectId: "crop-yeild",
  storageBucket: "crop-yeild.firebasestorage.app",
  messagingSenderId: "847090098679",
  appId: "1:847090098679:web:7e44685ea1229007ae0ef2",
  measurementId: "G-14RSM19HE4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };// firebase.js
