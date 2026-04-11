import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, Mic } from 'lucide-react';
import { playMessageSentSound } from '@/lib/utils';
import EmojiPicker from './EmojiPicker';
import AttachmentMenu from './AttachmentMenu';

interface InputBarProps {
  onSendMessage: (content: string, type: 'text' | 'image' | 'video' | 'audio' | 'file', fileName?: string, fileSize?: number) => void;
  onTyping: () => void;
  soundEnabled: boolean;
}

/**
 * InputBar: Sticky bottom input area with text input, attachment menu, emoji picker, and send button
 * - Auto-growing text input (up to 5 lines)
 * - Attachment button opens radial menu (image, video, audio, file)
 * - Emoji picker button
 * - Send button pulses when input is non-empty
 * - Keyboard-aware layout for mobile
 */
export default function InputBar({
  onSendMessage,
  onTyping,
  soundEnabled,
}: InputBarProps) {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const textInputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  /**
   * Auto-grow textarea based on content (max 5 lines)
   */
  useEffect(() => {
    if (textInputRef.current) {
      textInputRef.current.style.height = 'auto';
      const newHeight = Math.min(textInputRef.current.scrollHeight, 120); // ~5 lines
      textInputRef.current.style.height = `${newHeight}px`;
    }
  }, [message]);

  /**
   * Handle message submission
   */
  const handleSendMessage = () => {
    console.log('🔘 Send button clicked, message:', message);
    if (!message.trim()) {
      console.log('⚠️ Message is empty, returning');
      return;
    }

    console.log('📨 Calling onSendMessage...');
    onSendMessage(message, 'text');
    setMessage('');
    
    if (soundEnabled) {
      playMessageSentSound();
    }

    // Reset textarea height
    if (textInputRef.current) {
      textInputRef.current.style.height = 'auto';
    }
  };

  /**
   * Handle Enter key (Shift+Enter for new line)
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /**
   * Handle emoji selection
   */
  const handleEmojiSelect = (emoji: string) => {
    setMessage(message + emoji);
    setShowEmojiPicker(false);
  };

  /**
   * Handle file attachment
   */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'audio' | 'file') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      onSendMessage(content, type, file.name, file.size);
      
      if (soundEnabled) {
        playMessageSentSound();
      }
    };
    reader.readAsDataURL(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Handle audio recording
   */
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        // Convert blob to base64 for storage
        const reader = new FileReader();
        reader.onload = () => {
          const base64Audio = reader.result as string;
          onSendMessage(base64Audio, 'audio', 'voice-note.webm', audioBlob.size);
          
          if (soundEnabled) {
            playMessageSentSound();
          }
        };
        reader.readAsDataURL(audioBlob);
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  /**
   * Handle audio recording stop
   */
  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div
      className="glass-card-dark px-4 py-3 md:px-6 md:py-4 sticky bottom-0 z-50"
      style={{
        borderRadius: 0,
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <div className="flex items-end gap-3">
        {/* Attachment Button */}
        <button
          onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
          className="icon-btn flex-shrink-0"
          title="Attach file"
          aria-label="Attach file"
        >
          <Paperclip size={20} />
        </button>

        {/* Text Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textInputRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              onTyping();
            }}
            onKeyDown={handleKeyDown}
            placeholder="type"
            className="glass-input resize-none"
            style={{
              minHeight: '44px',
              maxHeight: '120px',
              paddingTop: '0.75rem',
              paddingBottom: '0.75rem',
            }}
            rows={1}
          />
        </div>

        {/* Emoji Button */}
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="icon-btn flex-shrink-0"
          title="Add emoji"
          aria-label="Add emoji"
        >
          <Smile size={20} />
        </button>

        {/* Audio Record Button */}
        <button
          onClick={isRecording ? handleStopRecording : handleStartRecording}
          className="icon-btn flex-shrink-0"
          title={isRecording ? 'Stop recording' : 'Record audio'}
          aria-label={isRecording ? 'Stop recording' : 'Record audio'}
          style={{
            color: isRecording ? 'oklch(0.6 0.25 25)' : 'var(--neon-cyan)',
          }}
        >
          <Mic size={20} />
        </button>

        {/* Send Button */}
        <button
          onClick={handleSendMessage}
          disabled={!message.trim()}
          className="btn-primary flex-shrink-0 p-2.5"
          title="Send message"
          aria-label="Send message"
          style={{
            animation: message.trim() ? 'pulse-glow 2s ease-in-out infinite' : 'none',
          }}
        >
          <Send size={20} />
        </button>
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <EmojiPicker onSelectEmoji={handleEmojiSelect} />
      )}

      {/* Attachment Menu */}
      {showAttachmentMenu && (
        <AttachmentMenu
          onSelectType={(type) => {
            setShowAttachmentMenu(false);
            if (type === 'image' || type === 'video' || type === 'audio' || type === 'file') {
              fileInputRef.current?.click();
              // Store type for file input handler
              if (fileInputRef.current) {
                (fileInputRef.current as any).dataset.type = type;
              }
            }
          }}
        />
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        hidden
        onChange={(e) => {
          const type = (fileInputRef.current as any)?.dataset?.type || 'file';
          handleFileSelect(e, type as 'image' | 'video' | 'audio' | 'file');
        }}
        accept="image/*,video/*,audio/*,.pdf,.zip"
      />
    </div>
  );
}
