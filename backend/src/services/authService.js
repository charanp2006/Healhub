import admin from '../config/firebase.js';

/**
 * Verify Firebase ID token
 * @param {string} idToken - Firebase ID token
 * @returns {Promise<Object>} Decoded token with user info
 */
export const verifyToken = async (idToken) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    throw new Error(`Token verification failed: ${error.message}`);
  }
};

/**
 * Get user by UID
 * @param {string} uid - User UID
 * @returns {Promise<Object>} User record
 */
export const getUserByUid = async (uid) => {
  try {
    const userRecord = await admin.auth().getUser(uid);
    return userRecord;
  } catch (error) {
    throw new Error(`Failed to get user: ${error.message}`);
  }
};

/**
 * Create custom token for user
 * @param {string} uid - User UID
 * @returns {Promise<string>} Custom token
 */
export const createCustomToken = async (uid) => {
  try {
    const customToken = await admin.auth().createCustomToken(uid);
    return customToken;
  } catch (error) {
    throw new Error(`Failed to create custom token: ${error.message}`);
  }
};
