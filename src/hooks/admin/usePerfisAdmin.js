import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { perfilService } from "../../services/perfilService";
import { extrairLista } from "../../utils/paginacao";

export const usePerfisAdmin = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-perfis"],
    queryFn: () => perfilService.listar(0, 100),
  });

  const invalidar = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-perfis"] });

  const { mutateAsync: salvar, isPending: salvandoSalvar } = useMutation({
    mutationFn: (dados) => perfilService.salvar(dados),
    onSuccess: () => {
      toast.success("Perfil criado!");
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
    mutationFn: (id) => perfilService.deletar(id),
    onSuccess: () => {
      toast.success("Perfil removido!");
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

  return {
    lista: extrairLista(data),
    carregando: isLoading,
    salvando: salvandoSalvar || salvandoDeletar,
    salvar,
    deletar,
    recarregar: refetch,
  };
};
