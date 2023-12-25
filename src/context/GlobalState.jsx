import { useContext, useReducer, createContext, useEffect } from "react";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {

    return (
        <GlobalContext.Provider value={{}}>
            {children}
        </GlobalContext.Provider>
    )
}