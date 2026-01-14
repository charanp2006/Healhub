import { createContext, useState, useEffect } from "react";
import { doctors, hospitals, clinics, pharmacies } from "../assets/assets";
import { onAuthStateChange, getCurrentUser, getUserData } from "../services/authService";

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
                // Fetch additional user data from Firestore
                const data = await getUserData(firebaseUser.uid);
                setUserData(data);
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