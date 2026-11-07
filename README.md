# Domain Access — React Native + Web

A small cross-platform Google login assessment project built with **Expo (React Native)**, **React Native for Web**, **Firebase Authentication**, and **Expo Router**.

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

## 3. Run the app

```bash
npx expo start
```

Web:

```bash
npx expo start --web
```

https://domain-access-app.netlify.app/ ----Netlify Link
