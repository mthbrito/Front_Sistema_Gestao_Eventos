import { useCallback, useEffect, useState } from "react";
import { inscricoes } from "../services/apiService";

export function useInscricoesAdmin() {
  const [lista, setLista] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [filtroEvento, setFiltroEvento] = useState("");
  const [filtroUsuario, setFiltroUsuario] = useState("");

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      const res = await inscricoes.listar(0, 200);
      setLista(res?.content ?? res ?? []);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const confirmar = async (id) => {
    try {
      await inscricoes.atualizar(id, { status: "CONFIRMADA" });
      setSucesso("Inscrição confirmada!");
      await carregar();
      return true;
    } catch (e) {
      setErro(e.message);
      return false;
    }
  };

  const cancelar = async (id) => {
    try {
      await inscricoes.atualizar(id, { status: "CANCELADA" });
      setSucesso("Inscrição cancelada!");
      await carregar();
      return true;
    } catch (e) {
      setErro(e.message);
      return false;
    }
  };

  const marcarPresenca = async (id, presente) => {
    try {
      await inscricoes.atualizar(id, { presente });
      setSucesso(presente ? "Presença marcada!" : "Presença desmarcada!");
      await carregar();
      return true;
    } catch (e) {
      setErro(e.message);
      return false;
    }
  };

  const listaFiltrada = lista.filter((i) => {
    const okEvento = filtroEvento
      ? String(i.eventoId ?? i.evento?.id ?? "") === String(filtroEvento)
      : true;
    const okUsuario = filtroUsuario
      ? String(i.usuarioId ?? i.usuario?.id ?? "").includes(filtroUsuario) ||
        (i.usuario?.nome ?? "").toLowerCase().includes(filtroUsuario.toLowerCase())
      : true;
    return okEvento && okUsuario;
  });

  return {
    lista: listaFiltrada,
    listaTotal: lista,
    carregando,
    erro, setErro,
    sucesso, setSucesso,
    filtroEvento, setFiltroEvento,
    filtroUsuario, setFiltroUsuario,
    confirmar, cancelar, marcarPresenca, carregar,
  };
}