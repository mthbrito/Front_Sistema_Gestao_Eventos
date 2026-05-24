import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { loginSchema } from "../../utils/schemas";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export function useLoginFormulario() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const { login } = useAuth();

  const mutation = useMutation({
    mutationFn: ({ email, senha }) => login(email, senha),

    onSuccess: () => {
      toast.success("Login realizado com sucesso!");
    },

    onError: (error) => {
      const mensagem = error?.response?.data?.message || "Erro ao realizar login.";
      toast.error(mensagem);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const resultado = loginSchema.safeParse({ email, senha });

    if (resultado.error) {
      const mensagem = resultado.error.issues[0].message;
      toast.error(mensagem);
      return;
    }

    mutation.mutate({ email, senha });
  };

  return {
    email,
    senha,
    carregando: mutation.isPending,
    setEmail,
    setSenha,
    handleSubmit,
  };
}
