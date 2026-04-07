# Firebase Setup Instructions for ChatVenture

Your Firebase project is now connected! Follow these steps to enable real-time messaging and media uploads.

## Step 1: Set Firestore Security Rules

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **chatventure-f3b0a**
3. Go to **Build** → **Firestore Database**
4. Click on the **Rules** tab
5. Replace ALL the code with this:

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

6. Click **Publish**

## Step 2: Set Realtime Database Rules

1. Go to **Build** → **Realtime Database**
2. Click on the **Rules** tab
3. Replace ALL the code with this:

```json
{
  "rules": {
    "presence": {
      "$uid": {
        ".read": true,
        ".write": true
      }
    },
    "typing": {
      "$uid": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

4. Click **Publish**

## Step 3: Set Cloud Storage Rules

1. Go to **Build** → **Cloud Storage**
2. Click on the **Rules** tab
3. Replace ALL the code with this:

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

4. Click **Publish**

## Step 4: Test the App

1. Go to your ChatVenture app
2. Enter a username (e.g., "Alice")
3. Enter the room password: **double0nine**
4. Click "Join Room"
5. You should now see the chat interface!

## Features Now Available

✅ **Real-time Messaging** - Messages sync instantly across all users
✅ **Presence Tracking** - See how many people are online
✅ **Typing Indicators** - See when others are typing
✅ **Message Reactions** - React to messages with emoji
✅ **Media Uploads** - Share images, videos, audio, and files
✅ **3-Theme System** - Switch between Bright, Dark, and Calm Night Blue themes
✅ **Sound Effects** - Optional audio feedback for messages

## Troubleshooting

### "Wrong password" error
- Make sure you enter: **double0nine**
- You can change this by editing the `.env.local` file and restarting the server

### Messages not appearing
- Check that Firestore Rules are published (Step 1)
- Open browser console (F12) and look for error messages
- Make sure you're in the same room (same password)

### Can't upload media
- Check that Cloud Storage Rules are published (Step 3)
- Make sure file size is reasonable (under 100MB)

### Typing indicators not showing
- Check that Realtime Database Rules are published (Step 2)

## Next Steps

1. **Share the Link**: Copy your app URL and share it with friends
2. **Customize Password**: Change `VITE_FIREBASE_ROOM_PASSWORD` in `.env.local` to a custom password
3. **Deploy**: Deploy to Firebase Hosting or GitHub Pages for public access
4. **Add Features**: Add more features like user avatars, message editing, or pinned messages

## Need Help?

- Check the browser console (F12) for error messages
- Read the [Firebase Documentation](https://firebase.google.com/docs)
- Check the [ChatVenture README](./README.md) for more details
