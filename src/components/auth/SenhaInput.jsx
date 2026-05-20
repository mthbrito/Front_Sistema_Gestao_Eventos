export default function SenhaInput({
  value,
  onChange,
  mostrarSenha,
  toggleSenha,
  onEsqueceuSenha,
}) {
  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between">
        <label className="form-label">Senha</label>

        <button
          type="button"
          className="btn btn-link p-0"
          onClick={onEsqueceuSenha}
        >
          Esqueceu a senha?
        </button>
      </div>

      <div className="input-group">
        <input
          type={mostrarSenha ? "text" : "password"}
          className="form-control"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />

        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={toggleSenha}
        >
          {mostrarSenha ? "Ocultar" : "Mostrar"}
        </button>
      </div>
    </div>
  );
}
