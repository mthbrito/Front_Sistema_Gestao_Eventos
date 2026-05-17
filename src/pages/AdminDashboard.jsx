import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertaFeedback } from "../components/AlertaFeedback";
import { ConfirmacaoModal } from "../components/admin/ConfirmacaoModal";
import { EventoForm } from "../components/admin/EventoForm";
import { NotificacaoForm } from "../components/admin/NotificacaoForm";
import { SalaForm } from "../components/admin/SalaForm";
import { UsuarioForm } from "../components/admin/UsuarioForm";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";
import { useEventosAdmin } from "../hooks/useEventosAdmin";
import { useInscricoesAdmin } from "../hooks/useInscricoesAdmin";
import { useNotificacoesAdmin } from "../hooks/useNotificacoesAdmin";
import { usePerfis } from "../hooks/usePerfis";
import { useSalas } from "../hooks/useSalas";
import { useUsuarios } from "../hooks/useUsuarios";
import "./Login.css";

const ABAS = [
  { id: "eventos",      icone: "bi-calendar-event", label: "Eventos" },
  { id: "usuarios",     icone: "bi-people",          label: "Usuários" },
  { id: "inscricoes",   icone: "bi-bookmark-check",  label: "Inscrições" },
  { id: "salas",        icone: "bi-door-open",        label: "Salas" },
  { id: "notificacoes", icone: "bi-bell",             label: "Notificações" },
  { id: "perfis",       icone: "bi-shield-check",     label: "Perfis" },
];

const statusCor = {
  CONFIRMADA: "sge-badge-confirmada",
  CANCELADA:  "sge-badge-cancelada",
  PENDENTE:   "sge-badge-pendente",
};

function fmt(dt) {
  if (!dt) return "—";
  return new Date(dt).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

function InlineModal({ titulo, children, onFechar }) {
  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={(e) => e.target === e.currentTarget && onFechar()}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "0.75rem" }}>
          <div className="modal-header border-0 pb-0">
            <h6 className="modal-title fw-bold text-body-emphasis">{titulo}</h6>
            <button className="btn-close" onClick={onFechar} />
          </div>
          <div className="modal-body pt-3 pb-4 px-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

function TabelaVazia({ icone, texto }) {
  return (
    <div className="text-center py-5 opacity-75">
      <i className={`bi ${icone} text-body-secondary`} style={{ fontSize: "2.5rem" }} />
      <p className="text-body-secondary mt-3 mb-0 small">{texto}</p>
    </div>
  );
}

function SpinnerCentral() {
  return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status" />
      <p className="text-body-secondary small mt-3 mb-0">Carregando...</p>
    </div>
  );
}

/* ── ABA EVENTOS ─────────────────────────────── */
function AbaEventos({ hook }) {
  const { lista, salasList, organizadoresList, carregando, erro, setErro, sucesso, setSucesso, salvar, deletar } = hook;
  const [modal, setModal] = useState(null);
  const [confirmacao, setConfirmacao] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSalvar = async (dados) => {
    setSaving(true);
    const ok = await salvar(dados, modal?.item?.id ?? null);
    setSaving(false);
    if (ok) setModal(null);
  };

  const handleDeletar = async () => {
    setSaving(true);
    await deletar(confirmacao.item.id);
    setSaving(false);
    setConfirmacao(null);
  };

  return (
    <>
      <AlertaFeedback sucesso={sucesso} erro={erro} onFecharSucesso={() => setSucesso("")} onFecharErro={() => setErro("")} />

      <div className="d-flex align-items-center justify-content-between mb-3">
        <h6 className="fw-bold text-body-emphasis mb-0">
          <i className="bi bi-calendar-event me-2 text-primary" />Gerenciar eventos
        </h6>
        <button className="btn sge-btn-login btn-sm text-white" onClick={() => setModal({ tipo: "novo" })}>
          <i className="bi bi-plus-lg me-1" /> Novo evento
        </button>
      </div>

      {carregando ? <SpinnerCentral /> : lista.length === 0 ? (
        <TabelaVazia icone="bi-calendar-x" texto="Nenhum evento cadastrado." />
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle small">
            <thead className="table-light">
              <tr>
                <th>Título</th><th>Tipo</th><th>Início</th><th>Sala</th>
                <th>Organizador</th><th>Inscrições</th><th className="text-end">Ações</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((ev) => (
                <tr key={ev.id}>
                  <td className="fw-semibold">{ev.titulo}</td>
                  <td><span className="sge-badge-tipo">{ev.tipo}</span></td>
                  <td>{fmt(ev.dataInicio)}</td>
                  <td>{ev.sala?.nome ?? "—"}</td>
                  <td>{ev.organizador?.nome ?? "—"}</td>
                  <td>
                    <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill">
                      {ev.totalInscricoes ?? 0}
                    </span>
                  </td>
                  <td className="text-end">
                    <div className="d-flex gap-1 justify-content-end">
                      <button className="btn btn-outline-primary btn-sm" title="Editar" onClick={() => setModal({ tipo: "editar", item: ev })}>
                        <i className="bi bi-pencil" />
                      </button>
                      <button className="btn btn-outline-danger btn-sm" title="Deletar" onClick={() => setConfirmacao({ item: ev })}>
                        <i className="bi bi-trash3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <InlineModal titulo={modal.tipo === "editar" ? "Editar evento" : "Novo evento"} onFechar={() => setModal(null)}>
          <EventoForm
            inicial={modal.item ?? {}}
            salas={salasList}
            organizadores={organizadoresList}
            onSalvar={handleSalvar}
            onCancelar={() => setModal(null)}
            carregando={saving}
          />
        </InlineModal>
      )}

      <ConfirmacaoModal
        aberto={!!confirmacao}
        titulo="Deletar evento"
        mensagem={`Tem certeza que deseja remover "${confirmacao?.item?.titulo}"?`}
        textoBotao="Deletar"
        onConfirmar={handleDeletar}
        onCancelar={() => setConfirmacao(null)}
        carregando={saving}
      />
    </>
  );
}

/* ── ABA USUÁRIOS ────────────────────────────── */
function AbaUsuarios({ hook }) {
  const { lista, perfisLista, carregando, erro, setErro, sucesso, setSucesso, atualizar, deletar } = hook;
  const [modal, setModal] = useState(null);
  const [confirmacao, setConfirmacao] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSalvar = async (dados) => {
    setSaving(true);
    const ok = await atualizar(modal.item.id, dados);
    setSaving(false);
    if (ok) setModal(null);
  };

  const handleDeletar = async () => {
    setSaving(true);
    await deletar(confirmacao.item.id);
    setSaving(false);
    setConfirmacao(null);
  };

  return (
    <>
      <AlertaFeedback sucesso={sucesso} erro={erro} onFecharSucesso={() => setSucesso("")} onFecharErro={() => setErro("")} />

      <div className="d-flex align-items-center justify-content-between mb-3">
        <h6 className="fw-bold text-body-emphasis mb-0">
          <i className="bi bi-people me-2 text-primary" />Gerenciar usuários
        </h6>
        <span className="badge bg-primary bg-opacity-10 text-primary">{lista.length} usuário(s)</span>
      </div>

      {carregando ? <SpinnerCentral /> : lista.length === 0 ? (
        <TabelaVazia icone="bi-person-x" texto="Nenhum usuário encontrado." />
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle small">
            <thead className="table-light">
              <tr>
                <th>Nome</th><th>E-mail</th><th>Função</th><th>Perfis</th><th className="text-end">Ações</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((u) => (
                <tr key={u.id}>
                  <td className="fw-semibold">{u.nome}</td>
                  <td className="text-body-secondary">{u.email}</td>
                  <td>
                    {u.funcao
                      ? <span className="sge-badge-tipo">{u.funcao}</span>
                      : <span className="text-body-secondary">—</span>}
                  </td>
                  <td>
                    <div className="d-flex flex-wrap gap-1">
                      {(u.perfis ?? []).map((p, i) => (
                        <span key={i} className="badge bg-secondary bg-opacity-10 text-secondary rounded-pill">
                          {p.nome ?? p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="text-end">
                    <div className="d-flex gap-1 justify-content-end">
                      <button className="btn btn-outline-primary btn-sm" title="Editar" onClick={() => setModal({ item: u })}>
                        <i className="bi bi-pencil" />
                      </button>
                      <button className="btn btn-outline-danger btn-sm" title="Deletar" onClick={() => setConfirmacao({ item: u })}>
                        <i className="bi bi-trash3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <InlineModal titulo="Editar usuário" onFechar={() => setModal(null)}>
          <UsuarioForm
            inicial={modal.item}
            perfisLista={perfisLista}
            onSalvar={handleSalvar}
            onCancelar={() => setModal(null)}
            carregando={saving}
          />
        </InlineModal>
      )}

      <ConfirmacaoModal
        aberto={!!confirmacao}
        titulo="Deletar usuário"
        mensagem={`Tem certeza que deseja remover "${confirmacao?.item?.nome}"?`}
        textoBotao="Deletar"
        onConfirmar={handleDeletar}
        onCancelar={() => setConfirmacao(null)}
        carregando={saving}
      />
    </>
  );
}

/* ── ABA INSCRIÇÕES ──────────────────────────── */
function AbaInscricoes({ hook, eventosList }) {
  const {
    lista, carregando, erro, setErro, sucesso, setSucesso,
    filtroEvento, setFiltroEvento, filtroUsuario, setFiltroUsuario,
    confirmar, cancelar, marcarPresenca,
  } = hook;
  const [confirmacao, setConfirmacao] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleAcao = async () => {
    setSaving(true);
    if (confirmacao.tipo === "confirmar") await confirmar(confirmacao.id);
    else await cancelar(confirmacao.id);
    setSaving(false);
    setConfirmacao(null);
  };

  return (
    <>
      <AlertaFeedback sucesso={sucesso} erro={erro} onFecharSucesso={() => setSucesso("")} onFecharErro={() => setErro("")} />

      <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
        <h6 className="fw-bold text-body-emphasis mb-0">
          <i className="bi bi-bookmark-check me-2 text-primary" />Inscrições ({lista.length})
        </h6>
        <div className="d-flex gap-2 flex-wrap">
          <select
            className="form-select form-select-sm sge-input"
            style={{ width: "auto", minWidth: 180 }}
            value={filtroEvento}
            onChange={(e) => setFiltroEvento(e.target.value)}
          >
            <option value="">Todos os eventos</option>
            {eventosList.map((ev) => (
              <option key={ev.id} value={ev.id}>{ev.titulo}</option>
            ))}
          </select>
          <input
            className="form-control form-control-sm sge-input"
            style={{ width: 180 }}
            placeholder="Buscar usuário..."
            value={filtroUsuario}
            onChange={(e) => setFiltroUsuario(e.target.value)}
          />
        </div>
      </div>

      {carregando ? <SpinnerCentral /> : lista.length === 0 ? (
        <TabelaVazia icone="bi-bookmark-x" texto="Nenhuma inscrição encontrada." />
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle small">
            <thead className="table-light">
              <tr>
                <th>Usuário</th><th>Evento</th><th>Status</th>
                <th>Presente</th><th>Data</th><th className="text-end">Ações</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((ins) => (
                <tr key={ins.id}>
                  <td className="fw-semibold">{ins.usuario?.nome ?? ins.usuarioId}</td>
                  <td className="text-body-secondary">{ins.evento?.titulo ?? ins.eventoId}</td>
                  <td>
                    <span className={`sge-badge-status ${statusCor[ins.status] ?? "sge-badge-pendente"}`}>
                      {ins.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`btn btn-sm ${ins.presente ? "btn-success" : "btn-outline-secondary"}`}
                      onClick={() => marcarPresenca(ins.id, !ins.presente)}
                      style={{ minWidth: 34, padding: "2px 8px" }}
                    >
                      <i className={`bi ${ins.presente ? "bi-check2-circle" : "bi-circle"}`} />
                    </button>
                  </td>
                  <td className="text-body-secondary">{fmt(ins.dataCriacao ?? ins.data)}</td>
                  <td className="text-end">
                    <div className="d-flex gap-1 justify-content-end">
                      {ins.status !== "CONFIRMADA" && (
                        <button
                          className="btn btn-outline-success btn-sm"
                          title="Confirmar"
                          onClick={() => setConfirmacao({ tipo: "confirmar", id: ins.id, item: ins })}
                        >
                          <i className="bi bi-check-lg" />
                        </button>
                      )}
                      {ins.status !== "CANCELADA" && (
                        <button
                          className="btn btn-outline-danger btn-sm"
                          title="Cancelar"
                          onClick={() => setConfirmacao({ tipo: "cancelar", id: ins.id, item: ins })}
                        >
                          <i className="bi bi-x-lg" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmacaoModal
        aberto={!!confirmacao}
        titulo={confirmacao?.tipo === "confirmar" ? "Confirmar inscrição" : "Cancelar inscrição"}
        mensagem={
          confirmacao?.tipo === "confirmar"
            ? `Confirmar inscrição de "${confirmacao?.item?.usuario?.nome}"?`
            : `Cancelar inscrição de "${confirmacao?.item?.usuario?.nome}"?`
        }
        textoBotao={confirmacao?.tipo === "confirmar" ? "Confirmar" : "Cancelar inscrição"}
        variante={confirmacao?.tipo === "confirmar" ? "success" : "warning"}
        onConfirmar={handleAcao}
        onCancelar={() => setConfirmacao(null)}
        carregando={saving}
      />
    </>
  );
}

/* ── ABA SALAS ───────────────────────────────── */
function AbaSalas({ hook }) {
  const { lista, carregando, erro, setErro, sucesso, setSucesso, salvar, deletar } = hook;
  const [modal, setModal] = useState(null);
  const [confirmacao, setConfirmacao] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSalvar = async (dados) => {
    setSaving(true);
    const ok = await salvar(dados, modal?.item?.id ?? null);
    setSaving(false);
    if (ok) setModal(null);
  };

  const handleDeletar = async () => {
    setSaving(true);
    await deletar(confirmacao.item.id);
    setSaving(false);
    setConfirmacao(null);
  };

  return (
    <>
      <AlertaFeedback sucesso={sucesso} erro={erro} onFecharSucesso={() => setSucesso("")} onFecharErro={() => setErro("")} />

      <div className="d-flex align-items-center justify-content-between mb-3">
        <h6 className="fw-bold text-body-emphasis mb-0">
          <i className="bi bi-door-open me-2 text-primary" />Gerenciar salas
        </h6>
        <button className="btn sge-btn-login btn-sm text-white" onClick={() => setModal({ tipo: "novo" })}>
          <i className="bi bi-plus-lg me-1" /> Nova sala
        </button>
      </div>

      {carregando ? <SpinnerCentral /> : lista.length === 0 ? (
        <TabelaVazia icone="bi-door-closed" texto="Nenhuma sala cadastrada." />
      ) : (
        <div className="row g-3">
          {lista.map((s) => (
            <div key={s.id} className="col-md-4 col-sm-6">
              <div className="card sge-card border h-100">
                <div className="card-body">
                  <div className="d-flex align-items-start justify-content-between">
                    <div>
                      <div className="fw-bold text-body-emphasis">{s.nome}</div>
                      <div className="text-body-secondary small mt-1">
                        <i className="bi bi-geo-alt me-1" />{s.localizacao || "—"}
                      </div>
                    </div>
                    <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill ms-2">
                      <i className="bi bi-people me-1" />{s.capacidade}
                    </span>
                  </div>
                </div>
                <div className="card-footer bg-transparent border-top d-flex gap-2 justify-content-end py-2">
                  <button className="btn btn-outline-primary btn-sm" onClick={() => setModal({ tipo: "editar", item: s })}>
                    <i className="bi bi-pencil me-1" /> Editar
                  </button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => setConfirmacao({ item: s })}>
                    <i className="bi bi-trash3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <InlineModal titulo={modal.tipo === "editar" ? "Editar sala" : "Nova sala"} onFechar={() => setModal(null)}>
          <SalaForm
            inicial={modal.item ?? {}}
            onSalvar={handleSalvar}
            onCancelar={() => setModal(null)}
            carregando={saving}
          />
        </InlineModal>
      )}

      <ConfirmacaoModal
        aberto={!!confirmacao}
        titulo="Deletar sala"
        mensagem={`Tem certeza que deseja remover a sala "${confirmacao?.item?.nome}"?`}
        textoBotao="Deletar"
        onConfirmar={handleDeletar}
        onCancelar={() => setConfirmacao(null)}
        carregando={saving}
      />
    </>
  );
}

/* ── ABA NOTIFICAÇÕES ────────────────────────── */
function AbaNotificacoes({ hook }) {
  const { lista, usuariosList, carregando, erro, setErro, sucesso, setSucesso, enviar, deletar } = hook;
  const [modal, setModal] = useState(false);
  const [confirmacao, setConfirmacao] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleEnviar = async (dados) => {
    setSaving(true);
    const ok = await enviar(dados);
    setSaving(false);
    if (ok) setModal(false);
  };

  const handleDeletar = async () => {
    setSaving(true);
    await deletar(confirmacao.item.id);
    setSaving(false);
    setConfirmacao(null);
  };

  return (
    <>
      <AlertaFeedback sucesso={sucesso} erro={erro} onFecharSucesso={() => setSucesso("")} onFecharErro={() => setErro("")} />

      <div className="d-flex align-items-center justify-content-between mb-3">
        <h6 className="fw-bold text-body-emphasis mb-0">
          <i className="bi bi-bell me-2 text-primary" />Notificações enviadas
        </h6>
        <button className="btn sge-btn-login btn-sm text-white" onClick={() => setModal(true)}>
          <i className="bi bi-send me-1" /> Nova notificação
        </button>
      </div>

      {carregando ? <SpinnerCentral /> : lista.length === 0 ? (
        <TabelaVazia icone="bi-bell-slash" texto="Nenhuma notificação enviada." />
      ) : (
        <div className="d-flex flex-column gap-2">
          {lista.map((n) => (
            <div key={n.id} className="card border sge-notif-card">
              <div className="card-body py-3 px-4 d-flex align-items-start gap-3">
                <div className="sge-notif-icon flex-shrink-0">
                  <i className="bi bi-bell-fill" />
                </div>
                <div className="flex-grow-1">
                  <p className="mb-1 small fw-semibold text-body-emphasis">{n.mensagem}</p>
                  <div className="d-flex flex-wrap gap-3 text-body-secondary" style={{ fontSize: "0.75rem" }}>
                    <span><i className="bi bi-person me-1" />{n.destinatario === "TODOS" ? "Todos" : n.destinatario?.nome ?? n.destinatario}</span>
                    <span><i className="bi bi-clock me-1" />{fmt(n.dataEnvio)}</span>
                  </div>
                </div>
                <button className="btn btn-outline-danger btn-sm flex-shrink-0" onClick={() => setConfirmacao({ item: n })}>
                  <i className="bi bi-trash3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <InlineModal titulo="Nova notificação" onFechar={() => setModal(false)}>
          <NotificacaoForm
            usuarios={usuariosList}
            onEnviar={handleEnviar}
            onCancelar={() => setModal(false)}
            carregando={saving}
          />
        </InlineModal>
      )}

      <ConfirmacaoModal
        aberto={!!confirmacao}
        titulo="Remover notificação"
        mensagem="Tem certeza que deseja remover esta notificação?"
        textoBotao="Remover"
        onConfirmar={handleDeletar}
        onCancelar={() => setConfirmacao(null)}
        carregando={saving}
      />
    </>
  );
}

/* ── ABA PERFIS ──────────────────────────────── */
function AbaPerfis({ hook }) {
  const { lista, carregando, erro, setErro, sucesso, setSucesso, salvar, deletar } = hook;
  const [novoPerfil, setNovoPerfil] = useState("");
  const [confirmacao, setConfirmacao] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSalvar = async (e) => {
    e.preventDefault();
    if (!novoPerfil.trim()) return;
    setSaving(true);
    const ok = await salvar({ nome: novoPerfil.trim().toUpperCase() });
    setSaving(false);
    if (ok) setNovoPerfil("");
  };

  const handleDeletar = async () => {
    setSaving(true);
    await deletar(confirmacao.item.id);
    setSaving(false);
    setConfirmacao(null);
  };

  return (
    <>
      <AlertaFeedback sucesso={sucesso} erro={erro} onFecharSucesso={() => setSucesso("")} onFecharErro={() => setErro("")} />

      <div className="d-flex align-items-center justify-content-between mb-3">
        <h6 className="fw-bold text-body-emphasis mb-0">
          <i className="bi bi-shield-check me-2 text-primary" />Perfis e permissões
        </h6>
      </div>

      <form onSubmit={handleSalvar} className="d-flex gap-2 mb-4" style={{ maxWidth: 360 }}>
        <input
          className="form-control form-control-sm sge-input"
          placeholder="Nome do novo perfil (ex: MODERADOR)"
          value={novoPerfil}
          onChange={(e) => setNovoPerfil(e.target.value)}
        />
        <button type="submit" className="btn sge-btn-login btn-sm text-white flex-shrink-0" disabled={saving || !novoPerfil.trim()}>
          {saving ? <span className="spinner-border spinner-border-sm" /> : <i className="bi bi-plus-lg" />}
        </button>
      </form>

      {carregando ? <SpinnerCentral /> : lista.length === 0 ? (
        <TabelaVazia icone="bi-shield-x" texto="Nenhum perfil cadastrado." />
      ) : (
        <div className="d-flex flex-wrap gap-2">
          {lista.map((p) => (
            <div key={p.id} className="d-flex align-items-center gap-2 px-3 py-2 border rounded-pill bg-white" style={{ fontSize: "0.85rem" }}>
              <i className="bi bi-shield-fill-check text-primary" />
              <span className="fw-semibold">{p.nome}</span>
              <button
                className="btn btn-link btn-sm p-0 text-danger ms-1"
                style={{ lineHeight: 1 }}
                onClick={() => setConfirmacao({ item: p })}
              >
                <i className="bi bi-x-lg" style={{ fontSize: "0.7rem" }} />
              </button>
            </div>
          ))}
        </div>
      )}

      <ConfirmacaoModal
        aberto={!!confirmacao}
        titulo="Deletar perfil"
        mensagem={`Tem certeza que deseja remover o perfil "${confirmacao?.item?.nome}"?`}
        textoBotao="Deletar"
        onConfirmar={handleDeletar}
        onCancelar={() => setConfirmacao(null)}
        carregando={saving}
      />
    </>
  );
}

/* ── PÁGINA PRINCIPAL ────────────────────────── */
export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState("eventos");

  const hookEventos      = useEventosAdmin();
  const hookUsuarios     = useUsuarios();
  const hookInscricoes   = useInscricoesAdmin();
  const hookSalas        = useSalas();
  const hookNotificacoes = useNotificacoesAdmin();
  const hookPerfis       = usePerfis();

  const handleSair = () => { logout(); navigate("/login"); };

  return (
    <div className="sge-dash-bg min-vh-100">
      <Navbar onSair={handleSair} />

      <div className="container py-4">
        <div className="d-flex align-items-center gap-2 mb-4">
          <div
            className="d-flex align-items-center justify-content-center rounded-2 bg-danger bg-opacity-10"
            style={{ width: 36, height: 36 }}
          >
            <i className="bi bi-person-gear text-danger" />
          </div>
          <div>
            <h5 className="fw-bold text-body-emphasis mb-0" style={{ fontSize: "1rem" }}>
              Painel Administrativo
            </h5>
            <p className="text-body-secondary mb-0" style={{ fontSize: "0.78rem" }}>
              Olá, <strong>{user?.nome ?? "Admin"}</strong> · SGE
            </p>
          </div>
        </div>

        <div className="d-flex gap-2 mb-4 flex-wrap">
          {ABAS.map((aba) => (
            <button
              key={aba.id}
              className={`btn sge-tab-btn ${abaAtiva === aba.id ? "sge-tab-ativo" : ""}`}
              onClick={() => setAbaAtiva(aba.id)}
            >
              <i className={`bi ${aba.icone} me-2`} />
              {aba.label}
            </button>
          ))}
        </div>

        <div className="card border-0 shadow-sm" style={{ borderRadius: "0.75rem" }}>
          <div className="card-body p-4">
            {abaAtiva === "eventos"      && <AbaEventos      hook={hookEventos} />}
            {abaAtiva === "usuarios"     && <AbaUsuarios     hook={hookUsuarios} />}
            {abaAtiva === "inscricoes"   && <AbaInscricoes   hook={hookInscricoes} eventosList={hookEventos.lista} />}
            {abaAtiva === "salas"        && <AbaSalas        hook={hookSalas} />}
            {abaAtiva === "notificacoes" && <AbaNotificacoes hook={hookNotificacoes} />}
            {abaAtiva === "perfis"       && <AbaPerfis       hook={hookPerfis} />}
          </div>
        </div>
      </div>
    </div>
  );
}