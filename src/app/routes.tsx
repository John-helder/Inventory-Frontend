import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { Production } from "./components/Production";
import { Inventory } from "./components/Inventory";
import { Quality } from "./components/Quality";
import { Maintenance } from "./components/Maintenance";
import { RawMaterials } from "./components/RawMaterials";
import { Products } from "./components/Products";
import { Login } from "./components/Login";
import { isAuthenticated } from "../services/authService";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />;
}

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Layout />
      </PrivateRoute>
    ),
    children: [
      { index: true, Component: Dashboard },
      { path: "producao", Component: Production },
      { path: "estoque", Component: Inventory },
      { path: "materias-primas", Component: RawMaterials },
      { path: "produtos", Component: Products },
      { path: "qualidade", Component: Quality },
      { path: "manutencao", Component: Maintenance },
    ],
  },
]);