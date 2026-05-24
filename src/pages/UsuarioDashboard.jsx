import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import EventosAba from "../components/usuario/eventos/EventosAba";
import InscricoesAba from "../components/usuario/inscricoes/InscricoesAba";
import NotificacoesAba from "../components/usuario/notificacoes/NotificacoesAba";
import { useAuth } from "../hooks/auth/useAuth";
import { useDashboardUsuario } from "../hooks/usuario/useDashboardUsuario";
import "../styles/dashboard.css";

export default function UsuarioDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState("eventos");

  const {
    eventos,
    inscricoes,
    notificacoes,
    recarregarTudo,
    totalNotificacoes,
  } = useDashboardUsuario(user.id);

  const ABAS = [
    { id: "eventos", icone: "bi-calendar-event", label: "Eventos" },
    {
      id: "inscricoes",
      icone: "bi-bookmark-check",
      label: "Minhas Inscrições",
    },
    {
      id: "notificacoes",
      icone: "bi-bell",
      label: "Notificações",
      badge: totalNotificacoes,
    },
  ];

  return (
    <div className="sge-dash-bg min-vh-100">
      <Navbar
        onSair={() => {
          logout();
          navigate("/login");
        }}
      />

      <div className="container py-4">
        <div className="d-flex gap-2 mb-4 flex-wrap">
          {ABAS.map((aba) => (
            <button
              key={aba.id}
              className={`btn sge-tab-btn ${abaAtiva === aba.id ? "sge-tab-ativo" : ""}`}
              onClick={() => setAbaAtiva(aba.id)}
            >
              <i className={`bi ${aba.icone} me-2`} />
              {aba.label}
              {aba.badge > 0 && (
                <span
                  className="badge bg-danger ms-2 rounded-pill"
                  style={{ fontSize: "0.65rem" }}
                >
                  {aba.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {abaAtiva === "eventos" && (
          <EventosAba
            dados={eventos}
            onInscrever={inscricoes.inscrever}
            onAtualizar={recarregarTudo}
          />
        )}

        {abaAtiva === "inscricoes" && (
          <InscricoesAba
            dados={inscricoes}
            onAtualizar={recarregarTudo}
            onVerEventos={() => setAbaAtiva("eventos")}
          />
        )}

        {abaAtiva === "notificacoes" && (
          <NotificacoesAba dados={notificacoes} onAtualizar={recarregarTudo} />
        )}
      </div>
    </div>
  );
}
