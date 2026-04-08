# Deploy ChatVenture to GitHub Pages

This guide will help you deploy ChatVenture to GitHub Pages so it stays live permanently.

## Step 1: Add Firebase Credentials as Secrets

1. Go to your GitHub repository: `https://github.com/[your-username]/chatventure`
2. Click **Settings** (top menu)
3. Click **Secrets and variables** → **Actions** (left sidebar)
4. Click **New repository secret** and add these 8 secrets:

| Secret Name | Value |
|-------------|-------|
| `VITE_FIREBASE_API_KEY` | `AIzaSyBhOe6nCG-ZlaDT_qePWqiJBxe8yZukDfM` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `chatventure-f3b0a.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `chatventure-f3b0a` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `chatventure-f3b0a.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `964388625642` |
| `VITE_FIREBASE_APP_ID` | `1:964388625642:web:d8d0bf7eb742fdf2368b93` |
| `VITE_FIREBASE_DATABASE_URL` | `https://chatventure-f3b0a-default-rtdb.firebaseio.com` |
| `VITE_FIREBASE_ROOM_PASSWORD` | `double0nine` |

**How to add a secret:**
- Click "New repository secret"
- Enter the name (e.g., `VITE_FIREBASE_API_KEY`)
- Paste the value from the table above
- Click "Add secret"
- Repeat for all 8 secrets

## Step 2: Enable GitHub Pages

1. In your repository, go to **Settings**
2. Click **Pages** (left sidebar)
3. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
   - This will automatically use the workflow we created

## Step 3: Deploy

The app will automatically deploy when you:
- Push code to `main` or `master` branch
- Or manually trigger it by going to **Actions** tab and clicking "Run workflow"

## Step 4: Access Your Live App

After deployment completes (usually 1-2 minutes):
- Your app will be live at: `https://[your-username].github.io/chatventure`
- Share this link with friends!

## Troubleshooting

**If deployment fails:**
1. Go to **Actions** tab in your repository
2. Click the failed workflow
3. Check the error message
4. Common issues:
   - Missing secrets (make sure all 8 are added)
   - Wrong branch name (should be `main` or `master`)

**If the app shows "Firebase Configuration Required":**
- Make sure all 8 secrets are added correctly
- Redeploy by going to Actions → Deploy to GitHub Pages → Run workflow

## Updating Your App

To make changes and deploy:
1. Edit files in your local repository
2. Commit and push to GitHub: `git push`
3. GitHub Actions will automatically build and deploy
4. Check the **Actions** tab to see deployment progress

That's it! Your app is now live on GitHub Pages! 🎉
