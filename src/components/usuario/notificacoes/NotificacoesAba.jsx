import SpinnerCentral from "../../SpinnerCentral";
import NotificacaoCard from "./NotificacaoCard";

export default function NotificacoesAba({ dados, onAtualizar }) {
  const { lista, carregando, deletar, deletarTodas, deletando } = dados;

  if (carregando) return <SpinnerCentral />;

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
        <h5 className="fw-bold text-body-emphasis mb-0">
          <i className="bi bi-bell me-2 text-primary" />
          Notificações
        </h5>
        <div className="d-flex gap-2">
          {lista.length > 0 && (
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={deletarTodas}
              disabled={deletando}
            >
              <i className="bi bi-trash3 me-1" />
              Apagar todas
            </button>
          )}
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={onAtualizar}
          >
            <i className="bi bi-arrow-clockwise me-1" /> Atualizar
          </button>
        </div>
      </div>

      {lista.length === 0 ? (
        <div className="text-center py-5 opacity-75">
          <i
            className="bi bi-bell-slash text-body-secondary"
            style={{ fontSize: "2.5rem" }}
          />
          <p className="text-body-secondary mt-3 mb-0">
            Nenhuma notificação por enquanto.
          </p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-2">
          {lista.map((notificacao) => (
            <NotificacaoCard
              key={notificacao.id}
              notificacao={notificacao}
              onDeletar={deletar}
              deletando={deletando}
            />
          ))}
        </div>
      )}
    </>
  );
}