export default function NotificacaoCard({ notificacao, onDeletar, deletando }) {
  return (
    <div className="card sge-card border-0 shadow-sm sge-notificacao-card">
      <div className="card-body py-3 d-flex align-items-start gap-3">
        <div className="sge-notificacao-icon flex-shrink-0">
          <i className="bi bi-bell-fill" />
        </div>
        <div className="flex-grow-1">
          <p className="mb-1 fw-semibold small text-body-emphasis">
            {notificacao.mensagem ?? notificacao.titulo}
          </p>
          {notificacao.dataEnvio && (
            <span className="text-body-secondary" style={{ fontSize: "0.75rem" }}>
              <i className="bi bi-clock me-1" />
              {notificacao.dataEnvio}
            </span>
          )}
        </div>
        <button
          type="button"
          className="btn btn-outline-danger btn-sm flex-shrink-0"
          title="Remover notificação"
          onClick={() => onDeletar(notificacao.id)}
          disabled={deletando}
        >
          <i className="bi bi-trash3" />
        </button>
      </div>
    </div>
  );
}