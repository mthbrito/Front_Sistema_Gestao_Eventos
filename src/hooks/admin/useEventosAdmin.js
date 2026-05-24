import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { eventoService } from "../../services/eventoService";
import { salaService } from "../../services/salaService";
import { usuarioService } from "../../services/usuarioService";
import { extrairLista } from "../../utils/paginacao";

export const useEventosAdmin = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-eventos"],
    queryFn: () =>
      Promise.all([
        eventoService.listar(0, 100),
        salaService.listar(0, 100),
        usuarioService.listar(0, 100),
      ]),
  });

  const invalidar = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-eventos"] });

  const { mutateAsync: salvar, isPending: salvandoSalvar } = useMutation({
    mutationFn: ({ dados, id }) =>
      id ? eventoService.atualizar(id, dados) : eventoService.salvar(dados),
    onSuccess: (_, { id }) => {
      const mensagem = id ? "Evento atualizado!" : "Evento criado!";
      toast.success(mensagem);
      invalidar();
    },
    onError: (error) => {
      const mensagem = error?.response?.data?.message || error.message || "Ocorreu um erro."; 
      toast.error(mensagem);
    },
  });

  const { mutateAsync: deletar, isPending: salvandoDeletar } = useMutation({
    mutationFn: (id) => eventoService.deletar(id),
    onSuccess: () => {
      toast.success("Evento removido!");
      invalidar();
    },
    onError: (error) => {
      const mensagem = error?.response?.data?.message || error.message || "Ocorreu um erro.";
      toast.error(mensagem);
    },
  });

  return {
    lista: extrairLista(data?.[0]),
    salas: extrairLista(data?.[1]),
    organizadores: extrairLista(data?.[2]),
    carregando: isLoading,
    salvando: salvandoSalvar || salvandoDeletar,
    salvar,
    deletar,
    recarregar: refetch,
  };
};
