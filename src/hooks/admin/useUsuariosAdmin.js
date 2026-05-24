import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { perfilService } from "../../services/perfilService";
import { usuarioService } from "../../services/usuarioService";
import { extrairLista } from "../../utils/paginacao";

export const useUsuariosAdmin = () => {
  const queryClient = useQueryClient();

  const { data: dataUsuarios, isLoading: loadingUsuarios, refetch: refetchUsuarios } = useQuery({
    queryKey: ["admin-usuarios"],
    queryFn: () => usuarioService.listar(0, 100),
  });

  const { data: dataPerfis, isLoading: loadingPerfis, refetch: refetchPerfis } = useQuery({
    queryKey: ["admin-perfis-lista"],
    queryFn: () => perfilService.listar(0, 100),
  });

  const invalidar = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-usuarios"] });
    queryClient.invalidateQueries({ queryKey: ["admin-perfis-lista"] });
  };

  const { mutateAsync: atualizar, isPending: salvandoAtualizar } = useMutation({
    mutationFn: ({ id, dados }) => usuarioService.atualizar(id, dados),
    onSuccess: () => {
      toast.success("Usuário atualizado!");
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
    mutationFn: (id) => usuarioService.deletar(id),
    onSuccess: () => {
      toast.success("Usuário removido!");
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
    lista: extrairLista(dataUsuarios),
    perfis: extrairLista(dataPerfis),
    carregando: loadingUsuarios || loadingPerfis,
    salvando: salvandoAtualizar || salvandoDeletar,
    atualizar: (id, dados) => atualizar({ id, dados }),
    deletar,
    recarregar: () => { refetchUsuarios(); refetchPerfis(); },
  };
};
