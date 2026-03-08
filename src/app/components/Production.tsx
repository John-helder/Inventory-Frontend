import { Play, Pause, AlertCircle, Clock, TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const productionLines = [
  {
    id: 1,
    nome: "Linha de Montagem 1",
    status: "ativo",
    producao: 245,
    meta: 250,
    eficiencia: 98,
    operador: "João Silva",
    tempoAtivo: "7h 45m",
  },
  {
    id: 2,
    nome: "Linha de Montagem 2",
    status: "ativo",
    producao: 218,
    meta: 250,
    eficiencia: 87,
    operador: "Maria Santos",
    tempoAtivo: "7h 30m",
  },
  {
    id: 3,
    nome: "Linha de Pintura",
    status: "manutencao",
    producao: 0,
    meta: 180,
    eficiencia: 0,
    operador: "Em Manutenção",
    tempoAtivo: "0h 0m",
  },
  {
    id: 4,
    nome: "Linha de Embalagem",
    status: "ativo",
    producao: 312,
    meta: 300,
    eficiencia: 104,
    operador: "Carlos Oliveira",
    tempoAtivo: "8h 15m",
  },
  {
    id: 5,
    nome: "Linha de Inspeção",
    status: "pausado",
    producao: 156,
    meta: 200,
    eficiencia: 78,
    operador: "Ana Costa",
    tempoAtivo: "5h 20m",
  },
];

const hourlyProduction = [
  { hora: "00:00", unidades: 120 },
  { hora: "01:00", unidades: 135 },
  { hora: "02:00", unidades: 145 },
  { hora: "03:00", unidades: 152 },
  { hora: "04:00", unidades: 148 },
  { hora: "05:00", unidades: 165 },
  { hora: "06:00", unidades: 172 },
  { hora: "07:00", unidades: 168 },
  { hora: "08:00", unidades: 185 },
  { hora: "09:00", unidades: 192 },
  { hora: "10:00", unidades: 178 },
  { hora: "11:00", unidades: 188 },
];

export function Production() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-gray-900">Produção</h2>
        <p className="text-gray-600 mt-1">Monitoramento em tempo real das linhas de produção</p>
      </div>

      {/* Production Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Produção por Hora</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={hourlyProduction}>
            <defs>
              <linearGradient id="colorUnidades" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
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
            <Area
              type="monotone"
              dataKey="unidades"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorUnidades)"
              name="Unidades Produzidas"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Production Lines */}
      <div className="grid grid-cols-1 gap-4">
        {productionLines.map((line) => (
          <div
            key={line.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    line.status === "ativo"
                      ? "bg-green-100"
                      : line.status === "pausado"
                      ? "bg-yellow-100"
                      : "bg-red-100"
                  }`}
                >
                  {line.status === "ativo" ? (
                    <Play className="w-6 h-6 text-green-600" />
                  ) : line.status === "pausado" ? (
                    <Pause className="w-6 h-6 text-yellow-600" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{line.nome}</h3>
                  <p className="text-sm text-gray-600 mt-1">Operador: {line.operador}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        line.status === "ativo"
                          ? "bg-green-100 text-green-800"
                          : line.status === "pausado"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {line.status === "ativo"
                        ? "Ativo"
                        : line.status === "pausado"
                        ? "Pausado"
                        : "Manutenção"}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3.5 h-3.5" />
                      {line.tempoAtivo}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 lg:gap-8">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Produção</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">
                    {line.producao}
                  </p>
                  <p className="text-xs text-gray-500">/ {line.meta} meta</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Eficiência</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <p
                      className={`text-2xl font-semibold ${
                        line.eficiencia >= 95
                          ? "text-green-600"
                          : line.eficiencia >= 80
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {line.eficiencia}%
                    </p>
                    {line.eficiencia >= 100 && (
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Progresso</p>
                  <div className="mt-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto">
                      <div
                        className={`h-full rounded-full ${
                          line.eficiencia >= 95
                            ? "bg-green-600"
                            : line.eficiencia >= 80
                            ? "bg-yellow-600"
                            : "bg-red-600"
                        }`}
                        style={{
                          width: `${Math.min(100, (line.producao / line.meta) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
