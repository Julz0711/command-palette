# GitHub OAuth Setup Guide

## 🔐 Setting Up GitHub Authentication

Your app now supports GitHub OAuth! Follow these steps to configure it:

---

## Step 1: Create a GitHub OAuth App

1. Go to **GitHub Settings** → **Developer Settings** → **OAuth Apps**

   - Direct link: https://github.com/settings/developers

2. Click **"New OAuth App"**

3. Fill in the application details:

   ```
   Application name: Command Clipboard
   Homepage URL: http://localhost:5174
   Authorization callback URL: https://YOUR_SUPABASE_PROJECT.supabase.co/auth/v1/callback
   ```

4. Click **"Register application"**

5. **Copy your credentials**:
   - Client ID: `(copy this)`
   - Client Secret: Click **"Generate a new client secret"** → `(copy this)`

---

## Step 2: Configure Supabase

1. Go to your **Supabase Dashboard**

   - https://app.supabase.com/project/YOUR_PROJECT_ID

2. Navigate to **Authentication** → **Providers**

3. Find **GitHub** in the list and click to expand

4. Enable GitHub authentication and paste your credentials:

   ```
   ✅ Enable GitHub provider
   Client ID: (paste from GitHub)
   Client Secret: (paste from GitHub)
   ```

5. Copy the **Callback URL** shown in Supabase

   - It should look like: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`

6. Click **Save**

---

## Step 3: Update GitHub OAuth App (If Needed)

1. Go back to your GitHub OAuth App settings

2. Verify the **Authorization callback URL** matches the one from Supabase:

   ```
   https://YOUR_SUPABASE_PROJECT.supabase.co/auth/v1/callback
   ```

3. Save if you made any changes

---

## Step 4: Test the Integration

### Local Testing:

1. Start your dev server: `npm run dev`
2. Visit http://localhost:5174
3. Click the **"GitHub"** button
4. You should be redirected to GitHub to authorize
5. After authorization, you'll be redirected back and logged in!

### Production Setup (When Deploying):

When deploying to production (e.g., Vercel), you'll need to:

1. **Add Production URL to GitHub OAuth App**:

   ```
   Homepage URL: https://your-app.vercel.app
   ```

   Note: Keep the same Supabase callback URL

2. **Update Supabase Redirect URLs**:
   - Go to **Authentication** → **URL Configuration**
   - Add your production URL to **Redirect URLs**:
     ```
     https://your-app.vercel.app
     https://your-app.vercel.app/**
     ```

---

## ✅ How It Works

### For Users:

1. Click **"GitHub"** button on login page
2. Redirected to GitHub authorization page
3. Approve access to your app
4. Redirected back to your app, automatically logged in
5. **Default groups** (Salesforce, Git, NPM) created automatically on first login!

### Technical Flow:

```
User clicks GitHub button
    ↓
Supabase.auth.signInWithOAuth({ provider: 'github' })
    ↓
Redirect to GitHub
    ↓
User approves
    ↓
GitHub redirects to Supabase callback URL
    ↓
Supabase creates session and redirects to your app
    ↓
App detects authenticated user
    ↓
Dashboard loads (with default groups if new user!)
```

---

## 🔧 Troubleshooting

### "Invalid OAuth credentials"

- Double-check Client ID and Client Secret in Supabase
- Make sure you copied them correctly from GitHub

### "Redirect URI mismatch"

- Verify the callback URL in GitHub OAuth App matches Supabase
- Should be: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`

### GitHub button does nothing

- Check browser console for errors
- Verify Supabase provider is enabled
- Make sure you clicked "Save" in Supabase dashboard

### Works locally but not in production

- Add production URL to GitHub OAuth App
- Add production URL to Supabase redirect URLs
- Check environment variables are set in Vercel

---

## 🎨 UI Updates

The login page now shows:

```
┌────────────────────────────────┐
│   Command Clipboard            │
│   Welcome back                 │
│                                │
│   Email: [____________]        │
│   Password: [____________]     │
│                                │
│   [Sign In]                    │
│                                │
│   ─── Or continue with ───     │
│                                │
│   [🔗 GitHub]                  │
│                                │
│   Don't have an account?       │
└────────────────────────────────┘
```

Both email/password and GitHub login work simultaneously - users can choose their preferred method!

---

## 🔑 Important Notes

- **GitHub OAuth is optional** - Email/password login still works
- Users who sign up with GitHub will have their email from GitHub
- Default groups (Salesforce, Git, NPM) are created for ALL new users, regardless of login method
- GitHub OAuth works for both sign up AND sign in (same button!)
- User data is isolated by user ID - GitHub users and email users are separate

---

## Next Steps

1. Complete the Supabase + GitHub OAuth setup above
2. Test locally with GitHub login
3. Deploy to production and update URLs
4. Enjoy seamless authentication! 🎉
