import { request } from "./api";

export const notificacaoService = {
  listar: (page = 0, size = 10) =>
    request("GET", "/api/sge/notificacoes", null, { page, size }),

  listarPorUsuario: (usuarioId, page = 0, size = 100) =>
    request("GET", `/api/sge/notificacoes/usuario/${usuarioId}`, null, { page, size }),

  buscarPorId: (id) => request("GET", `/api/sge/notificacoes/${id}`),

  salvar: (dados) => request("POST", "/api/sge/notificacoes", dados),

  atualizar: (id, dados) => request("PUT", `/api/sge/notificacoes/${id}`, dados),

  deletar: (id) => request("DELETE", `/api/sge/notificacoes/${id}`),
};