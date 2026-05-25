import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usuarioService } from "../../services/usuarioService";
import { useEventosUsuario } from "./useEventosUsuario";
import { useInscricoesUsuario } from "./useInscricoesUsuario";
import { useNotificacoesUsuario } from "./useNotificacoesUsuario";

export const useDashboardUsuario = (usuarioId) => {
  const queryClient = useQueryClient();
  const eventos      = useEventosUsuario();
  const inscricoes   = useInscricoesUsuario(usuarioId);
  const notificacoes = useNotificacoesUsuario(usuarioId);

  const { mutateAsync: editarUsuario, isPending: salvandoEdicao } = useMutation({
    mutationFn: (dados) => usuarioService.atualizar(usuarioId, dados),
    onSuccess: () => {
      toast.success("Dados atualizados com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["usuario", usuarioId] });
    },
    onError: (error) => {
      const msg = typeof error.response?.data === "string"
        ? error.response.data
        : error.response?.data?.message || error.message || "Ocorreu um erro.";
      toast.error(msg);
    },
  });

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
    editarUsuario,
    salvandoEdicao,
  };
};