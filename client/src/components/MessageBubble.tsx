import React, { useState, useRef, useEffect } from 'react';
import { formatFileSize } from '@/lib/utils';
import { Download, Play, Pause } from 'lucide-react';

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
 * - Audio: minimal play button with duration in seconds
 * - File: download card with file info
 */
export default function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const bubbleClass = isOwn ? 'message-bubble-own' : 'message-bubble-other';
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateDuration = () => {
      setDuration(Math.round(audio.duration));
    };

    const updateTime = () => {
      setCurrentTime(Math.round(audio.currentTime));
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(err => console.error('Error playing audio:', err));
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
        <div className="flex items-center gap-2">
          <button
            onClick={handlePlayPause}
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
            style={{
              background: isOwn ? 'rgba(0, 0, 0, 0.2)' : 'var(--neon-cyan)',
              color: isOwn ? 'white' : 'black',
            }}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" />}
          </button>
          <span className="text-xs opacity-75 font-mono min-w-fit whitespace-nowrap">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          <audio
            ref={audioRef}
            src={message.content}
            onError={(e) => console.error('Audio error:', e)}
          />
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
