import { Navigate, Route, Routes } from "react-router-dom";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import CadastroPage from "../pages/CadastroPage";
import LoginPage from "../pages/LoginPage";
import RecuperarSenhaPage from "../pages/RecuperarSenhaPage";
import UsuarioDashboardPage from "../pages/UsuarioDashboardPage";
import { PrivateRoute } from "./PrivateRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<CadastroPage />} />
      <Route path="/recuperar-senha" element={<RecuperarSenhaPage />} />

      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<UsuarioDashboardPage />} />
      </Route>

      <Route element={<PrivateRoute role="ADMIN" />}>
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
