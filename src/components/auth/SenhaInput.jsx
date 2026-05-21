export default function SenhaInput({
  value,
  onChange,
  mostrarSenha,
  toggleSenha,
  onEsqueceuSenha,
}) {
  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <label htmlFor="senha" className="form-label fw-semibold small text-body-emphasis mb-0">
          Senha
        </label>
        <button
          type="button"
          className="btn btn-link sge-link small text-decoration-none p-0"
          onClick={onEsqueceuSenha}
        >
          Esqueceu a senha?
        </button>
      </div>

      <div className="input-group">
        <span className="input-group-text sge-input-addon">
          <i className="bi bi-lock" />
        </span>
        <input
          type={mostrarSenha ? "text" : "password"}
          className="form-control sge-input"
          id="senha"
          placeholder="••••••••"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="current-password"
        />
        <button
          type="button"
          className="btn sge-toggle-pw input-group-text"
          onClick={toggleSenha}
          tabIndex={-1}
          aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
        >
          <i className={`bi ${mostrarSenha ? "bi-eye-slash" : "bi-eye"}`} />
        </button>
      </div>
    </div>
  );
}