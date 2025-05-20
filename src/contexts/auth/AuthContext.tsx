
import { createContext } from "react";
import { AuthContextProps } from "./types";

// Create context with default values
export const AuthContext = createContext<AuthContextProps | undefined>(undefined);
