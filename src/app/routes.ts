import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { Production } from "./components/Production";
import { Inventory } from "./components/Inventory";
import { Quality } from "./components/Quality";
import { Maintenance } from "./components/Maintenance";
import { RawMaterials } from "./components/RawMaterials";
import { Products } from "./components/Products";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
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