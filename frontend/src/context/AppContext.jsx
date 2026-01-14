import { createContext, useState, useEffect } from "react";
import { doctors, hospitals, clinics, pharmacies } from "../assets/assets";
import { onAuthStateChange, getCurrentUser, getUserData } from "../services/authService";
import { userAPI } from "../services/apiService";

export const AppContext = createContext();

const AppContextProvider = ( props ) => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const currencySymbol = "₹";

    useEffect(() => {
        // Listen to auth state changes
        const unsubscribe = onAuthStateChange(async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                
                try {
                    // Try to get user data from backend API first
                    try {
                        const apiResponse = await userAPI.getCurrentUser();
                        setUserData(apiResponse.user);
                    } catch (apiError) {
                        // If backend fails, try direct Firestore access
                        console.log('Backend API not available, using direct Firestore access');
                        const data = await getUserData(firebaseUser.uid);
                        setUserData(data);
                        
                        // If user data doesn't exist, sync with backend
                        if (!data && firebaseUser.displayName) {
                            try {
                                await userAPI.syncUser({
                                    name: firebaseUser.displayName,
                                    email: firebaseUser.email,
                                });
                            } catch (syncError) {
                                console.log('Backend sync not available');
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    // Fallback to direct Firestore
                    const data = await getUserData(firebaseUser.uid);
                    setUserData(data);
                }
            } else {
                setUser(null);
                setUserData(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const value = {
        doctors,
        hospitals,
        clinics,
        pharmacies,
        currencySymbol,
        user,
        userData,
        loading,
        setUser,
        setUserData
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;