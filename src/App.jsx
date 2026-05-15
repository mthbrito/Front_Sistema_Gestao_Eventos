import { useState } from 'react';
import { isAuthenticated, removeToken } from "./services/apiService";
import Login from './pages/Login';
import './pages/Login.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());

  const handleLoginSuccess = () => setLoggedIn(true);

  const handleLogout = () => {
    removeToken();
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Substitua este bloco pelo seu sistema de rotas (React Router, etc.)
  return (
    <div className="container-fluid p-0">
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm px-4">
        <a className="navbar-brand fw-bold text-primary" href="#">SGE</a>
        <span className="ms-auto text-body-secondary small">Sistema de Gestão de Eventos</span>
        <button className="btn btn-outline-secondary btn-sm ms-3" onClick={handleLogout}>
          Sair
        </button>
      </nav>
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '85vh' }}>
        <div className="text-center">
          <div className="display-1 mb-3">🎉</div>
          <h3 className="fw-bold text-body-emphasis">Login realizado com sucesso!</h3>
          <p className="text-body-secondary">Suas páginas e rotas serão exibidas aqui.</p>
          <button className="btn btn-outline-primary mt-2" onClick={handleLogout}>
            Voltar ao Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;