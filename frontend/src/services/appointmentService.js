import { db } from '../config/firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';

/**
 * Save appointment to Firestore
 * @param {Object} appointmentData - Appointment data
 * @returns {Promise<string>} Appointment ID
 */
export const saveAppointment = async (appointmentData) => {
  try {
    const docRef = await addDoc(collection(db, 'appointments'), {
      ...appointmentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

/**
 * Get user appointments
 * @param {string} userId - User UID
 * @returns {Promise<Array>} Array of appointments
 */
export const getUserAppointments = async (userId) => {
  try {
    const q = query(
      collection(db, 'appointments'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    throw error;
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
    await updateDoc(doc(db, 'appointments', appointmentId), {
      ...updateData,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Delete appointment
 * @param {string} appointmentId - Appointment ID
 * @returns {Promise<void>}
 */
export const deleteAppointment = async (appointmentId) => {
  try {
    await deleteDoc(doc(db, 'appointments', appointmentId));
  } catch (error) {
    throw error;
  }
};
