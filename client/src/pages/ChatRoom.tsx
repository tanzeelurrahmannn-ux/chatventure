import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { formatRelativeTime, getUsernameColor } from '@/lib/utils';
import {
  subscribeToMessages,
  sendMessage,
  setUserOnline,
  subscribeToOnlineCount,
  subscribeToTypingIndicators,
  setTypingIndicator,
  addReaction,
  removeReaction,
  startMessageCleanup,
} from '@/lib/firebaseService';
import TopBar from '@/components/TopBar';
import MessageList from '@/components/MessageList';
import InputBar from '@/components/InputBar';

interface Message {
  id: string;
  sender: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'file';
  content: string;
  fileName?: string;
  fileSize?: number;
  reactions?: { [emoji: string]: string[] };
  createdAt: number;
  expiresAt?: number;
}

interface ChatRoomProps {
  username: string;
  onLeave: () => void;
}

/**
 * ChatRoom: Main chat interface with message list, input bar, and top bar
 * - Displays real-time messages with glassmorphism bubbles
 * - Auto-scrolls to latest message
 * - Shows typing indicators and online count
 * - Supports message reactions and long-press context menu
 * - Integrates with Firebase for real-time sync
 * - Automatically cleans up old messages (24+ hours)
 */
export default function ChatRoom({ username, onLeave }: ChatRoomProps) {
  const { theme, toggleTheme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineCount, setOnlineCount] = useState(1);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const unsubscribeRef = useRef<(() => void)[]>([]);

  /**
   * Initialize Firebase subscriptions on mount
   */
  useEffect(() => {
    try {
      // Subscribe to messages
      const unsubscribeMessages = subscribeToMessages((msgs) => {
        setMessages(msgs);
      });
      unsubscribeRef.current.push(unsubscribeMessages);

      // Set user as online
      const unsubscribeOnline = setUserOnline(username);
      unsubscribeRef.current.push(unsubscribeOnline);

      // Subscribe to online count
      const unsubscribeOnlineCount = subscribeToOnlineCount((count) => {
        setOnlineCount(count);
      });
      unsubscribeRef.current.push(unsubscribeOnlineCount);

      // Subscribe to typing indicators
      const unsubscribeTyping = subscribeToTypingIndicators((users) => {
        setTypingUsers(users.filter(u => u !== username));
      });
      unsubscribeRef.current.push(unsubscribeTyping);

      // Start periodic message cleanup (deletes messages older than 24 hours)
      const stopCleanup = startMessageCleanup();
      unsubscribeRef.current.push(stopCleanup);
    } catch (error) {
      console.error('Error initializing Firebase subscriptions:', error);
    }

    // Cleanup on unmount
    return () => {
      unsubscribeRef.current.forEach(unsub => unsub());
    };
  }, [username]);

  /**
   * Auto-scroll to latest message
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * Handle sending a new message
   */
  const handleSendMessage = async (
    content: string,
    type: 'text' | 'image' | 'video' | 'audio' | 'file' = 'text',
    fileName?: string,
    fileSize?: number
  ) => {
    if (!content.trim() && type === 'text') return;

    try {
      await sendMessage(username, content, type, fileName, fileSize);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  /**
   * Handle typing indicator
   */
  const handleTyping = () => {
    try {
      setTypingIndicator(username);
    } catch (error) {
      console.error('Error setting typing indicator:', error);
    }
  };

  /**
   * Handle message reaction
   */
  const handleReaction = async (messageId: string, emoji: string) => {
    try {
      const message = messages.find(m => m.id === messageId);
      if (!message) return;

      const hasReacted = message.reactions?.[emoji]?.includes(username);

      if (hasReacted) {
        await removeReaction(messageId, emoji, username);
      } else {
        await addReaction(messageId, emoji, username);
      }
    } catch (error) {
      console.error('Error updating reaction:', error);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col relative" style={{ background: 'var(--background)' }}>
      {/* Top Bar */}
      <TopBar
        username={username}
        onlineCount={onlineCount}
        theme={theme}
        onThemeToggle={toggleTheme}
        soundEnabled={soundEnabled}
        onSoundToggle={() => setSoundEnabled(!soundEnabled)}
        onLeave={onLeave}
      />

      {/* Message List */}
      <MessageList
        messages={messages}
        currentUsername={username}
        onReaction={handleReaction}
        messagesEndRef={messagesEndRef}
      />

      {/* Typing Indicator */}
      {typingUsers.length > 0 && (
        <div className="px-4 py-2" style={{ color: 'var(--muted-foreground)' }}>
          <p className="text-sm">
            {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </p>
        </div>
      )}

      {/* Input Bar */}
      <InputBar
        onSendMessage={handleSendMessage}
        onTyping={handleTyping}
        soundEnabled={soundEnabled}
      />
    </div>
  );
}
