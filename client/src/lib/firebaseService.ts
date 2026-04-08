/**
 * Firebase Service: Handles all Firebase operations
 * - Real-time message sync
 * - Media uploads
 * - Presence tracking
 * - Typing indicators
 */

import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import {
  ref as dbRef,
  set,
  remove,
  onValue,
  off,
} from 'firebase/database';
import { db, storage, realtimeDb, isFirebaseConfigured } from './firebase';

interface Message {
  id: string;
  sender: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'file';
  content: string;
  fileName?: string;
  fileSize?: number;
  reactions?: { [emoji: string]: string[] };
  createdAt: number;
  expiresAt: number;
}

/**
 * Listen to real-time messages from Firestore
 * @param callback - Function to call when messages change
 * @returns Unsubscribe function
 */
export function subscribeToMessages(
  callback: (messages: Message[]) => void
): () => void {
  if (!isFirebaseConfigured() || !db) {
    console.warn('Firebase not configured. Messages will not sync.');
    return () => {};
  }

  try {
    const messagesCollection = collection(db, 'messages');
    const q = query(messagesCollection, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages: Message[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        messages.push({
          id: doc.id,
          sender: data.sender,
          type: data.type,
          content: data.content,
          fileName: data.fileName,
          fileSize: data.fileSize,
          reactions: data.reactions,
          createdAt: data.createdAt?.toMillis?.() || data.createdAt || Date.now(),
          expiresAt: data.expiresAt?.toMillis?.() || data.expiresAt || Date.now(),
        });
      });
      callback(messages);
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to messages:', error);
    return () => {};
  }
}

/**
 * Send a text message to Firestore
 */
export async function sendMessage(
  sender: string,
  content: string,
  type: 'text' | 'image' | 'video' | 'audio' | 'file' = 'text',
  fileName?: string,
  fileSize?: number
): Promise<string> {
  console.log('📤 sendMessage called:', { sender, type, contentLength: content.length });
  
  if (!isFirebaseConfigured() || !db) {
    console.error('❌ Firebase not configured');
    throw new Error('Firebase not configured. Please set environment variables.');
  }

  try {
    const now = Date.now();
    const expiresAt = now + 24 * 60 * 60 * 1000; // 24 hours

    console.log('📝 Adding message to Firestore...');
    // Build message object without undefined fields
    const messageData: any = {
      sender,
      type,
      content,
      reactions: {},
      createdAt: Timestamp.now(),
      expiresAt: Timestamp.fromMillis(expiresAt),
    };
    
    // Only add optional fields if they have values
    if (fileName !== undefined) messageData.fileName = fileName;
    if (fileSize !== undefined) messageData.fileSize = fileSize;
    
    const docRef = await addDoc(collection(db, 'messages'), messageData);

    console.log('✅ Message sent successfully:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error sending message:', error);
    throw error;
  }
}

/**
 * Upload media file to Firebase Storage
 */
export async function uploadMedia(
  file: File,
  messageId: string,
  type: 'image' | 'video' | 'audio' | 'file'
): Promise<string> {
  if (!isFirebaseConfigured() || !storage) {
    throw new Error('Firebase not configured. Please set environment variables.');
  }

  try {
    const timestamp = Date.now();
    const storagePath = `uploads/${type}/${timestamp}_${file.name}`;
    const fileRef = ref(storage, storagePath);

    await uploadBytes(fileRef, file);
    const downloadUrl = await getDownloadURL(fileRef);

    return downloadUrl;
  } catch (error) {
    console.error('Error uploading media:', error);
    throw error;
  }
}

/**
 * Add reaction to a message
 */
export async function addReaction(
  messageId: string,
  emoji: string,
  username: string
): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase not configured. Please set environment variables.');
  }

  try {
    const { getDoc } = await import('firebase/firestore');
    const messageRef = doc(db, 'messages', messageId);
    const messageSnap = await getDoc(messageRef);

    if (messageSnap.exists()) {
      const reactions = messageSnap.data().reactions || {};
      const emojiReactions = reactions[emoji] || [];

      if (!emojiReactions.includes(username)) {
        emojiReactions.push(username);
      }

      reactions[emoji] = emojiReactions;
      await updateDoc(messageRef, { reactions });
    }
  } catch (error) {
    console.error('Error adding reaction:', error);
    throw error;
  }
}

/**
 * Remove reaction from a message
 */
export async function removeReaction(
  messageId: string,
  emoji: string,
  username: string
): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase not configured. Please set environment variables.');
  }

  try {
    const { getDoc } = await import('firebase/firestore');
    const messageRef = doc(db, 'messages', messageId);
    const messageSnap = await getDoc(messageRef);

    if (messageSnap.exists()) {
      const reactions = messageSnap.data().reactions || {};
      const emojiReactions = reactions[emoji] || [];
      const index = emojiReactions.indexOf(username);

      if (index > -1) {
        emojiReactions.splice(index, 1);
      }

      if (emojiReactions.length === 0) {
        delete reactions[emoji];
      } else {
        reactions[emoji] = emojiReactions;
      }

      await updateDoc(messageRef, { reactions });
    }
  } catch (error) {
    console.error('Error removing reaction:', error);
    throw error;
  }
}

/**
 * Set user as online in Realtime Database
 */
export function setUserOnline(username: string): () => void {
  if (!isFirebaseConfigured() || !realtimeDb) {
    console.warn('Firebase not configured. Presence tracking disabled.');
    return () => {};
  }

  try {
    const userRef = dbRef(realtimeDb, `presence/${username}`);

    set(userRef, {
      online: true,
      lastSeen: Date.now(),
    });

    // Return cleanup function to set user offline
    return () => {
      try {
        remove(userRef);
      } catch (error) {
        console.error('Error removing user from presence:', error);
      }
    };
  } catch (error) {
    console.error('Error setting user online:', error);
    return () => {};
  }
}

/**
 * Listen to online users count
 */
export function subscribeToOnlineCount(
  callback: (count: number) => void
): () => void {
  if (!isFirebaseConfigured() || !realtimeDb) {
    console.warn('Firebase not configured. Online count disabled.');
    return () => {};
  }

  try {
    const presenceRef = dbRef(realtimeDb, 'presence');

    const listener = onValue(presenceRef, (snapshot) => {
      if (snapshot.exists()) {
        const users = snapshot.val();
        const onlineCount = Object.keys(users).length;
        callback(onlineCount);
      } else {
        callback(0);
      }
    });

    // Return unsubscribe function
    return () => {
      try {
        off(presenceRef, 'value', listener);
      } catch (error) {
        console.error('Error unsubscribing from online count:', error);
      }
    };
  } catch (error) {
    console.error('Error subscribing to online count:', error);
    return () => {};
  }
}

/**
 * Set typing indicator for user
 */
export function setTypingIndicator(username: string): void {
  if (!isFirebaseConfigured() || !realtimeDb) {
    return;
  }

  try {
    const typingRef = dbRef(realtimeDb, `typing/${username}`);
    set(typingRef, {
      typing: true,
      timestamp: Date.now(),
    });

    // Auto-clear after 3 seconds
    setTimeout(() => {
      try {
        remove(typingRef);
      } catch (error) {
        console.error('Error removing typing indicator:', error);
      }
    }, 3000);
  } catch (error) {
    console.error('Error setting typing indicator:', error);
  }
}

/**
 * Listen to typing indicators
 */
export function subscribeToTypingIndicators(
  callback: (typingUsers: string[]) => void
): () => void {
  if (!isFirebaseConfigured() || !realtimeDb) {
    return () => {};
  }

  try {
    const typingRef = dbRef(realtimeDb, 'typing');

    const listener = onValue(typingRef, (snapshot) => {
      if (snapshot.exists()) {
        const typingUsers = Object.keys(snapshot.val());
        callback(typingUsers);
      } else {
        callback([]);
      }
    });

    // Return unsubscribe function
    return () => {
      try {
        off(typingRef, 'value', listener);
      } catch (error) {
        console.error('Error unsubscribing from typing indicators:', error);
      }
    };
  } catch (error) {
    console.error('Error subscribing to typing indicators:', error);
    return () => {};
  }
}

/**
 * Delete a message
 */
export async function deleteMessage(messageId: string): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase not configured. Please set environment variables.');
  }

  try {
    await deleteDoc(doc(db, 'messages', messageId));
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
}

/**
 * Delete old messages (client-side cleanup)
 * Messages older than 24 hours are automatically deleted
 * This runs in the background without affecting user experience
 */
export async function cleanupOldMessages(): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    return;
  }

  try {
    const { where, getDocs } = await import('firebase/firestore');
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);

    // Query messages older than 24 hours
    const messagesCollection = collection(db, 'messages');
    const q = query(
      messagesCollection,
      where('createdAt', '<', Timestamp.fromMillis(oneDayAgo))
    );

    const snapshot = await getDocs(q);
    let deletedCount = 0;

    // Delete old messages in batches
    const batch = db.batch ? (await import('firebase/firestore')).writeBatch(db) : null;
    if (batch) {
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
        deletedCount++;
      });
      await batch.commit();
    } else {
      // Fallback: delete individually if batch not available
      for (const doc of snapshot.docs) {
        await deleteDoc(doc.ref);
        deletedCount++;
      }
    }

    if (deletedCount > 0) {
      console.log(`Cleaned up ${deletedCount} old messages`);
    }
  } catch (error) {
    console.debug('Message cleanup skipped (this is normal):', error);
  }
}

/**
 * Start periodic message cleanup (runs every hour)
 */
export function startMessageCleanup(): () => void {
  // Run cleanup immediately on first load
  cleanupOldMessages();

  // Then run every hour
  const intervalId = setInterval(() => {
    cleanupOldMessages();
  }, 60 * 60 * 1000); // 1 hour

  // Return cleanup function
  return () => clearInterval(intervalId);
}
