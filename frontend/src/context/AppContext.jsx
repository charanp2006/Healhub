import { createContext } from "react";
import { doctors, hospitals, clinics, pharmacies } from "../assets/assets";


export const AppContext = createContext();

const AppContextProvider = ( props ) => {

    const currencySymbol = "₹";

    const value = {
        doctors,
        hospitals,
        clinics,
        pharmacies,
        currencySymbol
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;