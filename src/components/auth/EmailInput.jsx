export default function EmailInput({ value, onChange }) {
  return (
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
          id="email"
          placeholder="seu@email.com"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="email"
          autoFocus
        />
      </div>
    </div>
  );
}