import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin SDK
// Note: For production, use service account JSON file
// For now, we'll use environment variables
let firebaseAdmin;

try {
  if (process.env.FIREBASE_PROJECT_ID) {
    firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
  } else {
    // Initialize with default credentials (for local development)
    firebaseAdmin = admin.initializeApp();
  }
  console.log('Firebase Admin initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
}

export default firebaseAdmin;
