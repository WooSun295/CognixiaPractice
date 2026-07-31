import { useMemo, useState } from "react";
import { AuthContext, TOKEN_KEY } from "./AuthContext";
import { isTokenExpired } from "../utils/jwt";

// Reads the persisted token, but discards it up front if its JWT "exp"
// claim has already passed so an expired session never gets restored.
function getStoredToken() {
   const storedToken = localStorage.getItem(TOKEN_KEY);
   if (!storedToken) return null;

   if (isTokenExpired(storedToken)) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
   }

   return storedToken;
}

export function AuthProvider({ children }) {
   const [token, setTokenState] = useState(() => getStoredToken());

   const setToken = (nextToken) => {
      localStorage.setItem(TOKEN_KEY, nextToken);
      setTokenState(nextToken);
   };

   const clearToken = () => {
      localStorage.removeItem(TOKEN_KEY);
      setTokenState(null);
   };

   const value = useMemo(() => ({ token, setToken, clearToken }), [token]);

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
