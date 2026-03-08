import { TrendingUp, TrendingDown, Activity, Package, AlertTriangle, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface RawMaterial {
  id: string;
  nome: string;
  quantidade: number;
  quantidadeMinima: number;
  unidade: string;
}

const productionData = [
  { hora: "00:00", producao: 145, meta: 150 },
  { hora: "04:00", producao: 152, meta: 150 },
  { hora: "08:00", producao: 168, meta: 150 },
  { hora: "12:00", producao: 142, meta: 150 },
  { hora: "16:00", producao: 158, meta: 150 },
  { hora: "20:00", producao: 165, meta: 150 },
];

const linePerformance = [
  { linha: "Linha 1", eficiencia: 94 },
  { linha: "Linha 2", eficiencia: 87 },
  { linha: "Linha 3", eficiencia: 92 },
  { linha: "Linha 4", eficiencia: 78 },
  { linha: "Linha 5", eficiencia: 96 },
];

const alerts = [
  { id: 1, tipo: "warning", mensagem: "Linha 4 abaixo da meta - 78% eficiência", tempo: "há 15 min" },
  { id: 2, tipo: "info", mensagem: "Manutenção preventiva agendada - Linha 2", tempo: "há 1 hora" },
  { id: 3, tipo: "success", mensagem: "Linha 5 atingiu 96% de eficiência", tempo: "há 2 horas" },
];

export function Dashboard() {
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("rawMaterials");
    if (stored) {
      setRawMaterials(JSON.parse(stored));
    }
  }, []);

  const criticalMaterials = rawMaterials.filter((m) => {
    const percentage = (m.quantidade / m.quantidadeMinima) * 100;
    return percentage < 10;
  });

  const alertMaterials = rawMaterials.filter((m) => {
    const percentage = (m.quantidade / m.quantidadeMinima) * 100;
    return percentage >= 10 && percentage <= 20;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-1">Visão geral do sistema de manufatura</p>
      </div>

      {/* Alertas Críticos de Estoque */}
      {criticalMaterials.length > 0 && (
        <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-red-900 text-lg">Alerta Crítico - Estoque Abaixo de 10%</h3>
                <Link
                  to="/materias-primas"
                  className="text-sm font-medium text-red-700 hover:text-red-900 underline"
                  title="Ir para gerenciamento de matérias-primas"
                >
                  Ver Detalhes
                </Link>
              </div>
              <div className="space-y-1">
                {criticalMaterials.map((material) => (
                  <p key={material.id} className="text-sm text-red-800">
                    <strong>{material.nome}</strong>: {material.quantidade} {material.unidade} 
                    (Mínimo: {material.quantidadeMinima} {material.unidade}) - 
                    <strong className="ml-1">
                      {((material.quantidade / material.quantidadeMinima) * 100).toFixed(1)}%
                    </strong>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alertas de Proximidade 10% */}
      {alertMaterials.length > 0 && (
        <div className="bg-orange-50 border border-orange-300 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-orange-900">Atenção - Estoque Próximo de 10%</h3>
                <Link
                  to="/materias-primas"
                  className="text-sm font-medium text-orange-700 hover:text-orange-900 underline"
                  title="Ir para gerenciamento de matérias-primas"
                >
                  Ver Detalhes
                </Link>
              </div>
              <div className="space-y-1">
                {alertMaterials.map((material) => (
                  <p key={material.id} className="text-sm text-orange-800">
                    <strong>{material.nome}</strong>: {material.quantidade} {material.unidade} 
                    (Mínimo: {material.quantidadeMinima} {material.unidade}) - 
                    <strong className="ml-1">
                      {((material.quantidade / material.quantidadeMinima) * 100).toFixed(1)}%
                    </strong>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Eficiência Geral</p>
              <p className="text-3xl font-semibold text-gray-900 mt-2">89.4%</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">+5.2%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Produção Hoje</p>
              <p className="text-3xl font-semibold text-gray-900 mt-2">1,830</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">+8.1%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Taxa de Qualidade</p>
              <p className="text-3xl font-semibold text-gray-900 mt-2">97.8%</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">+1.3%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Alertas Ativos</p>
              <p className="text-3xl font-semibold text-gray-900 mt-2">3</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingDown className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-600">+2</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Produção vs Meta</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={productionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="hora" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="producao" stroke="#3b82f6" strokeWidth={2} name="Produção" />
              <Line type="monotone" dataKey="meta" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" name="Meta" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Eficiência por Linha</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={linePerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="linha" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="eficiencia" fill="#3b82f6" name="Eficiência %" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas Recentes</h3>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 border border-gray-200"
            >
              {alert.tipo === "warning" && (
                <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              )}
              {alert.tipo === "info" && (
                <Activity className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              )}
              {alert.tipo === "success" && (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="text-sm text-gray-900">{alert.mensagem}</p>
                <p className="text-xs text-gray-500 mt-1">{alert.tempo}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}