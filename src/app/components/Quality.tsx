import { CheckCircle, XCircle, AlertCircle, TrendingUp } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const qualityData = [
  { nome: "Aprovado", valor: 1789, porcentagem: 97.8 },
  { nome: "Reprovado", valor: 28, porcentagem: 1.5 },
  { nome: "Retrabalho", valor: 13, porcentagem: 0.7 },
];

const COLORS = ["#10b981", "#ef4444", "#f59e0b"];

const qualityTrend = [
  { semana: "Sem 1", taxa: 96.2 },
  { semana: "Sem 2", taxa: 96.8 },
  { semana: "Sem 3", taxa: 97.1 },
  { semana: "Sem 4", taxa: 96.5 },
  { semana: "Sem 5", taxa: 97.3 },
  { semana: "Sem 6", taxa: 97.8 },
];

const inspections = [
  {
    id: 1,
    produto: "Motor Elétrico 220V",
    lote: "LT-2024-1234",
    inspetor: "Ricardo Lima",
    resultado: "aprovado",
    defeitos: 0,
    amostras: 50,
    data: "07/03/2026 14:30",
  },
  {
    id: 2,
    produto: "Painel de Controle Industrial",
    lote: "LT-2024-1235",
    inspetor: "Ana Costa",
    resultado: "reprovado",
    defeitos: 8,
    amostras: 50,
    data: "07/03/2026 13:15",
  },
  {
    id: 3,
    produto: "Válvula Solenoide 24V",
    lote: "LT-2024-1236",
    inspetor: "Carlos Mendes",
    resultado: "aprovado",
    defeitos: 0,
    amostras: 100,
    data: "07/03/2026 11:45",
  },
  {
    id: 4,
    produto: "Sensor de Temperatura",
    lote: "LT-2024-1237",
    inspetor: "Juliana Souza",
    resultado: "retrabalho",
    defeitos: 3,
    amostras: 75,
    data: "07/03/2026 10:20",
  },
  {
    id: 5,
    produto: "Cabo de Alimentação 5m",
    lote: "LT-2024-1238",
    inspetor: "Ricardo Lima",
    resultado: "aprovado",
    defeitos: 0,
    amostras: 200,
    data: "07/03/2026 09:00",
  },
];

export function Quality() {
  const totalInspected = qualityData.reduce((sum, item) => sum + item.valor, 0);
  const approvalRate = qualityData.find((item) => item.nome === "Aprovado")?.porcentagem || 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-gray-900">Qualidade</h2>
        <p className="text-gray-600 mt-1">Controle e inspeção de qualidade</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Taxa de Aprovação</p>
              <p className="text-3xl font-semibold text-green-600 mt-2">{approvalRate}%</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">+1.3%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Inspecionado</p>
              <p className="text-3xl font-semibold text-gray-900 mt-2">
                {totalInspected.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Reprovados</p>
              <p className="text-3xl font-semibold text-red-600 mt-2">
                {qualityData.find((item) => item.nome === "Reprovado")?.valor || 0}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {qualityData.find((item) => item.nome === "Reprovado")?.porcentagem || 0}% do total
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Retrabalho</p>
              <p className="text-3xl font-semibold text-yellow-600 mt-2">
                {qualityData.find((item) => item.nome === "Retrabalho")?.valor || 0}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {qualityData.find((item) => item.nome === "Retrabalho")?.porcentagem || 0}% do total
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição de Resultados</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={qualityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ nome, porcentagem }) => `${nome}: ${porcentagem}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="valor"
              >
                {qualityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendência de Qualidade</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={qualityTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="semana" stroke="#6b7280" />
              <YAxis domain={[95, 100]} stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="taxa"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", r: 5 }}
                name="Taxa de Aprovação %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Inspections Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Inspeções Recentes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lote
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inspetor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amostras
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Defeitos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resultado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data/Hora
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inspections.map((inspection) => (
                <tr key={inspection.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{inspection.produto}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-600">{inspection.lote}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-600">{inspection.inspetor}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-900">{inspection.amostras}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p
                      className={`text-sm font-medium ${
                        inspection.defeitos === 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {inspection.defeitos}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {inspection.resultado === "aprovado" && (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Aprovado
                          </span>
                        </>
                      )}
                      {inspection.resultado === "reprovado" && (
                        <>
                          <XCircle className="w-4 h-4 text-red-600" />
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Reprovado
                          </span>
                        </>
                      )}
                      {inspection.resultado === "retrabalho" && (
                        <>
                          <AlertCircle className="w-4 h-4 text-yellow-600" />
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Retrabalho
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-600">{inspection.data}</p>
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
