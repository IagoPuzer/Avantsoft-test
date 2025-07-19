import { createContext } from "react";
import type { Usuario } from "../types";

interface AuthContextType {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
