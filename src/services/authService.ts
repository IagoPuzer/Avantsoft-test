// Serviços de Autenticação
export const authService = {
  login: async (email: string, senha: string) => {
    // Aceitar qualquer email válido e senha com pelo menos 6 caracteres
    if (email && email.includes("@") && senha && senha.length >= 6) {
      const token = "mock-jwt-token-" + Date.now();
      const usuario = {
        id: "1",
        nome: email.split("@")[0], // Usar parte do email como nome
        email: email,
      };

      localStorage.setItem("authToken", token);
      localStorage.setItem("usuario", JSON.stringify(usuario));

      return { token, usuario };
    } else {
      console.log("Credenciais inválidas:", { email, senha });
      throw new Error(
        "Credenciais inválidas - Email deve ser válido e senha deve ter pelo menos 6 caracteres"
      );
    }
  },

  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("usuario");
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("authToken");
  },

  getCurrentUser: () => {
    const usuario = localStorage.getItem("usuario");
    return usuario ? JSON.parse(usuario) : null;
  },
};
