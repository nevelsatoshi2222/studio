
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

// Wallet and Token Addresses
export const CREATOR_TREASURY_WALLET_ADDRESS = "CjKE4q6gtaHwvjnwPXyFSG9pySg5uBArFVRNseFqzWCp"; // General Creator Wallet

// DEVNET ADDRESSES - REPLACE WITH MAINNET FOR PRODUCTION
export const PGC_TOKEN_MINT_ADDRESS = "9ocWa8cfmNJQE8bC4s8gRLH7y5fRJtzpDYUhcKDpyW8o"; // Your PGC Mint Address
export const IGC_TOKEN_MINT_ADDRESS = "YOUR_IGC_TOKEN_MINT_ADDRESS_HERE"; // Placeholder
export const USDT_MINT_ADDRESS = "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"; // This is the standard USDT mint on Solana Devnet

// USDT Treasury Addresses for different networks
export const CREATOR_TREASURY_SOLANA_USDT = "AGrrknPZHNMKy1c94UyT5X8NmP52xKDXqTCfeWTEQvyq"; // Your Solana USDT receiving wallet
export const CREATOR_TREASURY_ETH_USDT = "0x6993318b80d7520b1ee1dc5d434c6b0105394661"; 
export const CREATOR_TREASURY_BSC_USDT = "0x6993318b80d7520b1ee1dc5d434c6b0105394661";
export const CREATOR_TREASURY_TRC20_USDT = "TUHziWJsVj8PjTcesCesMxRTiA7eWHKBnF";

// This is the wallet that holds the 2M PGC for the presale
export const PGC_PRESALE_RESERVE_WALLET = "7fkp93Prj8bLn6uNQCuEDkfcubw6dt7JZJjAHSTJubVu";

// Commission Configuration
export const COMMISSION_CONFIG = {
  LEVEL_1_5_RATE: 0.002, // 0.2%
  LEVEL_6_15_RATE: 0.001, // 0.1%
  MAX_LEVELS: 15,
  PAID_REGISTRATION_BONUS: 50, // USD
  TOTAL_COMMISSION_POOL: 0.02, // 2% total
};

    