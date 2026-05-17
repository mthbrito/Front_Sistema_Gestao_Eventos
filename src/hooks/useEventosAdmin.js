import { useCallback, useEffect, useState } from "react";
import { eventos, salas, usuarios } from "../services/apiService";

export function useEventosAdmin() {
  const [lista, setLista] = useState([]);
  const [salasList, setSalasList] = useState([]);
  const [organizadoresList, setOrganizadoresList] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      const [resEventos, resSalas, resUsuarios] = await Promise.all([
        eventos.listar(0, 100),
        salas.listar(0, 100),
        usuarios.listar(0, 100),
      ]);
      setLista(resEventos?.content ?? resEventos ?? []);
      setSalasList(resSalas?.content ?? resSalas ?? []);
      setOrganizadoresList(resUsuarios?.content ?? resUsuarios ?? []);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const salvar = async (dados, id = null) => {
    try {
      if (id) await eventos.atualizar(id, dados);
      else await eventos.salvar(dados);
      setSucesso(id ? "Evento atualizado!" : "Evento criado!");
      await carregar();
      return true;
    } catch (e) {
      setErro(e.message);
      return false;
    }
  };

  const deletar = async (id) => {
    try {
      await eventos.deletar(id);
      setSucesso("Evento removido!");
      await carregar();
      return true;
    } catch (e) {
      setErro(e.message);
      return false;
    }
  };

  return { lista, salasList, organizadoresList, carregando, erro, setErro, sucesso, setSucesso, salvar, deletar, carregar };
}