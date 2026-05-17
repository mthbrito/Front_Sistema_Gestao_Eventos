import { useCallback, useEffect, useState } from "react";
import { salas } from "../services/apiService";

export function useSalas() {
  const [lista, setLista] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      const res = await salas.listar(0, 100);
      setLista(res?.content ?? res ?? []);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const salvar = async (dados, id = null) => {
    try {
      if (id) await salas.atualizar(id, dados);
      else await salas.salvar(dados);
      setSucesso(id ? "Sala atualizada!" : "Sala criada!");
      await carregar();
      return true;
    } catch (e) {
      setErro(e.message);
      return false;
    }
  };

  const deletar = async (id) => {
    try {
      await salas.deletar(id);
      setSucesso("Sala removida!");
      await carregar();
      return true;
    } catch (e) {
      setErro(e.message);
      return false;
    }
  };

  return { lista, carregando, erro, setErro, sucesso, setSucesso, salvar, deletar, carregar };
}