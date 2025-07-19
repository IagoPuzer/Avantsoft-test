import React, { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { authService } from "../services/authService";
import type { Usuario } from "../types";
import { AuthContext } from "../contexts/AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário salvo no localStorage
    const usuarioSalvo = authService.getCurrentUser();
    if (usuarioSalvo && authService.isAuthenticated()) {
      setUsuario(usuarioSalvo);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, senha: string) => {
    try {
      setLoading(true);
      const { usuario: usuarioLogado } = await authService.login(email, senha);
      setUsuario(usuarioLogado);
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUsuario(null);
  };

  const value = {
    usuario,
    isAuthenticated: !!usuario,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
