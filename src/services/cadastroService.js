import { request } from "./api";

export const cadastroService = {
    cadastrar: (dados) =>
        request("POST", "/api/sge/auth/cadastro", dados),
};