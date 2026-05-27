import CadastroForm from "../components/auth/cadastro/CadastroForm";
import "../styles/Cadastro.css";

export default function CadastroPage() {
  return (
    <div className="sge-login-bg d-flex align-items-center justify-content-center min-vh-100">
      <CadastroForm />
    </div>
  );
}