import admin from '../config/firebase.js';

const db = admin.firestore();

/**
 * Save user data to Firestore
 * @param {string} uid - User UID
 * @param {Object} userData - User data to save
 * @returns {Promise<void>}
 */
export const saveUserData = async (uid, userData) => {
  try {
    await db.collection('users').doc(uid).set({
      ...userData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    throw new Error(`Failed to save user data: ${error.message}`);
  }
};

/**
 * Get user data from Firestore
 * @param {string} uid - User UID
 * @returns {Promise<Object>} User data
 */
export const getUserData = async (uid) => {
  try {
    const doc = await db.collection('users').doc(uid).get();
    if (!doc.exists) {
      return null;
    }
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    throw new Error(`Failed to get user data: ${error.message}`);
  }
};

/**
 * Save appointment to Firestore
 * @param {Object} appointmentData - Appointment data
 * @returns {Promise<string>} Appointment ID
 */
export const saveAppointment = async (appointmentData) => {
  try {
    const docRef = await db.collection('appointments').add({
      ...appointmentData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    throw new Error(`Failed to save appointment: ${error.message}`);
  }
};

/**
 * Get user appointments
 * @param {string} userId - User UID
 * @returns {Promise<Array>} Array of appointments
 */
export const getUserAppointments = async (userId) => {
  try {
    const snapshot = await db.collection('appointments')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw new Error(`Failed to get appointments: ${error.message}`);
  }
};

/**
 * Update appointment
 * @param {string} appointmentId - Appointment ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<void>}
 */
export const updateAppointment = async (appointmentId, updateData) => {
  try {
    await db.collection('appointments').doc(appointmentId).update({
      ...updateData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    throw new Error(`Failed to update appointment: ${error.message}`);
  }
};

/**
 * Delete appointment
 * @param {string} appointmentId - Appointment ID
 * @returns {Promise<void>}
 */
export const deleteAppointment = async (appointmentId) => {
  try {
    await db.collection('appointments').doc(appointmentId).delete();
  } catch (error) {
    throw new Error(`Failed to delete appointment: ${error.message}`);
  }
};
