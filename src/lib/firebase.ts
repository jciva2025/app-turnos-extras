
// src/lib/firebase.ts
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth'; // Descomentar para futura integración con Firebase Auth

// Configuración de Firebase de tu aplicación web
// IMPORTANTE: Reemplaza esto con la configuración real de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // Reemplaza con tu API key
  authDomain: "YOUR_AUTH_DOMAIN", // Reemplaza con tu Auth domain
  projectId: "YOUR_PROJECT_ID", // Reemplaza con tu Project ID
  storageBucket: "YOUR_STORAGE_BUCKET", // Reemplaza con tu Storage Bucket
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // Reemplaza con tu Messaging Sender ID
  appId: "YOUR_APP_ID" // Reemplaza con tu App ID
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
