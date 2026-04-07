import React from 'react';
import { AlertCircle, ExternalLink } from 'lucide-react';

/**
 * SetupGuide: Shows when Firebase is not configured
 * - Displays helpful setup instructions
 * - Links to Firebase console and README
 * - Explains what environment variables are needed
 */
export default function SetupGuide() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4" style={{ background: 'var(--background)' }}>
      <div className="glass-card max-w-2xl p-8 md:p-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <AlertCircle size={32} style={{ color: 'oklch(0.6 0.25 25)' }} />
          <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
            Firebase Configuration Required
          </h1>
        </div>

        {/* Message */}
        <p className="mb-6" style={{ color: 'var(--muted-foreground)' }}>
          ChatVenture needs Firebase credentials to work. Follow these steps to get started:
        </p>

        {/* Steps */}
        <div className="space-y-4 mb-8">
          <div className="glass-card-dark p-4">
            <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
              1. Create a Firebase Project
            </h3>
            <p style={{ color: 'var(--muted-foreground)' }} className="text-sm">
              Go to{' '}
              <a
                href="https://console.firebase.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1"
                style={{ color: 'var(--neon-cyan)' }}
              >
                Firebase Console <ExternalLink size={14} />
              </a>
              {' '}and create a new project named "chatventure"
            </p>
          </div>

          <div className="glass-card-dark p-4">
            <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
              2. Enable Required Services
            </h3>
            <p style={{ color: 'var(--muted-foreground)' }} className="text-sm">
              Enable: Firestore Database, Realtime Database, Cloud Storage, and Cloud Functions
            </p>
          </div>

          <div className="glass-card-dark p-4">
            <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
              3. Get Your Firebase Config
            </h3>
            <p style={{ color: 'var(--muted-foreground)' }} className="text-sm mb-3">
              Go to Project Settings and copy your Firebase config
            </p>
            <div
              className="p-3 rounded text-xs font-mono"
              style={{
                background: 'var(--glass-dark)',
                color: 'var(--neon-cyan)',
                overflow: 'auto',
              }}
            >
              <div>VITE_FIREBASE_API_KEY=your_api_key</div>
              <div>VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com</div>
              <div>VITE_FIREBASE_PROJECT_ID=your_project_id</div>
              <div>VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com</div>
              <div>VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id</div>
              <div>VITE_FIREBASE_APP_ID=your_app_id</div>
              <div>VITE_FIREBASE_ROOM_PASSWORD=double0nine</div>
            </div>
          </div>

          <div className="glass-card-dark p-4">
            <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
              4. Add to Environment Variables
            </h3>
            <p style={{ color: 'var(--muted-foreground)' }} className="text-sm">
              Create a <code className="bg-gray-200 px-2 py-1 rounded">.env.local</code> file in the project root with the values above
            </p>
          </div>

          <div className="glass-card-dark p-4">
            <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
              5. Restart the Development Server
            </h3>
            <p style={{ color: 'var(--muted-foreground)' }} className="text-sm">
              Stop and restart the dev server to load the new environment variables
            </p>
          </div>
        </div>

        {/* Help Link */}
        <div className="text-center">
          <p style={{ color: 'var(--muted-foreground)' }} className="text-sm mb-3">
            Need detailed instructions?
          </p>
          <a
            href="https://github.com/your-repo/chatventure/blob/main/README.md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold"
            style={{
              background: 'var(--neon-cyan)',
              color: 'oklch(0.08 0.01 260)',
            }}
          >
            View Full Setup Guide <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
