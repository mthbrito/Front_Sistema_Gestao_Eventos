import SpinnerCentral from "../../SpinnerCentral";
import InscricaoCard from "./InscricaoCard";

export default function InscricoesAba({ dados, onAtualizar, onVerEventos }) {
  const { lista, carregando } = dados;

  if (carregando) return <SpinnerCentral />;

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 className="fw-bold text-body-emphasis mb-0">
          <i className="bi bi-bookmark-check me-2 text-primary" />
          Minhas inscrições
        </h5>
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={onAtualizar}
        >
          <i className="bi bi-arrow-clockwise me-1" /> Atualizar
        </button>
      </div>

      {lista.length === 0 ? (
        <div className="text-center py-5 opacity-75">
          <i
            className="bi bi-bookmark-x text-body-secondary"
            style={{ fontSize: "2.5rem" }}
          />
          <p className="text-body-secondary mt-3 mb-1">
            Você ainda não tem inscrições.
          </p>
          <button
            className="btn btn-sm btn-primary mt-2"
            onClick={onVerEventos}
          >
            Ver eventos disponíveis
          </button>
        </div>
      ) : (
        <div className="row g-3">
          {lista.map((inscricao) => (
            <InscricaoCard
              key={inscricao.id}
              inscricao={inscricao}
              onDesinscrever={dados.desinscrever}
            />
          ))}
        </div>
      )}
    </>
  );
}
