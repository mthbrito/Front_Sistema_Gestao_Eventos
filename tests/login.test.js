import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../src/contexts/AuthContext";
import LoginForm from "../src/components/auth/login/LoginForm";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockLogin = jest.fn();

function renderLogin(loginImpl = mockLogin) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={{ login: loginImpl, user: null, isAuthenticated: false }}>
          <LoginFormulario />
        </AuthContext.Provider>
      </QueryClientProvider>
    </MemoryRouter>
  );
}

import { toast } from "sonner";

describe("LoginFormulario", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- renderização ---
  describe("renderização", () => {
    it("exibe campo de email", () => {
      renderLogin();
      expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    });

    it("exibe campo de senha", () => {
      renderLogin();
      expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    });

    it("exibe botão de entrar habilitado", () => {
      renderLogin();
      expect(screen.getByRole("button", { name: /entrar/i })).toBeEnabled();
    });
  });

  // --- validação ---
  describe("validação do schema", () => {
    it("exibe erro se email inválido", async () => {
      renderLogin();
      fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: "invalido" } });
      fireEvent.click(screen.getByRole("button", { name: /entrar/i }));
      await waitFor(() =>
        expect(toast.error).toHaveBeenCalledWith("Informe um e-mail válido.")
      );
    });

    it("exibe erro se senha menor que 4 caracteres", async () => {
      renderLogin();
      fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: "a@b.com" } });
      fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: "123" } });
      fireEvent.click(screen.getByRole("button", { name: /entrar/i }));
      await waitFor(() =>
        expect(toast.error).toHaveBeenCalledWith("A senha deve ter pelo menos 4 caracteres.")
      );
    });

    it("não chama login se formulário inválido", async () => {
      renderLogin();
      fireEvent.click(screen.getByRole("button", { name: /entrar/i }));
      await waitFor(() => expect(mockLogin).not.toHaveBeenCalled());
    });
  });

  // --- submissão ---
  describe("submissão", () => {
    it("chama login com email e senha corretos", async () => {
      mockLogin.mockResolvedValueOnce({ token: "tok", usuario: { role: "USUARIO" } });
      renderLogin();
      fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: "a@b.com" } });
      fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: "1234" } });
      fireEvent.click(screen.getByRole("button", { name: /entrar/i }));
      await waitFor(() =>
        expect(mockLogin).toHaveBeenCalledWith("a@b.com", "1234")
      );
    });

    it("exibe toast de sucesso após login", async () => {
      mockLogin.mockResolvedValueOnce({ token: "tok", usuario: { role: "USUARIO" } });
      renderLogin();
      fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: "a@b.com" } });
      fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: "1234" } });
      fireEvent.click(screen.getByRole("button", { name: /entrar/i }));
      await waitFor(() =>
        expect(toast.success).toHaveBeenCalledWith("Login realizado com sucesso!")
      );
    });
  });

  // --- loading ---
  describe("loading", () => {
    it("desabilita botão durante requisição", async () => {
      mockLogin.mockImplementation(() => new Promise(() => {})); // pending forever
      renderLogin();
      fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: "a@b.com" } });
      fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: "1234" } });
      fireEvent.click(screen.getByRole("button", { name: /entrar/i }));
      await waitFor(() =>
        expect(screen.getByRole("button", { name: /entrando/i })).toBeDisabled()
      );
    });
  });

  // --- erros da API ---
  describe("erros da API", () => {
    const casos = [
      { status: 401, mensagem: "Credenciais inválidas." },
      { status: 403, mensagem: "Usuário sem permissão." },
      { status: 500, mensagem: "Erro interno." },
    ];

    casos.forEach(({ status, mensagem }) => {
      it(`exibe toast correto para erro ${status}`, async () => {
        mockLogin.mockRejectedValueOnce({ response: { status } });
        renderLogin();
        fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: "a@b.com" } });
        fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: "1234" } });
        fireEvent.click(screen.getByRole("button", { name: /entrar/i }));
        await waitFor(() =>
          expect(toast.error).toHaveBeenCalledWith(mensagem)
        );
      });
    });
  });

  // --- RBAC ---
  describe("redirecionamento RBAC", () => {
    it("redireciona ADMIN para /admin/dashboard", async () => {
      mockLogin.mockResolvedValueOnce({ token: "tok", usuario: { role: "ADMIN" } });
      renderLogin();
      fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: "a@b.com" } });
      fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: "1234" } });
      fireEvent.click(screen.getByRole("button", { name: /entrar/i }));
      await waitFor(() =>
        expect(mockNavigate).toHaveBeenCalledWith("/admin/dashboard", { replace: true })
      );
    });

    it("redireciona USUARIO para /dashboard", async () => {
      mockLogin.mockResolvedValueOnce({ token: "tok", usuario: { role: "USUARIO" } });
      renderLogin();
      fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: "a@b.com" } });
      fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: "1234" } });
      fireEvent.click(screen.getByRole("button", { name: /entrar/i }));
      await waitFor(() =>
        expect(mockNavigate).toHaveBeenCalledWith("/dashboard", { replace: true })
      );
    });
  });

  // --- persistência ---
  describe("persistência do token", () => {
    it("persiste token no authStorage após login", async () => {
      const { authStorage } = require("../src/utils/authStorage");
      mockLogin.mockResolvedValueOnce({ token: "meu-token", usuario: { role: "USUARIO" } });
      renderLogin();
      fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: "a@b.com" } });
      fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: "1234" } });
      fireEvent.click(screen.getByRole("button", { name: /entrar/i }));
      await waitFor(() =>
        expect(authStorage.get()).toBe("meu-token")
      );
    });
  });

});