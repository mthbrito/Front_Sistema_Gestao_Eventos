import { useQuery } from "@tanstack/react-query";
import { eventoService } from "../../services/eventoService";
import { extrairLista } from "../../utils/paginacao";

export const useEventosUsuario = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["eventos"],
    queryFn: () => eventoService.listar(0, 100),
  });

  return {
    lista: extrairLista(data),
    carregando: isLoading,
    erro: error ? "Erro ao carregar eventos" : undefined,
    recarregar: refetch,
  };
};
