import { useEffect, useRef, useState } from "react";
import { inscricoes } from "../services/apiService";

export function useInscricao(usuarioId) {
  const [sucesso, setSucesso] = useState("");
  const [erro, setErro] = useState("");
  const timerRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const inscrever = async (eventoId) => {
    setSucesso("");
    setErro("");
    try {
      await inscricoes.salvar({ usuarioId, eventoId });
      setSucesso("Inscrição realizada com sucesso!");
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setSucesso(""), 6000);
    } catch (err) {
      setErro(err.message || "Erro ao realizar inscrição.");
    }
  };

  return { sucesso, setSucesso, erro, setErro, inscrever };
}
