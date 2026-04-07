import React, { useState, useEffect } from 'react';
import { playErrorSound, playJoinSound } from '@/lib/utils';
import { ROOM_PASSWORD } from '@/lib/firebase';

interface JoinScreenProps {
  onJoin: (username: string) => void;
}

/**
 * JoinScreen: Full-screen animated landing page where users enter username and password
 * - Validates password against stored secret
 * - Remembers username in localStorage
 * - Shows error animation and sound for wrong password
 * - Smooth animations and glassmorphism design
 */
export default function JoinScreen({ onJoin }: JoinScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [savedUsername, setSavedUsername] = useState('');

  // Load saved username from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('chatventure-username');
    if (saved) {
      setSavedUsername(saved);
      setUsername(saved);
    }
  }, []);

  /**
   * Handle form submission: validate password and join room
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate inputs
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    if (!password) {
      setError('Please enter the room password');
      return;
    }

    // Validate password
    if (password !== ROOM_PASSWORD) {
      setError('Wrong password');
      playErrorSound();
      triggerShake();
      setPassword('');
      return;
    }

    // Save username to localStorage
    localStorage.setItem('chatventure-username', username);

    // Play join sound and proceed
    playJoinSound();
    setIsLoading(true);
    
    // Small delay to let sound play
    setTimeout(() => {
      onJoin(username);
    }, 300);
  };

  /**
   * Trigger shake animation for wrong password
   */
  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4" style={{ background: 'var(--background)' }}>
      {/* Animated background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, var(--neon-cyan) 0%, transparent 70%)',
            top: '-10%',
            right: '-5%',
            animation: 'float-up 6s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-96 h-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, var(--neon-magenta) 0%, transparent 70%)',
            bottom: '-10%',
            left: '-5%',
            animation: 'float-up 8s ease-in-out infinite reverse',
          }}
        />
      </div>

      {/* Main card */}
      <div className={`relative w-full max-w-md ${shake ? 'shake' : ''}`}>
        <div className="glass-card p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
              ChatVenture
            </h1>
            <p className="text-sm md:text-base" style={{ color: 'var(--muted-foreground)' }}>
              Real-time group chat, no accounts needed
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                Your Name
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="glass-input"
                disabled={isLoading}
                maxLength={30}
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                Room Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter the room password"
                className="glass-input"
                disabled={isLoading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div
                className="p-3 rounded-lg text-sm font-medium"
                style={{
                  background: 'oklch(0.6 0.25 25 / 0.2)',
                  color: 'oklch(0.6 0.25 25)',
                  animation: 'slideInDown 0.3s ease',
                }}
              >
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 text-base font-semibold"
              style={{
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
            >
              {isLoading ? 'Joining...' : 'Join Room'}
            </button>
          </form>

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
            <p className="text-xs text-center" style={{ color: 'var(--muted-foreground)' }}>
              💡 Tip: Your username will be remembered for next time
            </p>
          </div>
        </div>
      </div>

      {/* Keyboard-aware spacing for mobile */}
      <style>{`
        @media (max-height: 600px) {
          body {
            overflow-y: auto;
          }
        }
      `}</style>
    </div>
  );
}
