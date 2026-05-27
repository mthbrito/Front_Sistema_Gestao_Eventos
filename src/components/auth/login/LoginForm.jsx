import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "../../../hooks/auth/useLogin";
import { loginSchema } from "../../../utils/loginSchema";
import { useState } from "react";
import EmailInput from "../../shared/EmailInput";
import SenhaInput from "../../shared/SenhaInput";
import LoginHeader from "./LoginHeader";
import LoginFooter from "./LoginFooter";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const navigate = useNavigate();
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const { mutate, isPending } = useLogin();

  const { handleSubmit, setValue, watch } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data) => mutate(data);

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">
          <div className="card sge-login-card shadow-lg border-0">
            <div className="card-body p-4 p-md-5">
              <LoginHeader />

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <EmailInput
                  value={watch("email") ?? ""}
                  onChange={(v) => setValue("email", v)}
                />
                <SenhaInput
                  value={watch("senha") ?? ""}
                  onChange={(v) => setValue("senha", v)}
                  mostrarSenha={mostrarSenha}
                  toggleSenha={() => setMostrarSenha(!mostrarSenha)}
                  onEsqueceuSenha={() => navigate("/recuperar-senha")}
                />

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary sge-btn-login"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                        Entrando...
                      </>
                    ) : (
                      <>Entrar <i className="bi bi-arrow-right ms-1" /></>
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