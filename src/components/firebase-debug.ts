import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  "projectId": "public-governance-859029-c316e",
  "appId": "1:826113692111:web:70f966e4dc292f1ae6c2ba",
  "apiKey": "AIzaSyCTD57QBNRjULEDM4qZoQ3a86anTU8XcF8",
  "authDomain": "public-governance-859029-c316e.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "826113692111"
};

// Initialize Firebase
console.log('🔄 Initializing Firebase with config:', firebaseConfig);

try {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  
  console.log('✅ Firebase initialized successfully');
  console.log('🔑 Auth domain:', auth.config.authDomain);
  console.log('📊 Firestore project:', firestore.app.options.projectId);
  
  export { app, auth, firestore };
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  throw error;
}