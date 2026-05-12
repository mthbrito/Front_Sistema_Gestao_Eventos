const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const api = {
  async login(email, senha) {
    const response = await fetch(`${BASE_URL}/api/sge/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Erro ao realizar login');
    }

    return response.json(); // { token: "..." }
  },
};

export const setToken   = (token) => localStorage.setItem('sge_token', token);
export const getToken   = ()      => localStorage.getItem('sge_token');
export const removeToken = ()     => localStorage.removeItem('sge_token');
export const isAuthenticated = () => !!getToken();

export const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});