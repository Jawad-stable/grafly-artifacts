# Grafly — Supabase Auth setup checklist

This is a **one-time** setup. After completing it, all four auth flows work:
sign-up, sign-in, password reset, and Google sign-in — branded as Grafly.

You only need to do the steps marked **DO**. Everything in `code/` is already
done in this repo.

---

## 1. URL Configuration

**👉 Open:** https://supabase.com/dashboard/project/ylvkpbfzyyruacabgfhc/auth/url-configuration

**DO — set these exact values:**

- **Site URL**

  ```
  grafly://auth-callback
  ```

- **Redirect URLs** (add each on its own line, click "Add URL" between):

  ```
  grafly://auth-callback
  grafly://*
  exp://848a6f0f-236d-4464-bda7-2a2b2f82d14b-00-1pwhuy0fa2k2m.expo.kirk.replit.dev/--/auth-callback
  exp://848a6f0f-236d-4464-bda7-2a2b2f82d14b-00-1pwhuy0fa2k2m.expo.kirk.replit.dev/--/*
  https://848a6f0f-236d-4464-bda7-2a2b2f82d14b-00-1pwhuy0fa2k2m.kirk.replit.dev/**
  ```

  Click **Save**.

The `grafly://` entries are for the production APK. The `exp://` and `https://`
entries are for the Replit Expo dev preview.

---

## 2. Skip email confirmation (recommended for now)

Right now Supabase requires every new user to click a link in an email before
they can sign in. That link is fragile (deep links into mobile apps), and most
users won't bother.

**👉 Open:** https://supabase.com/dashboard/project/ylvkpbfzyyruacabgfhc/auth/providers

Scroll to **Email**:

**DO — toggle OFF: "Confirm email"**

Click **Save**.

That's it. Users can now sign up and immediately sign in. (You can flip this
back on later once your email templates and deep-linking are battle-tested.)

If you'd rather keep email confirmation on, that also works — the app now has
a "Resend confirmation email" button on the sign-in screen for users who lose
the original email.

---

## 3. Brand the email templates (Grafly look & feel)

**👉 Open:** https://supabase.com/dashboard/project/ylvkpbfzyyruacabgfhc/auth/templates

You'll see 6 template tabs at the top. Paste the matching HTML from the files
in this folder into each one's **Message body (HTML)** field, **and** update
the subject line as listed below. Click **Save** after each template.

| Template tab           | Subject line                            | HTML file                                        |
|------------------------|-----------------------------------------|--------------------------------------------------|
| Confirm signup         | Welcome to Grafly — confirm your email  | `email-templates/confirm-signup.html`            |
| Magic Link             | Your Grafly sign-in link                | `email-templates/magic-link.html`                |
| Change Email Address   | Confirm your new Grafly email           | `email-templates/change-email.html`              |
| Reset Password         | Reset your Grafly password              | `email-templates/reset-password.html`            |
| Invite User            | You're invited to Grafly                | `email-templates/invite.html`                    |
| Reauthentication       | Confirm it's you on Grafly              | `email-templates/reauthentication.html`          |

All templates use Grafly's brand palette (cyan #00A4FA, lime #E3ED43, navy
#21263F) and the Nunito font stack with web-safe fallbacks.

---

## 4. Google sign-in — branded consent screen

The Google sign-in toggle is already on in your Supabase project, but the
consent screen probably says "Continue to **ylvkpbfzyyruacabgfhc.supabase.co**"
instead of "Continue to **Grafly**". To brand it you need your own Google OAuth
client.

### 4a. Create a Google OAuth client

**👉 Open:** https://console.cloud.google.com/apis/credentials

If you don't have a project yet, create one called **Grafly**.

1. **OAuth consent screen** → External → fill in:
   - App name: **Grafly**
   - User support email: your email
   - App logo: upload `artifacts/grafly/assets/logo/icon_colored.webp`
     (resize to 120×120 if Google complains)
   - Developer email: your email
   - Click **Save and Continue** through the rest.

2. **Credentials → + Create credentials → OAuth client ID**:
   - Application type: **Web application**
   - Name: **Grafly Supabase**
   - **Authorized redirect URIs** — add this single value:

     ```
     https://ylvkpbfzyyruacabgfhc.supabase.co/auth/v1/callback
     ```

   - Click **Create**. Copy the **Client ID** and **Client secret** that pop up.

### 4b. Paste the credentials into Supabase

**👉 Open:** https://supabase.com/dashboard/project/ylvkpbfzyyruacabgfhc/auth/providers

Scroll to **Google**:

- **Client IDs** — paste the Client ID from step 4a.
- **Client Secret** — paste the Client Secret from step 4a.
- Click **Save**.

Now the Google consent screen says **"Continue to Grafly"** with your logo.

---

## 5. Verify

Reload the app on your phone (shake → Reload, or restart Expo Go).

- ✅ Sign up with a fresh email + password → you should land in the app
  immediately (because step 2 disabled email confirmation).
- ✅ Sign out → sign in again with the same credentials → should work.
- ✅ "Forgot password" → enter email → check inbox → tap link → opens app
  on the **Set new password** screen → enter new password → signed in.
- ✅ "Continue with Google" → Google consent screen says "Grafly" → after
  approval the app opens straight into the home tab.

If any of those fail, check that the redirect URL allow-list in step 1
contains the exact URL the app is trying to open (the error message will
show it).
