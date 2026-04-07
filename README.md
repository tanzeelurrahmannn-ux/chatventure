# ChatVenture - Real-time Group Chat App

A mobile-first, real-time group chat web app with glassmorphism design, Firebase backend, and multi-media messaging. No accounts needed—just share a link and password!

## Features

- **Real-time Messaging**: Instant message delivery via Firestore
- **Multi-Media Support**: Text, images, videos, audio recordings, and file attachments
- **3-Theme System**: Bright Mode, Dark Mode, and Calm Night Blue Mode
- **Glassmorphism Design**: Modern frosted glass UI with neon accents
- **Presence Tracking**: See who's online in real-time
- **Message Reactions**: React to messages with emoji
- **Typing Indicators**: See when others are typing
- **Sound Effects**: Optional audio feedback for messages
- **Mobile-First**: Fully responsive on iOS Safari and Android Chrome
- **24-Hour Message TTL**: Messages auto-delete after 24 hours

## Tech Stack

- **Frontend**: React 19 + TypeScript + Tailwind CSS 4
- **Backend**: Firebase (Firestore, Storage, Realtime Database, Cloud Functions)
- **Hosting**: Firebase Hosting (or GitHub Pages)
- **Audio**: Web Audio API for sound effects and voice recording

## Setup Instructions

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a new project"
3. Enter project name: `chatventure`
4. Accept the terms and create the project

### 2. Enable Firebase Services

In the Firebase Console, enable the following:

#### Firestore Database
1. Go to **Build** → **Firestore Database**
2. Click **Create Database**
3. Start in **production mode**
4. Choose a region (e.g., `us-central1`)
5. Click **Create**

#### Realtime Database
1. Go to **Build** → **Realtime Database**
2. Click **Create Database**
3. Start in **production mode**
4. Choose the same region as Firestore
5. Click **Create**

#### Cloud Storage
1. Go to **Build** → **Cloud Storage**
2. Click **Get Started**
3. Accept the default bucket name
4. Choose the same region
5. Click **Done**

#### Cloud Functions
1. Go to **Build** → **Functions**
2. Click **Get Started**
3. Select your Firestore database and region
4. Click **Next**
5. Skip the default function and click **Deploy**

#### Firebase Hosting
1. Go to **Build** → **Hosting**
2. Click **Get Started**
3. Follow the setup wizard (you'll use the Firebase CLI)

### 3. Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click the web app icon (`</>`), or create a new web app if needed
4. Copy the Firebase config object
5. You'll need these values:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

### 4. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_ROOM_PASSWORD=double0nine
```

### 5. Set Firestore Security Rules

1. Go to **Firestore Database** → **Rules**
2. Replace the default rules with:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Messages collection: anyone can read/write
    match /messages/{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 6. Set Realtime Database Rules

1. Go to **Realtime Database** → **Rules**
2. Replace the default rules with:

```json
{
  "rules": {
    "presence": {
      "$uid": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

### 7. Set Cloud Storage Rules

1. Go to **Cloud Storage** → **Rules**
2. Replace the default rules with:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /uploads/{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

### 8. Deploy Cloud Function for Message Cleanup

Create a Cloud Function to delete messages older than 24 hours:

1. Go to **Cloud Functions**
2. Click **Create Function**
3. Set:
   - **Environment**: 2nd gen
   - **Trigger type**: Cloud Pub/Sub
   - **Create a new topic**: `cleanup-messages`
   - **Runtime**: Node.js 20
4. Replace the code with:

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.cleanupMessages = functions.pubsub
  .schedule('every 1 hours')
  .onRun(async (context) => {
    const db = admin.firestore();
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);

    const snapshot = await db.collection('messages')
      .where('createdAt', '<', oneDayAgo)
      .get();

    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`Deleted ${snapshot.size} old messages`);
  });
```

5. Click **Deploy**

## Development

### Install Dependencies

```bash
pnpm install
```

### Run Development Server

```bash
pnpm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
pnpm run build
```

## Deployment

### Deploy to Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init hosting
   ```

4. Build the project:
   ```bash
   pnpm run build
   ```

5. Deploy:
   ```bash
   firebase deploy
   ```

### Deploy to GitHub Pages

1. Build the project:
   ```bash
   pnpm run build
   ```

2. Push the `dist` folder to GitHub Pages:
   ```bash
   git add dist
   git commit -m "Deploy to GitHub Pages"
   git push
   ```

3. Enable GitHub Pages in your repository settings

## Connect Custom Domain

### Firebase Hosting

1. Go to **Hosting** → **Custom domains**
2. Click **Add custom domain**
3. Enter your domain name
4. Follow the verification steps (add DNS records)
5. Wait for SSL certificate to be provisioned

### GitHub Pages

1. Go to repository **Settings** → **Pages**
2. Under **Custom domain**, enter your domain
3. Update your domain's DNS settings to point to GitHub Pages

## Usage

1. Visit the app URL
2. Enter your username
3. Enter the room password (default: `double0nine`)
4. Start chatting!

## Features Explained

### 3-Theme System
- **Bright Mode**: Light lavender background with neon cyan/magenta accents
- **Dark Mode**: Near-black background with neon cyan/lime accents
- **Calm Night Blue**: Deep navy background with soft teal accents

Click the theme button in the top bar to cycle through themes.

### Message Types
- **Text**: Simple text messages
- **Image**: JPEG, PNG, GIF, WebP
- **Video**: MP4, MOV
- **Audio**: Voice notes recorded with hold-to-record
- **File**: PDF, ZIP, or any other file type

### Reactions
Long-press any message to react with emoji (👍, ❤️, 😂, 😮, 😢)

### Sound Effects
- Message sent: Soft whoosh
- Message received: Gentle chime
- Join room: Welcome tone
- Wrong password: Low thud

Toggle sound in the top bar with the volume button.

## Troubleshooting

### "Wrong password" error
- Make sure you're using the correct room password
- Check the `VITE_FIREBASE_ROOM_PASSWORD` environment variable

### Messages not appearing
- Check that Firestore is enabled and rules are correct
- Verify Firebase config is correct in environment variables
- Check browser console for errors

### Media uploads not working
- Verify Cloud Storage is enabled
- Check storage rules allow uploads
- Make sure file size is within limits (Firebase default: 5GB per file)

### Slow performance
- Check Firestore usage in Firebase Console
- Consider adding indexes for frequently queried fields
- Optimize image sizes before uploading

## License

MIT

## Support

For issues or questions, please check the [Firebase Documentation](https://firebase.google.com/docs) or open an issue on GitHub.
