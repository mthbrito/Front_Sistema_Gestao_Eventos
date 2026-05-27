const KEY = "sge_token";

export const authStorage = {
    get: () => localStorage.getItem(KEY),
    set: (token) => localStorage.setItem(KEY, token),
    remove: () => localStorage.removeItem(KEY),
    getNome: () => localStorage.getItem("sge_nome"),
    setNome: (nome) => localStorage.setItem("sge_nome", nome),
    removeNome: () => localStorage.removeItem("sge_nome"),
};