import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginFormulario } from "../../../hooks/auth/useLoginFormulario";
import EmailInput from "../../EmailInput";
import SenhaInput from "../../SenhaInput";
import LoginFooter from "./LoginFooter";
import LoginHeader from "./LoginHeader";

export default function LoginFormulario() {
  const navigate = useNavigate();

  const { email, senha, carregando, setEmail, setSenha, handleSubmit } =
    useLoginFormulario();

  const [mostrarSenha, setMostrarSenha] = useState(false);

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">
          <div className="sge-bg-shape sge-bg-shape-1" />
          <div className="sge-bg-shape sge-bg-shape-2" />
          <div className="sge-bg-shape sge-bg-shape-3" />

          <div className="card sge-login-card shadow-lg border-0">
            <div className="card-body p-4 p-md-5">
              <LoginHeader />

              <form onSubmit={handleSubmit} noValidate>
                <EmailInput value={email} onChange={setEmail} />

                <SenhaInput
                  value={senha}
                  onChange={setSenha}
                  mostrarSenha={mostrarSenha}
                  toggleSenha={() => setMostrarSenha(!mostrarSenha)}
                  onEsqueceuSenha={() => navigate("/recuperar-senha")}
                />

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary sge-btn-login"
                    disabled={carregando}
                  >
                    {carregando ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        />
                        Entrando...
                      </>
                    ) : (
                      <>
                        Entrar <i className="bi bi-arrow-right ms-1" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              <LoginFooter />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
