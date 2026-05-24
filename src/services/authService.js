import { request } from "./api";

export const authService = {
  login: (email, senha) =>
    request("POST", "/api/sge/auth/login", { email, senha }),

  solicitarRecuperacao: (email) =>
    request("POST", "/api/sge/auth/recuperar-senha", { email }),

  redefinirSenha: (token, novaSenha) =>
    request("POST", "/api/sge/auth/redefinir-senha", { token, novaSenha }),
};
