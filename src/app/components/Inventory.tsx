import { Package, AlertTriangle, TrendingDown, TrendingUp, Archive } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const inventoryItems = [
  {
    id: 1,
    nome: "Parafusos M6 x 20mm",
    categoria: "Fixadores",
    quantidade: 15420,
    minimo: 10000,
    unidade: "unid",
    status: "normal",
    localizacao: "A-12",
  },
  {
    id: 2,
    nome: "Rolamentos 6204",
    categoria: "Componentes",
    quantidade: 850,
    minimo: 1000,
    unidade: "unid",
    status: "baixo",
    localizacao: "B-05",
  },
  {
    id: 3,
    nome: "Tinta Industrial Azul",
    categoria: "Acabamento",
    quantidade: 245,
    minimo: 200,
    unidade: "L",
    status: "normal",
    localizacao: "C-18",
  },
  {
    id: 4,
    nome: "Chapas de Aço 2mm",
    categoria: "Matéria-Prima",
    quantidade: 89,
    minimo: 150,
    unidade: "unid",
    status: "critico",
    localizacao: "D-03",
  },
  {
    id: 5,
    nome: "Rebites de Alumínio",
    categoria: "Fixadores",
    quantidade: 28500,
    minimo: 15000,
    unidade: "unid",
    status: "excesso",
    localizacao: "A-15",
  },
  {
    id: 6,
    nome: "Óleo Lubrificante Industrial",
    categoria: "Manutenção",
    quantidade: 340,
    minimo: 300,
    unidade: "L",
    status: "normal",
    localizacao: "E-07",
  },
  {
    id: 7,
    nome: "Correia Transportadora 10m",
    categoria: "Componentes",
    quantidade: 12,
    minimo: 20,
    unidade: "unid",
    status: "baixo",
    localizacao: "B-22",
  },
  {
    id: 8,
    nome: "Caixas de Embalagem Grande",
    categoria: "Embalagem",
    quantidade: 5800,
    minimo: 3000,
    unidade: "unid",
    status: "normal",
    localizacao: "F-11",
  },
];

const categoryData = [
  { categoria: "Fixadores", quantidade: 43920 },
  { categoria: "Componentes", quantidade: 862 },
  { categoria: "Acabamento", quantidade: 245 },
  { categoria: "Matéria-Prima", quantidade: 89 },
  { categoria: "Manutenção", quantidade: 340 },
  { categoria: "Embalagem", quantidade: 5800 },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export function Inventory() {
  const critico = inventoryItems.filter((item) => item.status === "critico").length;
  const baixo = inventoryItems.filter((item) => item.status === "baixo").length;
  const normal = inventoryItems.filter((item) => item.status === "normal").length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-gray-900">Estoque</h2>
        <p className="text-gray-600 mt-1">Gestão e monitoramento de inventário</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Itens</p>
              <p className="text-3xl font-semibold text-gray-900 mt-2">
                {inventoryItems.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Nível Crítico</p>
              <p className="text-3xl font-semibold text-red-600 mt-2">{critico}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Estoque Baixo</p>
              <p className="text-3xl font-semibold text-yellow-600 mt-2">{baixo}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Estoque Normal</p>
              <p className="text-3xl font-semibold text-green-600 mt-2">{normal}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Archive className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Category Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Estoque por Categoria</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="categoria" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="quantidade" name="Quantidade" radius={[8, 8, 0, 0]}>
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Itens do Estoque</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estoque Mínimo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localização
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventoryItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-gray-900">{item.nome}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-600">{item.categoria}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-gray-900">
                      {item.quantidade.toLocaleString()} {item.unidade}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-600">
                      {item.minimo.toLocaleString()} {item.unidade}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-600">{item.localizacao}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {item.status === "critico" && (
                        <>
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Crítico
                          </span>
                        </>
                      )}
                      {item.status === "baixo" && (
                        <>
                          <TrendingDown className="w-4 h-4 text-yellow-600" />
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Baixo
                          </span>
                        </>
                      )}
                      {item.status === "normal" && (
                        <>
                          <Archive className="w-4 h-4 text-green-600" />
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Normal
                          </span>
                        </>
                      )}
                      {item.status === "excesso" && (
                        <>
                          <TrendingUp className="w-4 h-4 text-blue-600" />
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Excesso
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
