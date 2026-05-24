import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { salaService } from "../../services/salaService";
import { extrairLista } from "../../utils/paginacao";

export const useSalasAdmin = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-salas"],
    queryFn: () => salaService.listar(0, 100),
  });

  const invalidar = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-salas"] });

  const { mutateAsync: salvar, isPending: salvandoSalvar } = useMutation({
    mutationFn: ({ dados, id }) =>
      id ? salaService.atualizar(id, dados) : salaService.salvar(dados),
    onSuccess: (_, { id }) => {
      const mensagem = id ? "Sala atualizada!" : "Sala criada!";
      toast.success(mensagem);
      invalidar();
    },
    onError: (error) => {
      const mensagem = error?.response?.data?.message || error.message || "Ocorreu um erro.";
      toast.error(mensagem);
    },
  });

  const { mutateAsync: deletar, isPending: salvandoDeletar } = useMutation({
    mutationFn: (id) => salaService.deletar(id),
    onSuccess: () => {
      toast.success("Sala removida!");
      invalidar();
    },
    onError: (error) => {
      const mensagem = error?.response?.data?.message || error.message || "Ocorreu um erro.";
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