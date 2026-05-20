export default function EmailInput({ value, onChange }) {
  return (
    <div className="mb-3">
      <label className="form-label">E-mail</label>

      <input
        type="email"
        className="form-control"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
