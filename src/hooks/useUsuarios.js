import { useCallback, useEffect, useState } from "react";
import { perfis, usuarios } from "../services/apiService";

export function useUsuarios() {
  const [lista, setLista] = useState([]);
  const [perfisLista, setPerfisLista] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      const [resUsuarios, resPerfis] = await Promise.all([
        usuarios.listar(0, 100),
        perfis.listar(0, 100),
      ]);
      setLista(resUsuarios?.content ?? resUsuarios ?? []);
      setPerfisLista(resPerfis?.content ?? resPerfis ?? []);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const atualizar = async (id, dados) => {
    try {
      await usuarios.atualizar(id, dados);
      setSucesso("Usuário atualizado!");
      await carregar();
      return true;
    } catch (e) {
      setErro(e.message);
      return false;
    }
  };

  const deletar = async (id) => {
    try {
      await usuarios.deletar(id);
      setSucesso("Usuário removido!");
      await carregar();
      return true;
    } catch (e) {
      setErro(e.message);
      return false;
    }
  };

  return { lista, perfisLista, carregando, erro, setErro, sucesso, setSucesso, atualizar, deletar, carregar };
}