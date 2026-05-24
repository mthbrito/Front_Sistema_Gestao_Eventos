import { useQuery } from "@tanstack/react-query";
import { notificacaoService } from "../../services/notificacaoService";
import { extrairLista } from "../../utils/paginacao";

export const useNotificacoesUsuario = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["notificacoes"],
    queryFn: () => notificacaoService.listar(),
  });

  return {
    lista: extrairLista(data),
    carregando: isLoading,
    erro: error ? "Erro ao carregar notificações" : undefined,
    recarregar: refetch,
  };
};
