import { useState } from 'react';
import { usuarios } from '../services/apiService';

const PERFIL_USER_ID = 2; // id do perfil USER no banco

export default function Cadastro({ onVoltar }) {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    funcao: '',
  });
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState('');
  const [sucesso, setSucesso]             = useState(false);
  const [showSenha, setShowSenha]         = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const validar = () => {
    if (!form.nome || !form.email || !form.senha || !form.funcao)
      return 'Preencha todos os campos.';
    if (form.nome.length < 3)
      return 'O nome deve ter pelo menos 3 caracteres.';
    if (form.senha !== form.confirmarSenha)
      return 'As senhas não coincidem.';
    if (form.senha.length < 4)
      return 'A senha deve ter pelo menos 4 caracteres.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const erro = validar();
    if (erro) { setError(erro); return; }

    setLoading(true);
    setError('');
    try {
      await usuarios.salvarUsuario({
        nome:      form.nome,
        email:     form.email,
        senha:     form.senha,
        funcao:    form.funcao,
        perfisIds: [PERFIL_USER_ID],
      });
      setSucesso(true);
      setTimeout(() => onVoltar && onVoltar(), 2000);
    } catch (err) {
      setError(err.message || 'Erro ao realizar cadastro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sge-login-bg d-flex align-items-center justify-content-center min-vh-100">
      <div className="sge-bg-shape sge-bg-shape-1" />
      <div className="sge-bg-shape sge-bg-shape-2" />
      <div className="sge-bg-shape sge-bg-shape-3" />

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">

            <div className="card sge-login-card shadow-lg border-0">
              <div className="card-body p-4 p-md-5">

                <div className="text-center mb-4">
                  <div className="sge-logo-circle mx-auto mb-3">
                    <i className="bi bi-person-plus fs-4" />
                  </div>
                  <h4 className="fw-bold text-body-emphasis mb-1">Criar conta</h4>
                  <p className="text-body-secondary small">Sistema de Gestão de Eventos</p>
                </div>

                <hr className="sge-divider mb-4" />

                {sucesso && (
                  <div className="alert alert-success py-2 small text-center" role="alert">
                    <i className="bi bi-check-circle-fill me-2" />
                    Cadastro realizado! Redirecionando para o login...
                  </div>
                )}

                {error && (
                  <div className="alert alert-danger alert-dismissible fade show py-2 small" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2" />
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError('')} aria-label="Fechar" />
                  </div>
                )}

                {!sucesso && (
                  <form onSubmit={handleSubmit} noValidate>

                    <div className="mb-3">
                      <label htmlFor="nome" className="form-label fw-semibold small text-body-emphasis">
                        Nome completo
                      </label>
                      <div className="input-group">
                        <span className="input-group-text sge-input-addon">
                          <i className="bi bi-person" />
                        </span>
                        <input
                          type="text"
                          className="form-control sge-input"
                          id="nome" name="nome"
                          placeholder="Seu nome"
                          value={form.nome}
                          onChange={handleChange}
                          required autoFocus
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label fw-semibold small text-body-emphasis">
                        E-mail
                      </label>
                      <div className="input-group">
                        <span className="input-group-text sge-input-addon">
                          <i className="bi bi-envelope" />
                        </span>
                        <input
                          type="email"
                          className="form-control sge-input"
                          id="email" name="email"
                          placeholder="seu@email.com"
                          value={form.email}
                          onChange={handleChange}
                          required autoComplete="email"
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="funcao" className="form-label fw-semibold small text-body-emphasis">
                        Função
                      </label>
                      <div className="input-group">
                        <span className="input-group-text sge-input-addon">
                          <i className="bi bi-briefcase" />
                        </span>
                        <select
                          className="form-select sge-input"
                          id="funcao" name="funcao"
                          value={form.funcao}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Selecione...</option>
                          <option value="ALUNO">Aluno</option>
                          <option value="PROFESSOR">Professor</option>
                          <option value="SERVIDOR">Servidor</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="senha" className="form-label fw-semibold small text-body-emphasis">
                        Senha
                      </label>
                      <div className="input-group">
                        <span className="input-group-text sge-input-addon">
                          <i className="bi bi-lock" />
                        </span>
                        <input
                          type={showSenha ? 'text' : 'password'}
                          className="form-control sge-input"
                          id="senha" name="senha"
                          placeholder="••••••••"
                          value={form.senha}
                          onChange={handleChange}
                          required autoComplete="new-password"
                        />
                        <button type="button" className="btn sge-toggle-pw input-group-text"
                          onClick={() => setShowSenha(!showSenha)} tabIndex={-1}>
                          <i className={`bi ${showSenha ? 'bi-eye-slash' : 'bi-eye'}`} />
                        </button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="confirmarSenha" className="form-label fw-semibold small text-body-emphasis">
                        Confirmar senha
                      </label>
                      <div className="input-group">
                        <span className="input-group-text sge-input-addon">
                          <i className="bi bi-lock-fill" />
                        </span>
                        <input
                          type={showConfirmar ? 'text' : 'password'}
                          className="form-control sge-input"
                          id="confirmarSenha" name="confirmarSenha"
                          placeholder="••••••••"
                          value={form.confirmarSenha}
                          onChange={handleChange}
                          required autoComplete="new-password"
                        />
                        <button type="button" className="btn sge-toggle-pw input-group-text"
                          onClick={() => setShowConfirmar(!showConfirmar)} tabIndex={-1}>
                          <i className={`bi ${showConfirmar ? 'bi-eye-slash' : 'bi-eye'}`} />
                        </button>
                      </div>
                    </div>

                    <div className="d-grid">
                      <button type="submit" className="btn btn-primary sge-btn-login" disabled={loading}>
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                            Cadastrando...
                          </>
                        ) : (
                          <>Criar conta <i className="bi bi-arrow-right ms-1" /></>
                        )}
                      </button>
                    </div>
                  </form>
                )}

                <p className="text-center text-body-secondary small mt-4 mb-0">
                  Já tem uma conta?{' '}
                  <button className="btn btn-link sge-link fw-semibold text-decoration-none p-0 small"
                    onClick={onVoltar}>
                    Entrar
                  </button>
                </p>
              </div>
            </div>

            <p className="text-center text-body-secondary small mt-3 opacity-75">
              © {new Date().getFullYear()} SGE · IFPB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}