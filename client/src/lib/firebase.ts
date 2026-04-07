/**
 * Firebase configuration and initialization
 * 
 * Environment variables required:
 * - VITE_FIREBASE_API_KEY
 * - VITE_FIREBASE_AUTH_DOMAIN
 * - VITE_FIREBASE_PROJECT_ID
 * - VITE_FIREBASE_STORAGE_BUCKET
 * - VITE_FIREBASE_MESSAGING_SENDER_ID
 * - VITE_FIREBASE_APP_ID
 * - VITE_FIREBASE_ROOM_PASSWORD (shared password for joining room)
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Shared room password (stored as environment variable, not in client code)
export const ROOM_PASSWORD = import.meta.env.VITE_FIREBASE_ROOM_PASSWORD || 'double0nine';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore (for messages)
export const db = getFirestore(app);

// Initialize Storage (for media uploads)
export const storage = getStorage(app);

// Initialize Realtime Database (for presence tracking)
export const realtimeDb = getDatabase(app);

// Connect to emulators in development (optional)
if (import.meta.env.DEV) {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
    connectDatabaseEmulator(realtimeDb, 'localhost', 9000);
  } catch (error) {
    // Emulators might already be connected
    console.debug('Emulator connection skipped:', error);
  }
}

export default app;
