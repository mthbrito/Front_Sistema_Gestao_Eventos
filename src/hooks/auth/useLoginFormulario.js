import { useState } from "react";
import { useAuth } from "./useAuth";

export function useLoginFormulario() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();

    setCarregando(true);
    setErro("");

    try {
      await login(email, senha);
    } catch (err) {
      setErro(
        err.message ||
          "E-mail ou senha inválidos."
      );
    } finally {
      setCarregando(false);
    }
  }

  return {
    email,
    senha,
    erro,
    carregando,
    setEmail,
    setSenha,
    setErro,
    handleSubmit,
  };
}