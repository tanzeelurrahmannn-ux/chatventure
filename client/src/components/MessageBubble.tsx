import React from 'react';
import { formatFileSize } from '@/lib/utils';
import { Download, Play } from 'lucide-react';

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

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

/**
 * MessageBubble: Renders a single message with appropriate styling and content
 * - Text messages: simple text in bubble
 * - Image: inline image display
 * - Video: inline video player
 * - Audio: waveform visualization with play button
 * - File: download card with file info
 */
export default function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const bubbleClass = isOwn ? 'message-bubble-own' : 'message-bubble-other';

  return (
    <div className={bubbleClass}>
      {message.type === 'text' && (
        <p style={{ wordBreak: 'break-word' }}>{message.content}</p>
      )}

      {message.type === 'image' && (
        <img
          src={message.content}
          alt="Shared image"
          className="rounded-lg max-w-full h-auto"
          style={{ maxHeight: '300px' }}
        />
      )}

      {message.type === 'video' && (
        <video
          src={message.content}
          controls
          className="rounded-lg max-w-full h-auto"
          style={{ maxHeight: '300px' }}
        />
      )}

      {message.type === 'audio' && (
        <div className="flex items-center gap-3">
          <button
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: isOwn ? 'rgba(0, 0, 0, 0.2)' : 'var(--neon-cyan)',
              color: isOwn ? 'white' : 'black',
            }}
          >
            <Play size={16} fill="currentColor" />
          </button>
          <div className="flex gap-1 items-center flex-1">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="waveform-bar"
                style={{
                  height: `${Math.random() * 20 + 4}px`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {message.type === 'file' && (
        <div
          className="flex items-center gap-3 p-3 rounded-lg"
          style={{
            background: isOwn ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
          }}
        >
          <Download size={24} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{message.fileName}</p>
            <p className="text-xs opacity-75">
              {message.fileSize ? formatFileSize(message.fileSize) : 'Unknown size'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
