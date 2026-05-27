import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { notificacaoService } from "../../services/notificacaoService";
import { usuarioService } from "../../services/usuarioService";
import { extrairLista } from "../../utils/paginacao";

export const useNotificacoesAdmin = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-notificacoes"],
    queryFn: () =>
      Promise.all([
        notificacaoService.listar(0, 100),
        usuarioService.listar(0, 100),
      ]),
  });

  const invalidar = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-notificacoes"] });

  const { mutateAsync: enviar, isPending: salvandoEnviar } = useMutation({
    mutationFn: (dados) => notificacaoService.salvar(dados),
    onSuccess: () => {
      toast.success("Notificação enviada!");
      invalidar();
    },
    onError: (error) => {
      const mensagem =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message || error.message || "Ocorreu um erro.";
      toast.error(mensagem);
    },
  });

  const { mutateAsync: deletar, isPending: salvandoDeletar } = useMutation({
    mutationFn: (id) => notificacaoService.deletar(id),
    onSuccess: () => {
      toast.success("Notificação removida!");
      invalidar();
    },
    onError: (error) => {
      const mensagem =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message || error.message || "Ocorreu um erro.";
      toast.error(mensagem);
    },
  });

  const { mutateAsync: deletarVarios, isPending: salvandoDeletarVarios } = useMutation({
    mutationFn: (ids) => Promise.all(ids.map((id) => notificacaoService.deletar(id))),
    onSuccess: () => {
      toast.success("Notificações removidas!");
      invalidar();
    },
    onError: () => toast.error("Erro ao remover notificações."),
  });

  return {
    lista: extrairLista(data?.[0]),
    usuarios: extrairLista(data?.[1]),
    carregando: isLoading,
    salvando: salvandoEnviar || salvandoDeletar || salvandoDeletarVarios,
    enviar,
    deletar,
    deletarVarios,
    recarregar: refetch,
  };
};
