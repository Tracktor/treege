import { createContext } from "react";

export interface Auth {
  authToken?: string;
}

export const authDefaultValue = {
  authToken: undefined,
};

export const AuthContext = createContext<Auth>(authDefaultValue);
