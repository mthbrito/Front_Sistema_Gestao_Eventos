import { useCallback, useEffect, useState } from "react";
import { perfis } from "../services/apiService";

export function usePerfis() {
  const [lista, setLista] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      const res = await perfis.listar(0, 100);
      setLista(res?.content ?? res ?? []);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const salvar = async (dados) => {
    try {
      await perfis.salvar(dados);
      setSucesso("Perfil criado!");
      await carregar();
      return true;
    } catch (e) {
      setErro(e.message);
      return false;
    }
  };

  const deletar = async (id) => {
    try {
      await perfis.deletar(id);
      setSucesso("Perfil removido!");
      await carregar();
      return true;
    } catch (e) {
      setErro(e.message);
      return false;
    }
  };

  return { lista, carregando, erro, setErro, sucesso, setSucesso, salvar, deletar, carregar };
}