export default function Navbar({ user, onSair }) {
  const inicial = user?.nome?.trim().charAt(0).toUpperCase() ?? "?";

  return (
    <nav className="navbar navbar-light bg-white border-bottom shadow-sm px-4 py-3">
      <div className="d-flex align-items-center gap-2">
        <div className="sge-logo-circle-sm">
          <i className="bi bi-calendar-event" />
        </div>
        <span className="navbar-brand fw-bold text-primary mb-0">SGE</span>
        <span className="text-body-secondary small d-none d-md-inline">
          · Sistema de Gestão de Eventos
        </span>
      </div>

      <div className="d-flex align-items-center gap-3">
        {user && (
          <div className="d-flex align-items-center gap-2">
            <div
              className="sge-avatar-sm d-flex align-items-center justify-content-center rounded-circle bg-primary text-white fw-bold"
              style={{ width: 32, height: 32, fontSize: "0.8rem", flexShrink: 0 }}
              aria-hidden="true"
            >
              {inicial}
            </div>
            <span className="small fw-semibold text-body-emphasis d-none d-sm-inline">
              {user.nome}
            </span>
          </div>
        )}

        <button
          className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
          onClick={onSair}
          aria-label="Sair da conta"
        >
          <i className="bi bi-box-arrow-right" aria-hidden="true" />
          <span className="d-none d-sm-inline">Sair</span>
        </button>
      </div>
    </nav>
  );
}