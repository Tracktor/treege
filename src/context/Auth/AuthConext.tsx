import { createContext } from "react";

export interface AuthDefaultValue {
  authToken: null | string;
}

export const authDefaultValue: AuthDefaultValue = {
  authToken: null,
};

export const AuthContext = createContext(authDefaultValue);
