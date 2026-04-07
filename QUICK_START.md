# ChatVenture - Quick Start Guide

Your Firebase project is connected! Follow these 3 simple steps to enable real-time messaging.

## Step 1: Set Firestore Rules (Copy & Paste)

1. Open Firebase Console: https://console.firebase.google.com
2. Select your project: **chatventure-f3b0a**
3. Go to **Build** → **Firestore Database**
4. Click **Rules** tab
5. **Delete everything** and paste this:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /messages/{document=**} {
      allow read, write: if true;
    }
  }
}
```

6. Click **Publish**

## Step 2: Set Realtime Database Rules (Copy & Paste)

1. Go to **Build** → **Realtime Database**
2. Click **Rules** tab
3. **Delete everything** and paste this:

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

## Step 3: Set Cloud Storage Rules (Copy & Paste)

1. Go to **Build** → **Cloud Storage**
2. Click **Rules** tab
3. **Delete everything** and paste this:

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

## Done! 🎉

Your ChatVenture app is now ready to use!

### Test It:
1. Go to your app
2. Enter username: **Alice**
3. Enter password: **double0nine**
4. Click "Join Room"
5. Start chatting!

### Features Available:
- ✅ Real-time messaging
- ✅ See who's online
- ✅ Typing indicators
- ✅ Message reactions (emoji)
- ✅ Media uploads (images, videos, audio, files)
- ✅ 3 beautiful themes
- ✅ Sound effects
- ✅ Auto-delete messages after 24 hours

### Share Your Room:
- Copy the app URL
- Share with friends
- They enter the same password: **double0nine**
- Everyone in the same room can chat in real-time!

### Change the Password:
Edit `.env.local` and change:
```
VITE_FIREBASE_ROOM_PASSWORD=your_custom_password
```

Then restart the app.

## Troubleshooting

**"Wrong password" error?**
- Make sure you enter: `double0nine`

**Messages not appearing?**
- Check that all 3 rules are published (Firestore, Realtime DB, Storage)
- Refresh the page
- Check browser console (F12) for errors

**Can't upload media?**
- Make sure Cloud Storage rules are published
- Try a smaller file

**Still having issues?**
- Check the browser console (F12) for error messages
- Read FIREBASE_SETUP.md for detailed instructions

---

**Enjoy ChatVenture! 🚀**
