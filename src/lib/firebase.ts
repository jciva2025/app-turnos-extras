
// src/lib/firebase.ts
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth'; // Descomentar para futura integración con Firebase Auth

// Configuración de Firebase de tu aplicación web
// IMPORTANTE: Reemplaza esto con la configuración real de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA3wx6PsUfMrCkZQlTccyiIQYd4M0FSet4",
  authDomain: "registro-de-extras.firebaseapp.com",
  projectId: "registro-de-extras",
  storageBucket: "registro-de-extras.firebasestorage.app",
  messagingSenderId: "453532368201",
  appId: "1:453532368201:web:05c3e23d4452de4503ee98",
  measurementId: "G-TBJ4X6MH6N"
};

let app: FirebaseApp;
let db: Firestore;
// let auth; // Para después

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

db = getFirestore(app);
// auth = getAuth(app); // Descomentar para usar Firebase Auth

export { db /*, auth */ };
