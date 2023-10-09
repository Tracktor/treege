import { ReactNode, useMemo } from "react";
import { AuthContext } from "@/context/Auth/AuthContext";

interface AuthProviderProps {
  children: ReactNode;
  authToken?: string;
}

const AuthProvider = ({ children, authToken }: AuthProviderProps) => {
  const value = useMemo(
    () => ({
      authToken,
    }),
    [authToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
