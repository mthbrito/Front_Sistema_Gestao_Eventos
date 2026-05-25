import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { notificacaoService } from "../../services/notificacaoService";
import { extrairLista } from "../../utils/paginacao";

export const useNotificacoesUsuario = (usuarioId) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["notificacoes-usuario", usuarioId],
    queryFn: () => notificacaoService.listarPorUsuario(usuarioId),
    enabled: !!usuarioId,
  });

  const invalidar = () =>
    queryClient.invalidateQueries({ queryKey: ["notificacoes-usuario", usuarioId] });

  const { mutateAsync: deletar, isPending: deletando } = useMutation({
    mutationFn: (id) => notificacaoService.deletar(id),
    onSuccess: () => {
      toast.success("Notificação removida!");
      invalidar();
    },
    onError: (error) => {
      const msg = typeof error.response?.data === "string"
        ? error.response.data
        : error.response?.data?.message || error.message || "Ocorreu um erro.";
      toast.error(msg);
    },
  });

  const lista = extrairLista(data);

  const deletarTodas = async () => {
    if (lista.length === 0) return;
    try {
      await Promise.all(lista.map((n) => notificacaoService.deletar(n.id)));
      toast.success("Todas as notificações foram removidas!");
      invalidar();
    } catch {
      toast.error("Erro ao remover notificações.");
    }
  };

  return {
    lista,
    carregando: isLoading,
    deletando,
    erro: error ? "Erro ao carregar notificações" : undefined,
    deletar,
    deletarTodas,
    recarregar: refetch,
  };
};