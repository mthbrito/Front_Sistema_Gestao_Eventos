import { useState } from "react";

const FUNCOES = ["ALUNO", "PROFESSOR", "SERVIDOR"];

export default function PerfilAba({ user, onSalvar, salvando }) {
  const [form, setForm] = useState({
    nome:  user?.nome  ?? "",
    email: user?.email ?? "",
    senha: "",
    confirmarSenha: "",
    funcao: user?.funcao ?? "",
  });
  const [mostrarSenha,      setMostrarSenha]      = useState(false);
  const [mostrarConfirmar,  setMostrarConfirmar]  = useState(false);
  const [erroLocal, setErroLocal] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErroLocal("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nome.trim()) { setErroLocal("O nome não pode ficar vazio."); return; }
    if (form.senha && form.senha.length < 4) { setErroLocal("A senha deve ter pelo menos 4 caracteres."); return; }
    if (form.senha !== form.confirmarSenha) { setErroLocal("As senhas não coincidem."); return; }

    const payload = { nome: form.nome.trim(), email: form.email.trim() };
    if (form.funcao)  payload.funcao = form.funcao;
    if (form.senha)   payload.senha  = form.senha;

    await onSalvar(payload);
    setForm((prev) => ({ ...prev, senha: "", confirmarSenha: "" }));
  };

  return (
    <>
      <div className="d-flex align-items-center mb-3">
        <h5 className="fw-bold text-body-emphasis mb-0">
          <i className="bi bi-person-circle me-2 text-primary" />
          Meu Perfil
        </h5>
      </div>

      <div className="row justify-content-start">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card sge-card border-0 shadow-sm">
            <div className="card-body p-4">

              {erroLocal && (
                <div className="alert alert-danger py-2 small alert-dismissible fade show" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2" />
                  {erroLocal}
                  <button type="button" className="btn-close" onClick={() => setErroLocal("")} />
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>

                {/* Nome */}
                <div className="mb-3">
                  <label htmlFor="perfil-nome" className="form-label fw-semibold small text-body-emphasis">
                    Nome completo
                  </label>
                  <div className="input-group">
                    <span className="input-group-text sge-input-addon">
                      <i className="bi bi-person" />
                    </span>
                    <input
                      type="text"
                      className="form-control sge-input"
                      id="perfil-nome"
                      name="nome"
                      value={form.nome}
                      onChange={handleChange}
                      disabled={salvando}
                    />
                  </div>
                </div>

                {/* Email (somente leitura) */}
                <div className="mb-3">
                  <label htmlFor="perfil-email" className="form-label fw-semibold small text-body-emphasis">
                    E-mail
                  </label>
                  <div className="input-group">
                    <span className="input-group-text sge-input-addon">
                      <i className="bi bi-envelope" />
                    </span>
                    <input
                      type="email"
                      className="form-control sge-input"
                      id="perfil-email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      disabled={salvando}
                    />
                  </div>
                </div>

                {/* Função */}
                <div className="mb-3">
                  <label htmlFor="perfil-funcao" className="form-label fw-semibold small text-body-emphasis">
                    Função
                  </label>
                  <div className="input-group">
                    <span className="input-group-text sge-input-addon">
                      <i className="bi bi-briefcase" />
                    </span>
                    <select
                      className="form-select sge-input"
                      id="perfil-funcao"
                      name="funcao"
                      value={form.funcao}
                      onChange={handleChange}
                      disabled={salvando}
                    >
                      <option value="">Selecione...</option>
                      {FUNCOES.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <hr className="sge-divider my-3" />
                <p className="small text-body-secondary mb-3">
                  <i className="bi bi-info-circle me-1" />
                  Preencha apenas se quiser alterar a senha.
                </p>

                {/* Nova senha */}
                <div className="mb-3">
                  <label htmlFor="perfil-senha" className="form-label fw-semibold small text-body-emphasis">
                    Nova senha
                  </label>
                  <div className="input-group">
                    <span className="input-group-text sge-input-addon">
                      <i className="bi bi-lock" />
                    </span>
                    <input
                      type={mostrarSenha ? "text" : "password"}
                      className="form-control sge-input"
                      id="perfil-senha"
                      name="senha"
                      placeholder="••••••••"
                      value={form.senha}
                      onChange={handleChange}
                      autoComplete="new-password"
                      disabled={salvando}
                    />
                    <button
                      type="button"
                      className="btn sge-toggle-pw input-group-text"
                      onClick={() => setMostrarSenha(!mostrarSenha)}
                      tabIndex={-1}
                    >
                      <i className={`bi ${mostrarSenha ? "bi-eye-slash" : "bi-eye"}`} />
                    </button>
                  </div>
                </div>

                {/* Confirmar senha */}
                <div className="mb-4">
                  <label htmlFor="perfil-confirmar" className="form-label fw-semibold small text-body-emphasis">
                    Confirmar nova senha
                  </label>
                  <div className="input-group">
                    <span className="input-group-text sge-input-addon">
                      <i className="bi bi-lock-fill" />
                    </span>
                    <input
                      type={mostrarConfirmar ? "text" : "password"}
                      className="form-control sge-input"
                      id="perfil-confirmar"
                      name="confirmarSenha"
                      placeholder="••••••••"
                      value={form.confirmarSenha}
                      onChange={handleChange}
                      autoComplete="new-password"
                      disabled={salvando}
                    />
                    <button
                      type="button"
                      className="btn sge-toggle-pw input-group-text"
                      onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                      tabIndex={-1}
                    >
                      <i className={`bi ${mostrarConfirmar ? "bi-eye-slash" : "bi-eye"}`} />
                    </button>
                  </div>
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary sge-btn-login"
                    disabled={salvando}
                  >
                    {salvando ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-lg me-2" />
                        Salvar alterações
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}