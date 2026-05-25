import { useState } from "react";
import { useConfirmacao } from "../../../hooks/ui/useConfirmacao";
import { useModalEdicao } from "../../../hooks/ui/useModalEdicao";
import { formatarData, formatarDestinatario } from "../../../utils/formatacoes";
import SpinnerCentral from "../../SpinnerCentral";
import TabelaVazia from "../../TabelaVazia";
import BaseModal from "../BaseModal";
import ConfirmacaoModal from "../ConfirmacaoModal";
import NotificacaoFormulario from "./NotificacaoFormulario";

export default function NotificacoesTabela({ dados }) {
  const { lista, usuarios, carregando, salvando, enviar, deletar } = dados;
  const [filtro, setFiltro] = useState("");

  const modal       = useModalEdicao();
  const confirmacao = useConfirmacao();

  const listaFiltrada = lista.filter((n) => {
    if (!filtro.trim()) return true;
    const termo = filtro.toLowerCase();
    const mensagem     = (n.mensagem ?? "").toLowerCase();
    const destinatario = formatarDestinatario(n).toLowerCase();
    return mensagem.includes(termo) || destinatario.includes(termo);
  });

  const handleEnviar = async (dadosFormulario) => {
    await enviar(dadosFormulario);
    modal.fechar();
  };

  const handleConfirmarExclusao = async () => {
    await deletar(confirmacao.id);
    confirmacao.cancelar();
  };

  return (
    <>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
        <h6 className="fw-bold text-body-emphasis mb-0">
          <i className="bi bi-bell me-2 text-primary" aria-hidden="true" />
          Notificações enviadas
        </h6>
        <button
          type="button"
          className="btn sge-btn-login btn-sm text-white"
          onClick={modal.abrirNovo}
          disabled={carregando || salvando}
        >
          <i className="bi bi-send me-1" aria-hidden="true" />
          Nova notificação
        </button>
      </div>

      {/* Filtro */}
      {lista.length > 0 && (
        <div className="mb-3">
          <div className="input-group input-group-sm">
            <span className="input-group-text sge-input-addon">
              <i className="bi bi-search" aria-hidden="true" />
            </span>
            <input
              type="text"
              className="form-control sge-input"
              placeholder="Filtrar por mensagem ou destinatário..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
            {filtro && (
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setFiltro("")}
                title="Limpar filtro"
              >
                <i className="bi bi-x-lg" />
              </button>
            )}
          </div>
          {filtro && (
            <p className="text-body-secondary small mt-1 mb-0">
              {listaFiltrada.length} de {lista.length} notificação(ões) exibida(s)
            </p>
          )}
        </div>
      )}

      {/* Lista */}
      {carregando ? (
        <SpinnerCentral />
      ) : listaFiltrada.length === 0 ? (
        <TabelaVazia
          icone="bi-bell-slash"
          texto={filtro ? "Nenhuma notificação encontrada para esse filtro." : "Nenhuma notificação enviada."}
        />
      ) : (
        <div className="d-flex flex-column gap-2">
          {listaFiltrada.map((notificacao) => (
            <div key={notificacao.id} className="card border sge-notif-card">
              <div className="card-body py-3 px-4 d-flex align-items-start gap-3">
                <div className="sge-notif-icon flex-shrink-0">
                  <i className="bi bi-bell-fill" aria-hidden="true" />
                </div>
                <div className="flex-grow-1">
                  <p className="mb-1 small fw-semibold text-body-emphasis">
                    {notificacao.mensagem}
                  </p>
                  <div
                    className="d-flex flex-wrap gap-3 text-body-secondary"
                    style={{ fontSize: "0.75rem" }}
                  >
                    <span>
                      <i className="bi bi-person me-1" aria-hidden="true" />
                      {formatarDestinatario(notificacao)}
                    </span>
                    <span>
                      <i className="bi bi-clock me-1" aria-hidden="true" />
                      {formatarData(notificacao.dataEnvio)}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm flex-shrink-0"
                  title="Excluir"
                  aria-label="Excluir notificação"
                  onClick={() =>
                    confirmacao.confirmar(
                      notificacao.id,
                      "Tem certeza que deseja remover esta notificação?"
                    )
                  }
                  disabled={salvando}
                >
                  <i className="bi bi-trash3" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal.estaAberto && (
        <BaseModal titulo="Nova notificação" onFechar={modal.fechar}>
          <NotificacaoFormulario
            key="nova-notificacao"
            usuarios={usuarios}
            onEnviar={handleEnviar}
            onCancelar={modal.fechar}
            salvando={salvando}
          />
        </BaseModal>
      )}

      <ConfirmacaoModal
        aberto={confirmacao.aberto}
        titulo="Excluir notificação"
        mensagem={confirmacao.mensagem}
        textoBotao="Excluir"
        onConfirmar={handleConfirmarExclusao}
        onCancelar={confirmacao.cancelar}
        carregando={salvando}
      />
    </>
  );
}