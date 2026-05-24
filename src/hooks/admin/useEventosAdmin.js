import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { eventoService } from "../../services/eventoService";
import { salaService } from "../../services/salaService";
import { usuarioService } from "../../services/usuarioService";
import { extrairLista } from "../../utils/paginacao";

export const useEventosAdmin = () => {
  const queryClient = useQueryClient();

  const { data: dataEventos, isLoading: loadingEventos, refetch } = useQuery({
    queryKey: ["admin-eventos"],
    queryFn: () => eventoService.listar(0, 100),
  });

  const { data: dataSalas, isLoading: loadingSalas } = useQuery({
    queryKey: ["admin-salas"],
    queryFn: () => salaService.listar(0, 100),
  });

  const { data: dataUsuarios, isLoading: loadingUsuarios } = useQuery({
    queryKey: ["admin-usuarios"],
    queryFn: () => usuarioService.listar(0, 100),
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
      const mensagem =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message || error.message || "Ocorreu um erro.";
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
      const mensagem =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message || error.message || "Ocorreu um erro.";
      toast.error(mensagem);
    },
  });

  return {
    lista: extrairLista(dataEventos),
    salas: extrairLista(dataSalas),
    organizadores: extrairLista(dataUsuarios),
    carregando: loadingEventos || loadingSalas || loadingUsuarios,
    salvando: salvandoSalvar || salvandoDeletar,
    salvar,
    deletar,
    recarregar: refetch,
  };
};
