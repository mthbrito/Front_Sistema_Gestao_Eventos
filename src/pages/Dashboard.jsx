import { useNavigate } from "react-router-dom";
import { useAbas } from "../hooks/useAbas";
import { useAuth } from "../hooks/useAuth";
import { useInscricao } from "../hooks/useInscricao";
import "./Login.css";

const ABAS = [
  { id: "eventos", icone: "bi-calendar-event", label: "Eventos" },
  { id: "inscricoes", icone: "bi-bookmark-check", label: "Minhas Inscrições" },
  { id: "notificacoes", icone: "bi-bell", label: "Notificações" },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const {
    abaAtiva,
    setAbaAtiva,
    listaEventos,
    minhasInscricoes,
    listaNotificacoes,
    loading,
    erro: erroDados,
    setErro: setErroDados,
    atualizar,
  } = useAbas(user.id);

  const {
    sucesso,
    setSucesso,
    erro: erroInscricao,
    setErro: setErroInscricao,
    inscrever,
  } = useInscricao(user.id);

  const handleSair = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="sge-dash-bg min-vh-100">
      {/* ── Navbar ─────────────────────────────────── */}
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
        <button
          className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
          onClick={handleSair}
        >
          <i className="bi bi-box-arrow-right" />
          <span className="d-none d-sm-inline">Sair</span>
        </button>
      </nav>

      {/* ── Conteúdo ───────────────────────────────── */}
      <div className="container py-4">
        {/* Alertas globais */}
        {sucesso && (
          <div
            className="alert alert-success alert-dismissible fade show py-2 small mb-3"
            role="alert"
          >
            <i className="bi bi-check-circle-fill me-2" />
            {sucesso}
            <button
              type="button"
              className="btn-close"
              aria-label="Fechar"
              onClick={() => setSucesso("")}
            />
          </div>
        )}
        {(erroDados || erroInscricao) && (
          <div
            className="alert alert-danger alert-dismissible fade show py-2 small mb-3"
            role="alert"
          >
            <i className="bi bi-exclamation-triangle-fill me-2" />
            {erroDados || erroInscricao}
            <button
              type="button"
              className="btn-close"
              aria-label="Fechar"
              onClick={() => {
                setErroDados("");
                setErroInscricao("");
              }}
            />
          </div>
        )}

        {/* ── Abas ─────────────────────────────────── */}
        <div className="d-flex gap-2 mb-4 flex-wrap">
          {ABAS.map((aba) => (
            <button
              key={aba.id}
              className={`btn sge-tab-btn ${abaAtiva === aba.id ? "sge-tab-ativo" : ""}`}
              onClick={() => setAbaAtiva(aba.id)}
            >
              <i className={`bi ${aba.icone} me-2`} />
              {aba.label}
              {aba.id === "notificacoes" && listaNotificacoes.length > 0 && (
                <span
                  className="badge bg-danger ms-2 rounded-pill"
                  style={{ fontSize: "0.65rem" }}
                >
                  {listaNotificacoes.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Loading ──────────────────────────────── */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" />
            <p className="text-body-secondary small mt-3 mb-0">Carregando...</p>
          </div>
        )}

        {/* ── ABA: Eventos ─────────────────────────── */}
        {!loading && abaAtiva === "eventos" && (
          <>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold text-body-emphasis mb-0">
                <i className="bi bi-calendar-event me-2 text-primary" />
                Eventos disponíveis
              </h5>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={atualizar}
              >
                <i className="bi bi-arrow-clockwise me-1" /> Atualizar
              </button>
            </div>

            {listaEventos.length === 0 ? (
              <div className="text-center py-5 opacity-75">
                <i
                  className="bi bi-calendar-x text-body-secondary"
                  style={{ fontSize: "2.5rem" }}
                />
                <p className="text-body-secondary mt-3 mb-0">
                  Nenhum evento disponível no momento.
                </p>
              </div>
            ) : (
              <div className="row g-3">
                {listaEventos.map((evento) => (
                  <div key={evento.id} className="col-12 col-md-6 col-lg-4">
                    <div className="card sge-card h-100 border-0 shadow-sm">
                      <div className="card-body d-flex flex-column">
                        <div className="d-flex align-items-start justify-content-between mb-2">
                          <span className="sge-badge-tipo text-uppercase">
                            {evento.tipoEvento ?? "Evento"}
                          </span>
                          <span className="text-body-secondary small">
                            <i className="bi bi-people me-1" />
                            {evento.totalInscricoes ?? 0}
                          </span>
                        </div>
                        <h6 className="fw-bold text-body-emphasis mb-1">
                          {evento.titulo}
                        </h6>
                        <p className="text-body-secondary small mb-2 flex-grow-1">
                          {evento.descricao}
                        </p>
                        <div className="d-flex flex-column gap-1 small text-body-secondary mb-3">
                          <div>
                            <i className="bi bi-calendar2 me-1" />
                            {evento.dataInicio} → {evento.dataTermino}
                          </div>
                          {evento.salaNome && (
                            <div>
                              <i className="bi bi-geo-alt me-1" />
                              {evento.salaLocalizacao
                                ? `${evento.salaLocalizacao} - `
                                : ""}
                              {evento.salaNome}
                            </div>
                          )}
                          {evento.organizadorNome && (
                            <div>
                              <i className="bi bi-person me-1" />
                              {evento.organizadorNome}
                            </div>
                          )}
                        </div>
                        <button
                          className="btn btn-primary sge-btn-inscricao w-100 mt-auto"
                          onClick={() => inscrever(evento.id)}
                        >
                          <i className="bi bi-plus-circle me-2" />
                          Inscrever-se
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── ABA: Minhas Inscrições ────────────────── */}
        {!loading && abaAtiva === "inscricoes" && (
          <>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold text-body-emphasis mb-0">
                <i className="bi bi-bookmark-check me-2 text-primary" />
                Minhas inscrições
              </h5>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={atualizar}
              >
                <i className="bi bi-arrow-clockwise me-1" /> Atualizar
              </button>
            </div>

            {minhasInscricoes.length === 0 ? (
              <div className="text-center py-5 opacity-75">
                <i
                  className="bi bi-bookmark-x text-body-secondary"
                  style={{ fontSize: "2.5rem" }}
                />
                <p className="text-body-secondary mt-3 mb-1">
                  Você ainda não tem inscrições.
                </p>
                <button
                  className="btn btn-sm btn-primary mt-2"
                  onClick={() => setAbaAtiva("eventos")}
                >
                  Ver eventos disponíveis
                </button>
              </div>
            ) : (
              <div className="row g-3">
                {minhasInscricoes.map((inscricao) => (
                  <div key={inscricao.id} className="col-12 col-md-6">
                    <div className="card sge-card border-0 shadow-sm">
                      <div className="card-body">
                        <div className="d-flex align-items-start justify-content-between mb-2">
                          <h6 className="fw-bold text-body-emphasis mb-0">
                            {inscricao.eventoNome}
                          </h6>
                          <span
                            className={`sge-badge-status ms-2 ${
                              inscricao.status === "CONFIRMADA"
                                ? "sge-badge-confirmada"
                                : inscricao.status === "CANCELADA"
                                  ? "sge-badge-cancelada"
                                  : "sge-badge-pendente"
                            }`}
                          >
                            {inscricao.status}
                          </span>
                        </div>
                        <p className="text-body-secondary small mb-2">
                          <i className="bi bi-calendar2 me-1" />
                          Inscrito em: {inscricao.dataInscricao}
                        </p>
                        <span
                          className={`small ${inscricao.presente ? "text-success" : "text-body-secondary"}`}
                        >
                          <i
                            className={`bi ${inscricao.presente ? "bi-check-circle-fill" : "bi-circle"} me-1`}
                          />
                          {inscricao.presente
                            ? "Presença confirmada"
                            : "Presença pendente"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── ABA: Notificações ────────────────────── */}
        {!loading && abaAtiva === "notificacoes" && (
          <>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold text-body-emphasis mb-0">
                <i className="bi bi-bell me-2 text-primary" />
                Notificações
              </h5>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={atualizar}
              >
                <i className="bi bi-arrow-clockwise me-1" /> Atualizar
              </button>
            </div>

            {listaNotificacoes.length === 0 ? (
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
                {listaNotificacoes.map((notif) => (
                  <div
                    key={notif.id}
                    className="card sge-card border-0 shadow-sm sge-notif-card"
                  >
                    <div className="card-body py-3 d-flex align-items-start gap-3">
                      <div className="sge-notif-icon flex-shrink-0">
                        <i className="bi bi-bell-fill" />
                      </div>
                      <div className="flex-grow-1">
                        <p className="mb-1 fw-semibold small text-body-emphasis">
                          {notif.mensagem ?? notif.titulo}
                        </p>
                        {notif.dataEnvio && (
                          <span
                            className="text-body-secondary"
                            style={{ fontSize: "0.75rem" }}
                          >
                            <i className="bi bi-clock me-1" />
                            {notif.dataEnvio}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
