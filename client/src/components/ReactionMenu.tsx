import React from 'react';

interface ReactionMenuProps {
  x: number;
  y: number;
  onSelectReaction: (emoji: string) => void;
}

/**
 * ReactionMenu: Context menu that appears on long-press with quick emoji reactions
 * - Shows 5 quick emoji reactions
 * - Positioned near cursor
 * - Closes after selection or clicking outside
 */
export default function ReactionMenu({ x, y, onSelectReaction }: ReactionMenuProps) {
  const reactions = ['👍', '❤️', '😂', '😮', '😢'];

  return (
    <div
      className="fixed z-50 glass-card-dark p-2 flex gap-2"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        animation: 'slideInUp 0.2s ease',
      }}
    >
      {reactions.map((emoji) => (
        <button
          key={emoji}
          onClick={() => onSelectReaction(emoji)}
          className="w-10 h-10 flex items-center justify-center text-xl hover:scale-110 transition-transform"
          style={{
            background: 'var(--glass-light)',
            borderRadius: '0.5rem',
            cursor: 'pointer',
          }}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
