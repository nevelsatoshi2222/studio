// Firebase Configuration - Prevents duplicate app error
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your REAL Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTD57QBNRjULEDM4qZoQ3a86anTU8XcF8",
  authDomain: "public-governance-859029-c316e.firebaseapp.com",
  projectId: "public-governance-859029-c316e",
  storageBucket: "public-governance-859029-c316e.firebasestorage.app",
  messagingSenderId: "826113692111",
  appId: "1:826113692111:web:91cd2ee28ecedf17e6c2ba"
};

// Initialize Firebase only once to prevent duplicate app error
let app: FirebaseApp;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase App Initialized');
} else {
  app = getApps()[0];
  console.log('✅ Using Existing Firebase App');
}

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;

// Your existing token addresses (keep these if they exist)
export const IGC_TOKEN_MINT_ADDRESS = "your-igc-token-address";
export const PGC_TOKEN_MINT_ADDRESS = "your-pgc-token-address";