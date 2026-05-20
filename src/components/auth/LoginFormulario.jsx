import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginFormulario } from "../../hooks/auth/useLoginFormulario";
import LoginHeader from "./LoginHeader";
import EmailInput from "./EmailInput";
import SenhaInput from "./SenhaInput";
import AuthAlerta from "./AuthAlerta";
import LoginFooter from "./LoginFooter";

export default function LoginForm() {
  const navigate = useNavigate();

  const {
    email,
    senha,
    erro,
    carregando,
    setEmail,
    setSenha,
    setErro,
    handleSubmit,
  } = useLoginFormulario();

  const [mostrarSenha, setMostrarSenha] = useState(false);

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-5">
          <div className="card sge-login-card shadow-lg border-0">
            <div className="card-body p-4 p-md-5">
              <LoginHeader />

              {erro && (
                <AuthAlerta message={erro} onClose={() => setErro("")} />
              )}

              <form onSubmit={handleSubmit}>
                <EmailInput value={email} onChange={setEmail} />

                <SenhaInput
                  value={senha}
                  onChange={setSenha}
                  mostrarSenha={mostrarSenha}
                  toggleSenha={() => setMostrarSenha(!mostrarSenha)}
                  onEsqueceuSenha={() => navigate("/recuperarSenha")}
                />

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={carregando}
                >
                  {carregando ? "Entrando..." : "Entrar"}
                </button>
              </form>

              <LoginFooter />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
