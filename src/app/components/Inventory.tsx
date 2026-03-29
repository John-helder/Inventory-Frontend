import { useEffect, useState } from "react";
import { Package, AlertTriangle, TrendingDown, TrendingUp, Archive } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { getRawMaterials } from "../../services/rawMaterialService";
import { RawMaterial } from "./RawMaterials";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

type StockStatus = "critico" | "baixo" | "normal" | "excesso";

function getStockStatus(item: RawMaterial): StockStatus {
  if (!item.minimumQuantity) return "normal";
  const percentage = (item.stockQuantity / item.minimumQuantity) * 100;
  if (percentage < 10) return "critico";
  if (percentage <= 100) return "baixo";
  if (percentage <= 150) return "normal";
  return "excesso";
}

export function Inventory() {
  const [items, setItems] = useState<RawMaterial[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await getRawMaterials();
        setItems(data);
      } catch (error) {
        console.error("Erro ao carregar estoque", error);
      }
    }
    load();
  }, []);

  const critico = items.filter((i) => getStockStatus(i) === "critico").length;
  const baixo = items.filter((i) => getStockStatus(i) === "baixo").length;
  const normal = items.filter((i) => getStockStatus(i) === "normal").length;

  // agrupa por categoria para o gráfico
  const categoryData = Object.entries(
    items.reduce((acc, item) => {
      const cat = item.category || "Sem categoria";
      acc[cat] = (acc[cat] || 0) + item.stockQuantity;
      return acc;
    }, {} as Record<string, number>)
  ).map(([categoria, quantidade]) => ({ categoria, quantidade }));

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
              <p className="text-3xl font-semibold text-gray-900 mt-2">{items.length}</p>
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
            <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }} />
            <Bar dataKey="quantidade" name="Quantidade" radius={[8, 8, 0, 0]}>
              {categoryData.map((_, index) => (
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estoque Mínimo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Localização</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => {
                const status = getStockStatus(item);
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.code}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-600">{item.category || "—"}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium text-gray-900">
                        {item.stockQuantity.toLocaleString()} {item.unit}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-600">
                        {item.minimumQuantity?.toLocaleString() || "—"} {item.unit}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-600">{item.location || "—"}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {status === "critico" && (
                          <>
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Crítico</span>
                          </>
                        )}
                        {status === "baixo" && (
                          <>
                            <TrendingDown className="w-4 h-4 text-yellow-600" />
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Baixo</span>
                          </>
                        )}
                        {status === "normal" && (
                          <>
                            <Archive className="w-4 h-4 text-green-600" />
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Normal</span>
                          </>
                        )}
                        {status === "excesso" && (
                          <>
                            <TrendingUp className="w-4 h-4 text-blue-600" />
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Excesso</span>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}