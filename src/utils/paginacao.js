export const extrairLista = (resposta) => {
  if (Array.isArray(resposta)) return resposta;
  return resposta?.content ?? [];
};