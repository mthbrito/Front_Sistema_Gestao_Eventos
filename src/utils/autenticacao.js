export const decodificarUsuario = (token) => {
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    return {
      token,
      id: payload.id,
      nome: payload.nome,
      email: payload.sub,
      role: payload.role,
    };
  } catch {
    return null;
  }
};
