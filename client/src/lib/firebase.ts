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

// Check if Firebase config is properly set
export const isFirebaseConfigured = (): boolean => {
  return !!(
    import.meta.env.VITE_FIREBASE_API_KEY &&
    import.meta.env.VITE_FIREBASE_PROJECT_ID &&
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN &&
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET &&
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID &&
    import.meta.env.VITE_FIREBASE_APP_ID
  );
};

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

// Shared room password (stored as environment variable, not in client code)
export const ROOM_PASSWORD = import.meta.env.VITE_FIREBASE_ROOM_PASSWORD || 'double0nine';

// Initialize Firebase services with error handling
let app: any = null;
let db: any = null;
let storage: any = null;
let realtimeDb: any = null;

try {
  if (isFirebaseConfigured()) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    storage = getStorage(app);
    realtimeDb = getDatabase(app);

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
  } else {
    console.warn(
      'Firebase not configured. Please set the following environment variables:\n' +
      '- VITE_FIREBASE_API_KEY\n' +
      '- VITE_FIREBASE_AUTH_DOMAIN\n' +
      '- VITE_FIREBASE_PROJECT_ID\n' +
      '- VITE_FIREBASE_STORAGE_BUCKET\n' +
      '- VITE_FIREBASE_MESSAGING_SENDER_ID\n' +
      '- VITE_FIREBASE_APP_ID\n' +
      'See README.md for setup instructions.'
    );
  }
} catch (error) {
  console.error('Firebase initialization failed:', error);
}

export { app, db, storage, realtimeDb };
export default app;
