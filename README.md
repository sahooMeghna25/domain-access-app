# Domain Access — React Native + Web

A small cross-platform Google login assessment project built with **Expo (React Native)**, **React Native for Web**, **Firebase Authentication**, and **Expo Router**.

The sample allowed domain is `hbplus.fit`. Change it in `.env` if your assessment requires another domain.

## Features

- Google sign-in on web, Android, and iOS
- Exact email-domain validation
- Protected dashboard route and login redirect
- Logout and authentication loading states
- Responsive, minimal UI
- Firebase Auth session persistence
- Firestore security-rules example
- Optional role-based authorization guidance

## Folder structure

```text
domain-access-app/
├── app/
│   ├── _layout.js          # Auth provider + route guard
│   ├── index.js            # Login page
│   └── dashboard.js        # Protected dashboard
├── src/
│   ├── auth/
│   │   ├── AuthContext.js  # Auth state and Google login
│   │   └── domain.js       # Domain validation
│   ├── config.js           # Allowed domain and OAuth IDs
│   └── firebase.js         # Firebase initialization
├── .env.example
├── firestore.rules
├── app.json
└── package.json
```

## 1. Install

Use Node.js LTS. Create a Firebase project at https://console.firebase.google.com/.

```bash
npm install
cp .env.example .env
```

Fill `.env` with your Firebase web-app configuration. Do not commit `.env` to GitHub.

## 2. Configure Firebase Authentication

1. In Firebase Console, open **Authentication → Sign-in method**.
2. Enable **Google** as a provider and select a support email.
3. Under **Authentication → Settings → Authorized domains**, add your web deployment domain (for example, your Netlify subdomain).
4. Register a Firebase Web App and copy its configuration into `.env`.

## 3. Configure Google OAuth client IDs

In Google Cloud Console, configure the OAuth consent screen and create OAuth 2.0 client IDs:

- **Web client:** use the Firebase project's authorized web domains and the correct redirect configuration for Firebase Authentication.
- **Android client:** use your Android package/application ID and SHA-1 certificate fingerprint.
- **iOS client:** use your iOS bundle identifier.

Add the three client IDs to `.env`. For native builds, use the matching Android/iOS OAuth client IDs. Google OAuth setup differs by platform; ensure the package name, bundle ID, SHA-1, and redirect settings match your app.

## 4. Run the app

```bash
npx expo start
```

Web:

```bash
npx expo start --web
```

Android/iOS: open the Expo development build or emulator from the Expo CLI. The Google native flow requires a correctly configured OAuth client ID; use a development build for native testing.

## Authentication flow

1. User clicks **Continue with Google**.
2. On web, Firebase opens the Google popup. On Android/iOS, Expo AuthSession obtains a Google ID token and Firebase exchanges it for a Firebase session.
3. The app checks that the Firebase user has a verified email and that the exact domain after `@` equals `hbplus.fit`.
4. If the domain is allowed, the user enters the dashboard.
5. If not, Firebase signs the user out and the app displays:

   `Access restricted. Please login using your official domain email.`

6. The root route guard redirects unauthenticated users away from `/dashboard`. Firebase auth state is checked on app startup, so refreshing the page does not automatically expose the dashboard.

## How domain restriction works

The check is in `src/auth/domain.js`:

```js
export function isAllowedEmail(email = '') {
  const parts = email.trim().toLowerCase().split('@');
  return parts.length === 2 && parts[0].length > 0 && parts[1] === 'hbplus.fit';
}
```

This is an exact domain match. `person@hbplus.fit` passes; `person@gmail.com` and `person@not-hbplus.fit` do not.

### Important security note

A client-side check improves the user experience but is **not sufficient by itself** to secure backend data. Enforce the same domain and verified-email condition in every backend/API and database security rule. This repository includes `firestore.rules` as an example. Publish the rules in Firebase Console or with the Firebase CLI, and keep sensitive operations on trusted server code.

For a production Google Workspace-only organization, also consider restricting the Google OAuth consent/app audience to the organization and validating the Firebase ID token on your backend. Never trust a role value sent by the client.

## Optional role-based access

For a real Admin/User implementation, assign roles using Firebase Admin SDK custom claims from a trusted server:

```js
// Run only in trusted server code, never in the mobile/web client.
await admin.auth().setCustomUserClaims(uid, { role: 'admin' });
```

Read the claim after login:

```js
const tokenResult = await user.getIdTokenResult(true);
const role = tokenResult.claims.role || 'user';
```

Then show admin-only UI based on that claim and enforce the role again in backend/database rules. Do not let users write their own `role` field.

## Deploy web app to Netlify

1. Push this project to GitHub.
2. In Netlify, choose **Add new site → Import an existing project**.
3. Build command: `npx expo export --platform web`
4. Publish directory: `dist`
5. Add all `EXPO_PUBLIC_*` environment variables from `.env.example` in Netlify Site configuration.
6. Add your Netlify domain to Firebase Authentication's **Authorized domains**.
7. Redeploy after adding environment variables.

If you use a custom domain, add it to Firebase authorized domains too.

## Before submission

- [ ] Replace Firebase values in local `.env` and Netlify environment settings.
- [ ] Set the allowed domain in `EXPO_PUBLIC_ALLOWED_DOMAIN`.
- [ ] Configure web, Android, and iOS Google OAuth client IDs.
- [ ] Test an allowed account such as `tester@hbplus.fit`.
- [ ] Test a personal account such as `tester@gmail.com` and confirm it is rejected.
- [ ] Test direct `/dashboard` access while logged out.
- [ ] Publish and verify database security rules.
- [ ] Add screenshots and the deployed URL to your submission README.

## Notes

- `.env` is intentionally excluded from source control. Commit `.env.example`, not real credentials.
- Firebase web API keys are client configuration, not server secrets. Protect data with Authentication and Security Rules.
- The sample role defaults to `user`; admin roles must be assigned by trusted server code.
