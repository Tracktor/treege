import { ReactNode, useMemo, useState } from "react";
import { AuthContext, authDefaultValue } from "@/context/Auth/AuthConext";

interface AuthProviderProps {
  children: ReactNode;
  token?: string;
}

const AuthProvider = ({ children, token }: AuthProviderProps) => {
  const [authToken, setAuthToken] = useState(token || authDefaultValue.authToken);

  const value = useMemo(
    () => ({
      authToken,
      setAuthToken,
    }),
    [authToken, setAuthToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
