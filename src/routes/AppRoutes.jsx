import { Navigate, Route, Routes } from "react-router-dom";
import AdminDashboard from "../pages/AdminDashboard";
import Cadastro from "../pages/Cadastro";
import Login from "../pages/Login";
import RecuperarSenha from "../pages/RecuperarSenha";
import UsuarioDashboard from "../pages/UsuarioDashboard";
import { PrivateRoute } from "./PrivateRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/recuperar-senha" element={<RecuperarSenha />} />

      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<UsuarioDashboard />} />
      </Route>

      <Route element={<PrivateRoute role="ADMIN" />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
