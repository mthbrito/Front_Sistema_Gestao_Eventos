export default function AuthAlerta({ message, onClose }) {
  return (
    <div className="alert alert-danger">
      {message}
      <button type="button" className="btn-close" onClick={onClose} />
    </div>
  );
}
