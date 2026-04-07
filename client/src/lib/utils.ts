import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a consistent color for a username by hashing it
 * Returns a color in the neon palette (cyan, magenta, lime)
 */
export function getUsernameColor(username: string): string {
  const colors = [
    'oklch(0.65 0.25 200)',  // neon-cyan
    'oklch(0.6 0.28 320)',   // neon-magenta
    'oklch(0.75 0.2 140)',   // neon-lime
    'oklch(0.65 0.25 180)',  // neon-teal
    'oklch(0.7 0.22 280)',   // neon-purple
  ];
  
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = ((hash << 5) - hash) + username.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return colors[Math.abs(hash) % colors.length];
}

/**
 * Format relative time (e.g., "2 min ago", "just now")
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  
  return new Date(timestamp).toLocaleDateString();
}

/**
 * Web Audio API: Generate a simple tone for sound effects
 * @param frequency - Frequency in Hz
 * @param duration - Duration in milliseconds
 * @param type - Waveform type: 'sine', 'square', 'sawtooth', 'triangle'
 */
export function playTone(
  frequency: number = 440,
  duration: number = 100,
  type: OscillatorType = 'sine'
): void {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    // Fade in and out to avoid clicks
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration / 1000);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
  } catch (error) {
    console.warn('Audio context not available:', error);
  }
}

/**
 * Sound effect: Message sent (whoosh)
 */
export function playMessageSentSound(): void {
  playTone(800, 150, 'sine');
}

/**
 * Sound effect: Message received (gentle chime)
 */
export function playMessageReceivedSound(): void {
  playTone(600, 200, 'sine');
}

/**
 * Sound effect: Join room (welcome tone)
 */
export function playJoinSound(): void {
  playTone(500, 300, 'sine');
}

/**
 * Sound effect: Wrong password (low thud)
 */
export function playErrorSound(): void {
  playTone(200, 200, 'sine');
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Validate Firebase config object
 */
export function isValidFirebaseConfig(config: any): boolean {
  return (
    config &&
    config.apiKey &&
    config.authDomain &&
    config.projectId &&
    config.storageBucket &&
    config.messagingSenderId &&
    config.appId
  );
}

/**
 * Check if message type is media
 */
export function isMediaType(type: string): boolean {
  return ['image', 'video', 'audio', 'file'].includes(type);
}

/**
 * Get MIME type from file extension
 */
export function getMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  
  const mimeTypes: { [key: string]: string } = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    mp4: 'video/mp4',
    mov: 'video/quicktime',
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    webm: 'audio/webm',
    pdf: 'application/pdf',
    zip: 'application/zip',
  };
  
  return mimeTypes[ext || ''] || 'application/octet-stream';
}

/**
 * Validate password against stored secret
 */
export function validatePassword(input: string, secret: string): boolean {
  return input === secret;
}

/**
 * Generate a unique room ID (not used in single-room app, but useful for future)
 */
export function generateRoomId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}
