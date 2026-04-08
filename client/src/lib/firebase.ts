/**
 * Firebase configuration and initialization
 * 
 * Uses environment variables if available, falls back to hardcoded config
 */

import { initializeApp, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';

// Firebase configuration - uses env vars with fallback to hardcoded values
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBhOe6nCG-ZlaDT_qePWqiJBxe8yZukDfM',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'chatventure-f3b0a.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'chatventure-f3b0a',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'chatventure-f3b0a.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '964388625642',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:964388625642:web:d8d0bf7eb742fdf2368b93',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || 'https://chatventure-f3b0a-default-rtdb.firebaseio.com',
};

// Shared room password
export const ROOM_PASSWORD = import.meta.env.VITE_FIREBASE_ROOM_PASSWORD || 'double0nine';

// Check if Firebase config is properly set
export const isFirebaseConfigured = (): boolean => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.authDomain &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
  );
};

// Initialize Firebase services with error handling
let app: any = null;
let db: any = null;
let storage: any = null;
let realtimeDb: any = null;

try {
  if (isFirebaseConfigured()) {
    // Check if Firebase app already exists
    try {
      app = getApp();
    } catch {
      // App doesn't exist, create it
      app = initializeApp(firebaseConfig);
    }
    
    // Initialize Firestore
    db = getFirestore(app);
    // Disable offline persistence for better compatibility
    db.settings = { experimentalForceLongPolling: true };
    
    // Initialize Storage
    storage = getStorage(app);
    
    // Initialize Realtime Database
    realtimeDb = getDatabase(app);
    
    console.log('✅ Firebase initialized successfully');
  } else {
    console.warn('Firebase not configured. Please set environment variables or check hardcoded config.');
  }
} catch (error) {
  console.error('Firebase initialization failed:', error);
}

export { app, db, storage, realtimeDb };
export default app;
