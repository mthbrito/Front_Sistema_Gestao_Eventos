import { useEventosAdmin } from "./useEventosAdmin";
import { useInscricoesAdmin } from "./useInscricoesAdmin";
import { useNotificacoesAdmin } from "./useNotificacoesAdmin";
import { usePerfisAdmin } from "./usePerfisAdmin";
import { useSalasAdmin } from "./useSalasAdmin";
import { useUsuariosAdmin } from "./useUsuariosAdmin";

export const useDashboardAdmin = () => {
  const eventos = useEventosAdmin();
  const usuarios = useUsuariosAdmin();
  const inscricoes = useInscricoesAdmin({ onAtualizar: eventos.recarregar });
  const salas = useSalasAdmin();
  const notificacoes = useNotificacoesAdmin();
  const perfis = usePerfisAdmin();

  return {
    eventos,
    usuarios,
    inscricoes,
    salas,
    notificacoes,
    perfis,
  };
};
