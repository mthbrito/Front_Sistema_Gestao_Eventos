import { useState } from "react";
import { AuthContext } from "./AuthContext";
import { auth, setToken, getToken, removeToken } from "../services/apiService";

function decodeUser(token) {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return { email: payload.sub };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken());
  const [user, setUser] = useState(() => decodeUser(getToken()));

  async function login(email, senha) {
    const data = await auth.login(email, senha);
    setToken(data.token);
    setTokenState(data.token);
    setUser(decodeUser(data.token));
  }

  function logout() {
    removeToken();
    setTokenState(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
}
