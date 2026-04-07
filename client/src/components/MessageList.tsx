import React, { useState } from 'react';
import { formatRelativeTime, getUsernameColor } from '@/lib/utils';
import MessageBubble from './MessageBubble';
import ReactionMenu from './ReactionMenu';

interface Message {
  id: string;
  sender: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'file';
  content: string;
  fileName?: string;
  fileSize?: number;
  reactions?: { [emoji: string]: string[] };
  createdAt: number;
}

interface MessageListProps {
  messages: Message[];
  currentUsername: string;
  onReaction: (messageId: string, emoji: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * MessageList: Displays all messages with proper alignment and styling
 * - Own messages: right-aligned with neon-cyan background
 * - Others' messages: left-aligned with glass effect
 * - Shows username label for others' messages
 * - Displays reactions below messages
 * - Long-press opens reaction menu
 */
export default function MessageList({
  messages,
  currentUsername,
  onReaction,
  messagesEndRef,
}: MessageListProps) {
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  /**
   * Handle long-press on message to show reaction menu
   */
  const handleLongPress = (messageId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedMessageId(messageId);
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  /**
   * Handle reaction selection from menu
   */
  const handleReactionSelect = (emoji: string) => {
    if (selectedMessageId) {
      onReaction(selectedMessageId, emoji);
      setSelectedMessageId(null);
      setContextMenu(null);
    }
  };

  /**
   * Close reaction menu when clicking outside
   */
  React.useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu(null);
    };

    if (contextMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu]);

  return (
    <div
      className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
      style={{
        background: 'var(--background)',
      }}
    >
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-lg font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
              Welcome to ChatVenture!
            </p>
            <p style={{ color: 'var(--muted-foreground)' }}>
              Start a conversation by sending a message
            </p>
          </div>
        </div>
      ) : (
        messages.map((message) => {
          const isOwnMessage = message.sender === currentUsername;
          const usernameColor = getUsernameColor(message.sender);

          return (
            <div
              key={message.id}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              onContextMenu={(e) => handleLongPress(message.id, e)}
            >
              <div className="max-w-xs lg:max-w-md">
                {/* Username label for others' messages */}
                {!isOwnMessage && (
                  <div
                    className="username-label mb-1"
                    style={{ background: usernameColor }}
                  >
                    {message.sender}
                  </div>
                )}

                {/* Message bubble */}
                <MessageBubble
                  message={message}
                  isOwn={isOwnMessage}
                />

                {/* Reactions */}
                {message.reactions && Object.keys(message.reactions).length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {Object.entries(message.reactions).map(([emoji, users]) => (
                      <div
                        key={emoji}
                        className="px-2 py-1 rounded-full text-xs font-semibold cursor-pointer"
                        style={{
                          background: 'var(--glass-dark)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                        onClick={() => onReaction(message.id, emoji)}
                        title={users.join(', ')}
                      >
                        {emoji} {users.length}
                      </div>
                    ))}
                  </div>
                )}

                {/* Timestamp */}
                <div className="timestamp mt-1 text-right">
                  {formatRelativeTime(message.createdAt)}
                </div>
              </div>
            </div>
          );
        })
      )}

      {/* Reaction menu */}
      {contextMenu && (
        <ReactionMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onSelectReaction={handleReactionSelect}
        />
      )}

      {/* Auto-scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
}
