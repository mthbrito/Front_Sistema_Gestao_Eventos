import { request } from "./api";

export const usuarioService = {
  listar: (page = 0, size = 10) => request("GET", "/api/sge/usuarios", null, { page, size }),

  buscarPorId: (id) => request("GET", `/api/sge/usuarios/${id}`),

  salvar: (dados) => request("POST", "/api/sge/usuarios", dados),

  atualizar: (id, dados) => request("PUT", `/api/sge/usuarios/${id}`, dados),

  deletar: (id) => request("DELETE", `/api/sge/usuarios/${id}`),
};
