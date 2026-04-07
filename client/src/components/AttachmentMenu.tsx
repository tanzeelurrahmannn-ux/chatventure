import React from 'react';
import { Image, Video, Mic, FileText } from 'lucide-react';

interface AttachmentMenuProps {
  onSelectType: (type: 'image' | 'video' | 'audio' | 'file') => void;
}

/**
 * AttachmentMenu: Radial menu for selecting attachment type
 * - Image upload
 * - Video upload
 * - Audio recording
 * - File attachment
 */
export default function AttachmentMenu({ onSelectType }: AttachmentMenuProps) {
  const attachmentTypes = [
    { type: 'image' as const, label: 'Image', icon: Image, color: 'oklch(0.65 0.25 200)' },
    { type: 'video' as const, label: 'Video', icon: Video, color: 'oklch(0.6 0.28 320)' },
    { type: 'audio' as const, label: 'Audio', icon: Mic, color: 'oklch(0.75 0.2 140)' },
    { type: 'file' as const, label: 'File', icon: FileText, color: 'oklch(0.65 0.25 180)' },
  ];

  return (
    <div
      className="absolute bottom-full left-0 mb-2 flex gap-2"
      style={{
        animation: 'slideInUp 0.2s ease',
      }}
    >
      {attachmentTypes.map(({ type, label, icon: Icon, color }) => (
        <button
          key={type}
          onClick={() => onSelectType(type)}
          className="flex flex-col items-center gap-1 p-3 glass-card-dark rounded-lg hover:scale-110 transition-transform"
          title={label}
          style={{
            color,
          }}
        >
          <Icon size={24} />
          <span className="text-xs font-semibold">{label}</span>
        </button>
      ))}
    </div>
  );
}
