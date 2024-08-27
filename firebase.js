// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDVH1Wd8EfwQEt8IQ-W9LkuZPmTQcTet5w",
  authDomain: "inventory-tracker-1cc16.firebaseapp.com",
  projectId: "inventory-tracker-1cc16",
  storageBucket: "inventory-tracker-1cc16.appspot.com",
  messagingSenderId: "346399579823",
  appId: "1:346399579823:web:6ca4ef9a887a6d5230be5a",
  measurementId: "G-ER7XBS39P8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };