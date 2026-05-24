import { useNavigate } from "react-router-dom";

export default function LoginFooter() {
  const navigate = useNavigate();

  return (
    <>
      <p className="text-center text-body-secondary small mt-4 mb-0">
        Não tem uma conta?{" "}
        <button
          type="button"
          className="btn btn-link sge-link fw-semibold text-decoration-none p-0 align-baseline"
          onClick={() => navigate("/cadastro")}
        >
          Cadastre-se
        </button>
      </p>
      <p className="text-center text-body-secondary small mt-3 opacity-75">
        © {new Date().getFullYear()} SGE · IFPB
      </p>
    </>
  );
}
