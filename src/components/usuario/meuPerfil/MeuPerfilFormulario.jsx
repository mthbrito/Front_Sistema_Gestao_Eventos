import { useState } from "react";
import { MeuPerfilSchema } from "../../../utils/usuario/meuPerfilSchema";
import EmailInput from "../../shared/EmailInput";
import NomeInput from "../../shared/NomeInput";
import SenhaInput from "../../shared/SenhaInput";
import SenhaConfirmacaoInput from "../../shared/SenhaConfirmacaoInput";
import { toast } from "sonner";

const criarEstadoInicial = (usuario) => ({
    nome: usuario?.nome ?? "",
    email: usuario?.email ?? "",
    senha: "",
    confirmarSenha: "",
});

export default function MeuPerfilFormulario({ usuario, onSalvar, salvando }) {
    const [formData, setFormData] = useState(() => criarEstadoInicial(usuario));
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        const resultado = MeuPerfilSchema.safeParse(formData);

        if (!resultado.success) {
            resultado.error.issues.forEach((issue) => toast.error(issue.message));
            return;
        }

        onSalvar({
            nome: formData.nome,
            email: formData.email,
            ...(formData.senha ? { senha: formData.senha } : {}),
            perfis: usuario.perfis.map((p) => p.nome),
        });
    };

    return (
        <div className="card sge-card border-0 shadow-sm">
            <div className="card-body p-4">
                <form onSubmit={handleSubmit} className="d-flex flex-column gap-3" noValidate>
                    <NomeInput
                        value={formData.nome}
                        onChange={(val) => setFormData((prev) => ({ ...prev, nome: val }))}
                    />
                    <EmailInput
                        value={formData.email}
                        onChange={(val) => setFormData((prev) => ({ ...prev, email: val }))}
                    />
                    <SenhaInput
                        label="Nova senha"
                        value={formData.senha}
                        onChange={(val) => setFormData((prev) => ({ ...prev, senha: val }))}
                        mostrarSenha={mostrarSenha}
                        toggleSenha={() => setMostrarSenha((v) => !v)}
                        autoComplete="new-password"
                        disabled={salvando}
                    />
                    <SenhaConfirmacaoInput
                        value={formData.confirmarSenha}
                        onChange={(val) => setFormData((prev) => ({ ...prev, confirmarSenha: val }))}
                        mostrarSenha={mostrarConfirmacao}
                        toggleSenha={() => setMostrarConfirmacao((v) => !v)}
                        disabled={salvando}
                    />
                    <button
                        type="submit"
                        disabled={salvando}
                        className="btn btn-primary sge-btn-login w-100"
                    >
                        {salvando ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                                Salvando...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-check-lg me-1" aria-hidden="true" />
                                Salvar alterações
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}