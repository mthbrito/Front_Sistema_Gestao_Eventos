import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { perfilService } from "../../services/perfilService";
import { usuarioService } from "../../services/usuarioService";
import { extrairLista } from "../../utils/paginacao";

export const useUsuariosAdmin = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-usuarios"],
    queryFn: () =>
      Promise.all([
        usuarioService.listar(0, 100),
        perfilService.listar(0, 100),
      ]),
  });

  const invalidar = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-usuarios"] });

  const { mutateAsync: atualizar, isPending: salvandoAtualizar } = useMutation({
    mutationFn: ({ id, dados }) => usuarioService.atualizar(id, dados),
    onSuccess: () => {
      toast.success("Usuário atualizado!");
      invalidar();
    },
    onError: (error) => {
      const mensagem =
        error?.response?.data?.message || error.message || "Ocorreu um erro.";
      toast.error(mensagem);
    },
  });

  const { mutateAsync: deletar, isPending: salvandoDeletar } = useMutation({
    mutationFn: (id) => usuarioService.deletar(id),
    onSuccess: () => {
      toast.success("Usuário removido!");
      invalidar();
    },
    onError: (error) => {
      const mensagem =
        error?.response?.data?.message || error.message || "Ocorreu um erro.";
      toast.error(mensagem);
    },
  });

  return {
    lista: extrairLista(data?.[0]),
    perfis: extrairLista(data?.[1]),
    carregando: isLoading,
    salvando: salvandoAtualizar || salvandoDeletar,
    atualizar: (id, dados) => atualizar({ id, dados }),
    deletar,
    recarregar: refetch,
  };
};
