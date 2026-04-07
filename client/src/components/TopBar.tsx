import React from 'react';
import { Moon, Sun, Volume2, VolumeX, LogOut, Users } from 'lucide-react';

interface TopBarProps {
  username: string;
  onlineCount: number;
  theme: 'light' | 'dark' | 'calm-night';
  onThemeToggle: () => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
  onLeave: () => void;
}

/**
 * TopBar: Fixed header with app name, online count, and control buttons
 * - Shows current theme and allows cycling through 3 themes
 * - Toggle sound effects on/off
 * - Leave room button
 */
export default function TopBar({
  username,
  onlineCount,
  theme,
  onThemeToggle,
  soundEnabled,
  onSoundToggle,
  onLeave,
}: TopBarProps) {
  /**
   * Get theme icon based on current theme
   */
  const getThemeIcon = () => {
    if (theme === 'dark') return <Moon size={20} />;
    if (theme === 'calm-night') return <Moon size={20} />;
    return <Sun size={20} />;
  };

  return (
    <div
      className="glass-card-dark px-4 md:px-6 py-3 md:py-4 flex items-center justify-between sticky top-0 z-50"
      style={{
        borderRadius: 0,
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* Left: App Name */}
      <div className="flex-1">
        <h1 className="text-lg md:text-xl font-bold" style={{ color: 'var(--neon-cyan)' }}>
          ChatVenture
        </h1>
      </div>

      {/* Center: Online Count */}
      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
        <Users size={16} />
        <span>{onlineCount} online</span>
      </div>

      {/* Right: Control Buttons */}
      <div className="flex-1 flex items-center justify-end gap-2">
        {/* Theme Toggle Button */}
        <button
          onClick={onThemeToggle}
          className="icon-btn"
          title={`Theme: ${theme}`}
          aria-label="Toggle theme"
        >
          {getThemeIcon()}
        </button>

        {/* Sound Toggle Button */}
        <button
          onClick={onSoundToggle}
          className="icon-btn"
          title={soundEnabled ? 'Mute' : 'Unmute'}
          aria-label="Toggle sound"
        >
          {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>

        {/* Leave Room Button */}
        <button
          onClick={onLeave}
          className="icon-btn"
          title="Leave room"
          aria-label="Leave room"
          style={{
            color: 'oklch(0.6 0.25 25)',
          }}
        >
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
}
