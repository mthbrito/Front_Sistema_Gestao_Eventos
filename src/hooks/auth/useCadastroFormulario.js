import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { usuarioService } from "../../services/usuarioService";
import { cadastroSchema } from "../../utils/schemas";

const PERFIL_USER_ID = 2;

export function useCadastroFormulario() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    funcao: "",
  });

  const mutation = useMutation({
    mutationFn: usuarioService.salvar,

    onSuccess: () => {
      toast.success("Usuário cadastrado com sucesso");

      setTimeout(() => {
        navigate("/login");
      }, 5000);
    },

    onError: (erro) => {
      const mensagem = erro?.response?.data?.message || "Erro ao cadastrar usuário";
      toast.error(mensagem);
    },
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const resultado = cadastroSchema.safeParse(form);

    if (resultado.error) {
      const mensagem = resultado.error.issues[0].message;
      toast.error(mensagem);
      return;
    }

    mutation.mutate({
      nome: form.nome,
      email: form.email,
      senha: form.senha,
      funcao: form.funcao,
      perfisIds: [PERFIL_USER_ID],
    });
  };

  return {
    form,
    carregando: mutation.isPending,
    sucesso: mutation.isSuccess,
    handleChange,
    handleSubmit,
  };
}
