import { useCallback, useEffect, useState } from "react";
import { notificacoes, usuarios } from "../services/apiService";

export function useNotificacoesAdmin() {
  const [lista, setLista] = useState([]);
  const [usuariosList, setUsuariosList] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      const [resNotif, resUsuarios] = await Promise.all([
        notificacoes.listar(0, 100),
        usuarios.listar(0, 100),
      ]);
      setLista(resNotif?.content ?? resNotif ?? []);
      setUsuariosList(resUsuarios?.content ?? resUsuarios ?? []);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const enviar = async (dados) => {
    try {
      await notificacoes.salvar(dados);
      setSucesso("Notificação enviada!");
      await carregar();
      return true;
    } catch (e) {
      setErro(e.message);
      return false;
    }
  };

  const deletar = async (id) => {
    try {
      await notificacoes.deletar(id);
      setSucesso("Notificação removida!");
      await carregar();
      return true;
    } catch (e) {
      setErro(e.message);
      return false;
    }
  };

  return { lista, usuariosList, carregando, erro, setErro, sucesso, setSucesso, enviar, deletar, carregar };
}