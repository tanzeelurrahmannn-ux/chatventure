import React from 'react';

interface EmojiPickerProps {
  onSelectEmoji: (emoji: string) => void;
}

/**
 * EmojiPicker: Built-in emoji picker (no external API needed)
 * - Shows popular emojis in categories
 * - Click to insert emoji into message
 */
export default function EmojiPicker({ onSelectEmoji }: EmojiPickerProps) {
  const emojis = [
    '😀', '😂', '😍', '🤔', '😢', '😡', '👍', '👎', '❤️', '🔥',
    '✨', '🎉', '🎊', '🎈', '🎁', '🚀', '⭐', '💯', '🙌', '👏',
    '🤝', '💪', '🤲', '👋', '🙏', '💬', '💭', '🗨️', '💡', '🧠',
  ];

  return (
    <div
      className="absolute bottom-full left-0 mb-2 p-3 glass-card-dark rounded-lg grid grid-cols-6 gap-2 w-64"
      style={{
        animation: 'slideInUp 0.2s ease',
      }}
    >
      {emojis.map((emoji) => (
        <button
          key={emoji}
          onClick={() => onSelectEmoji(emoji)}
          className="text-2xl hover:scale-125 transition-transform cursor-pointer"
          title={emoji}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
