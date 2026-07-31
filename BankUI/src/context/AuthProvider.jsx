import { useMemo, useState } from "react";
import { AuthContext, TOKEN_KEY } from "./AuthContext";

export function AuthProvider({ children }) {
   const [token, setTokenState] = useState(() => localStorage.getItem(TOKEN_KEY));

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
