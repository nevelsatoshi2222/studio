import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ✅ YOUR REAL FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyCTD57QBNRjULEDM4qZoQ3a86anTU8XcF8",
  authDomain: "public-governance-859029-c316e.firebaseapp.com",
  projectId: "public-governance-859029-c316e",
  storageBucket: "public-governance-859029-c316e.firebasestorage.app",
  messagingSenderId: "826113692111",
  appId: "1:826113692111:web:91cd2ee28ecedf17e6c2ba"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;