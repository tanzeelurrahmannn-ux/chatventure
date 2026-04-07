import { useState } from 'react';
import JoinScreen from './JoinScreen';
import ChatRoom from './ChatRoom';
import SetupGuide from '@/components/SetupGuide';
import { isFirebaseConfigured } from '@/lib/firebase';

/**
 * Home: Main page that routes between JoinScreen and ChatRoom
 * - Shows SetupGuide if Firebase is not configured
 * - Shows JoinScreen until user enters valid username and password
 * - Shows ChatRoom after successful join
 * - Handles leave room to return to JoinScreen
 */
export default function Home() {
  const [username, setUsername] = useState<string | null>(null);
  const firebaseReady = isFirebaseConfigured();

  /**
   * Handle user joining the room
   */
  const handleJoin = (name: string) => {
    setUsername(name);
  };

  /**
   * Handle user leaving the room
   */
  const handleLeave = () => {
    setUsername(null);
  };

  // Show setup guide if Firebase is not configured
  if (!firebaseReady) {
    return <SetupGuide />;
  }

  return (
    <div className="min-h-screen w-full">
      {username ? (
        <ChatRoom username={username} onLeave={handleLeave} />
      ) : (
        <JoinScreen onJoin={handleJoin} />
      )}
    </div>
  );
}
