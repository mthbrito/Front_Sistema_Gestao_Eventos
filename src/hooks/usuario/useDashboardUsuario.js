import { useEventosUsuario } from "./useEventosUsuario";
import { useInscricoesUsuario } from "./useInscricoesUsuario";
import { useNotificacoesUsuario } from "./useNotificacoesUsuario";

export const useDashboardUsuario = (usuarioId) => {
  const eventos = useEventosUsuario();
  const inscricoes = useInscricoesUsuario(usuarioId);
  const notificacoes = useNotificacoesUsuario(usuarioId);

  return {
    eventos,
    inscricoes,
    notificacoes,
    carregando: eventos.carregando || inscricoes.carregando || notificacoes.carregando,
    recarregarTudo: () => {
      eventos.recarregar();
      inscricoes.recarregar();
      notificacoes.recarregar();
    },
    totalNotificacoes: notificacoes.lista?.length ?? 0,
  };
};