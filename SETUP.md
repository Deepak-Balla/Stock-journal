# Stock Journal – cloud login & sync setup

Until you do this, the journal works exactly as before: no login, data stays in the browser.
Once `firebase-config.js` is filled in, the journal asks for a login, saves everything to your
account, and shows the same data on every device you sign in on. Takes about 10 minutes.

## 1. Create the Firebase project (free "Spark" plan is enough for personal use)

1. Go to <https://console.firebase.google.com> > **Add project**. Google Analytics is not needed.
2. **Build > Authentication > Get started > Sign-in method**. Switch on:
   - **Email/Password**
   - **Google** (optional, for the "Continue with Google" button)
3. **Build > Firestore Database > Create database**. Pick a region close to you and start in
   **production mode**.
4. In Firestore open the **Rules** tab, paste the contents of `firestore.rules`, and **Publish**.
   This is what stops anyone but you reading your trades – do not skip it.

## 2. Connect the journal to it

1. **Project settings (gear icon) > Your apps > Web (`</>`)** > register an app (no hosting needed here).
2. Copy the config values into `firebase-config.js` (`apiKey`, `authDomain`, `projectId`, `appId`, ...).
   These identify your project; they are not secrets.

## 3. Put the journal on a web address (needed to use it on other devices)

A file on your PC can't be opened from your phone or another computer, and Google sign-in doesn't work
from a local file. Easiest free host is Firebase Hosting (same project):

```powershell
npm install -g firebase-tools
firebase login
firebase use --add                      # choose your project
New-Item -ItemType Directory -Force site | Out-Null
Copy-Item stock_journal_main.html site\index.html
Copy-Item firebase-config.js site\
firebase deploy --only hosting,firestore:rules
```

The command prints your address (like `https://your-project.web.app`). Open it on any device.
Repeat the two `Copy-Item` lines + `firebase deploy` whenever you change the journal.
`firebase.json` is already set up for this. Any other static host (GitHub Pages, Netlify, ...) works too –
just add its domain under **Authentication > Settings > Authorised domains**.

## How it behaves

- **Sign in / create account** with email + password or Google. A verification email is sent on sign-up
  (not required to use the journal). "Forgot password?" is on the sign-in screen.
- **Live sync:** add or edit a trade on one device and the others update within a second or two.
- **Offline:** you can keep logging trades without internet; they upload when you reconnect.
- **First sign-in on a device that already has journal data in its browser:** you're asked whether to
  upload it to your account. Nothing is uploaded without a yes.
- **Sign out** (Settings or the sidebar) removes the local copy from that device – safe on shared computers.
- **Theme** is a per-device choice and is not synced. Everything else (trades, deposits, capital,
  currency, monthly goal) is.
- **Backups:** *Settings > Backup (JSON)* still works and is still a good idea.

## Privacy

Your journal is stored in *your* Firebase project (Google Cloud). The rules allow each signed-in user to
read and write only their own data (`users/<their id>/...`), but whoever owns the Firebase project can see
the data in the console. If you share the project or the journal with others, each person gets a separate,
private journal under their own login.

## Troubleshooting

| Message | Fix |
|---|---|
| "Your Firebase security rules are blocking access" | Publish `firestore.rules` (step 1.4). |
| "This sign-in method isn't switched on" | Enable it under Authentication > Sign-in method. |
| "This web address isn't authorised" | Add the domain under Authentication > Settings > Authorised domains. |
| "Google sign-in needs the journal to be opened from a web address" | You opened the local file; use the hosted address. |
| Sign-in screen never appears / "Working on this device only" | `firebase-config.js` is missing next to the page, or the Firebase scripts are blocked by a network filter. |
