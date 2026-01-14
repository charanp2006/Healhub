# HealHub Backend

Backend service for HealHub using Firebase.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your Firebase configuration:
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
```

3. For client-side Firebase, configure Firebase in the frontend using the Firebase Console credentials.

## Firebase Setup Instructions

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication (Email/Password)
4. Enable Firestore Database
5. Get your Firebase config from Project Settings > General > Your apps
6. Add the config to frontend `.env` file
