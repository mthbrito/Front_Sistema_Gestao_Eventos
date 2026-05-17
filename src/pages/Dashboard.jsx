// import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Importa o hook de navegação

export default function Dashboard() { // Removeu a prop onSair para fazer direto aqui dentro
//   const [loading, setLoading] = useState(false);
//   const [error, setError]     = useState('');
  
  const navigate = useNavigate(); // 2. Instancia o navigate

  const handleSair = () => {
    // Se você salvar o token de login no localStorage, limpe-o aqui antes de deslogar:
    // localStorage.removeItem('token'); 
    
    navigate('/login'); // 3. Redireciona para a rota /login
  };

  return (
    <div className="min-vh-100 bg-light flex-column d-flex">
      {/* Navbar / Header */}
      <header className="navbar navbar-expand-lg bg-white border-bottom px-4 py-3 shadow-sm">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div className="text-2xl font-bold tracking-wide fs-4 fw-bold text-primary">
            SGE
          </div>
          
          <div className="d-flex align-items-center gap-3">
            <span className="text-body-secondary small d-none d-sm-inline">
              Sistema de Gestão de Eventos
            </span>
            {/* Vinculado à função handleSair */}
            <button 
              onClick={handleSair}
              className="btn btn-outline-secondary btn-sm px-3 py-1.5"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Central - Tela de Sucesso */}
      <main className="container flex-grow-1 d-flex flex-column align-items-center justify-content-center text-center my-auto" style={{ marginTop: '-4rem' }}>
        
        <div className="mb-4 text-warning opacity-90 animate-bounce">
          <div className="sge-logo-circle mx-auto bg-warning-subtle" style={{ width: '72px', height: '72px' }}>
            <i className="bi bi-balloon-heart fs-2" />
          </div>
        </div>

        <h2 className="fw-bold text-body-emphasis mb-2 tracking-tight">
          Login realizado com sucesso!
        </h2>

        <p className="text-body-secondary small mb-4 max-w-md">
          Suas páginas e rotas serão exibidas aqui.
        </p>

        {/* Vinculado também à função handleSair */}
        <button
          onClick={handleSair}
          className="btn btn-outline-primary px-4 py-2 small fw-semibold"
        >
          Voltar ao Login
        </button>
      </main>

      {/* Footer */}
      <footer className="bg-white border-top py-3 mt-auto">
        <div className="container text-center">
          <p className="text-body-secondary small mb-0 opacity-75">
            © {new Date().getFullYear()} SGE · IFPB
          </p>
        </div>
      </footer>
    </div>
  );
}