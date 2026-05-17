import { useCallback, useEffect, useState } from "react";
import { eventos, inscricoes, notificacoes } from "../services/apiService";

function normalizar(data) {
  return Array.isArray(data) ? data : (data.content ?? []);
}

export function useAbas(usuarioId) {
  const [abaAtiva, setAbaAtiva] = useState("eventos");
  const [listaEventos, setListaEventos] = useState([]);
  const [minhasInscricoes, setMinhasInscricoes] = useState([]);
  const [listaNotificacoes, setListaNotificacoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    async function carregar() {
      setLoading(true);
      setErro("");
      try {
        if (abaAtiva === "eventos") {
          const data = await eventos.listar();
          setListaEventos(normalizar(data));
        } else if (abaAtiva === "inscricoes") {
          const data = await inscricoes.listarPorUsuario(usuarioId);
          setMinhasInscricoes(normalizar(data));
        } else if (abaAtiva === "notificacoes") {
          const data = await notificacoes.listar();
          setListaNotificacoes(normalizar(data));
        }
      } catch (err) {
        setErro(err.message || "Erro ao carregar dados.");
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, [abaAtiva, usuarioId, tick]);

  const atualizar = useCallback(() => setTick((t) => t + 1), []);

  return {
    abaAtiva,
    setAbaAtiva,
    listaEventos,
    minhasInscricoes,
    listaNotificacoes,
    loading,
    erro,
    setErro,
    atualizar,
  };
}
