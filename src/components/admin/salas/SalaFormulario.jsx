import { useState } from "react";
import { toast } from "sonner";
import { salaSchema } from "../../../utils/schemas";

const criarEstadoInicial = (sala = {}) => ({
  nome: sala.nome ?? "",
  localizacao: sala.localizacao ?? "",
  capacidade: sala.capacidade != null ? String(sala.capacidade) : "",
});

export default function SalaFormulario({
  valoresIniciais = {},
  onSalvar,
  onCancelar,
  salvando = false,
}) {
  const modoEdicao = Boolean(valoresIniciais.id);

  const [dados, setDados] = useState(() => criarEstadoInicial(valoresIniciais));

  const atualizarCampo = (campo) => (evento) => {
    setDados((atual) => ({ ...atual, [campo]: evento.target.value }));
  };

  const handleSubmit = (evento) => {
    evento.preventDefault();

    const payload = {
      nome: dados.nome.trim(),
      localizacao: dados.localizacao.trim(),
      capacidade: dados.capacidade ? Number(dados.capacidade) : null,
    };

    const resultado = salaSchema.safeParse(payload);

    if (!resultado.success) {
      resultado.error.issues.forEach((issue) => toast.error(issue.message));
      return;
    }

    onSalvar(resultado.data);
  };

  return (
    <form onSubmit={handleSubmit} className="row g-3" noValidate>
      <div className="col-12">
        <label htmlFor="sala-nome" className="form-label fw-semibold small">
          Nome *
        </label>
        <input
          id="sala-nome"
          className="form-control sge-input"
          value={dados.nome}
          onChange={atualizarCampo("nome")}
          disabled={salvando}
          placeholder="Ex: Auditório Principal"
        />
      </div>

      <div className="col-md-8">
        <label htmlFor="sala-localizacao" className="form-label fw-semibold small">
          Localização
        </label>
        <input
          id="sala-localizacao"
          className="form-control sge-input"
          value={dados.localizacao}
          onChange={atualizarCampo("localizacao")}
          disabled={salvando}
          placeholder="Ex: Bloco A, 2º andar"
        />
      </div>

      <div className="col-md-4">
        <label htmlFor="sala-capacidade" className="form-label fw-semibold small">
          Capacidade *
        </label>
        <input
          id="sala-capacidade"
          type="number"
          min={1}
          className="form-control sge-input"
          value={dados.capacidade}
          onChange={atualizarCampo("capacidade")}
          disabled={salvando}
          placeholder="100"
        />
      </div>

      <div className="col-12 d-flex gap-2 justify-content-end pt-2">
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={onCancelar}
          disabled={salvando}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn sge-btn-login btn-sm text-white"
          disabled={salvando}
        >
          {salvando ? (
            <span
              className="spinner-border spinner-border-sm me-1"
              role="status"
              aria-hidden="true"
            />
          ) : (
            <i className="bi bi-check-lg me-1" aria-hidden="true" />
          )}
          {modoEdicao ? "Salvar alterações" : "Criar sala"}
        </button>
      </div>
    </form>
  );
}