import { Wrench, Calendar, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const maintenanceSchedule = [
  {
    id: 1,
    equipamento: "Linha de Montagem 1",
    tipo: "preventiva",
    prioridade: "media",
    status: "agendada",
    dataAgendada: "10/03/2026",
    responsavel: "Equipe Manutenção A",
    tempoEstimado: "4 horas",
  },
  {
    id: 2,
    equipamento: "Linha de Pintura",
    tipo: "corretiva",
    prioridade: "alta",
    status: "em_andamento",
    dataAgendada: "07/03/2026",
    responsavel: "Equipe Manutenção B",
    tempoEstimado: "6 horas",
  },
  {
    id: 3,
    equipamento: "Compressor de Ar",
    tipo: "preventiva",
    prioridade: "baixa",
    status: "agendada",
    dataAgendada: "15/03/2026",
    responsavel: "Equipe Manutenção A",
    tempoEstimado: "2 horas",
  },
  {
    id: 4,
    equipamento: "Esteira Transportadora 3",
    tipo: "corretiva",
    prioridade: "alta",
    status: "pendente",
    dataAgendada: "08/03/2026",
    responsavel: "Equipe Manutenção C",
    tempoEstimado: "8 horas",
  },
  {
    id: 5,
    equipamento: "Robô de Soldagem 2",
    tipo: "preventiva",
    prioridade: "media",
    status: "concluida",
    dataAgendada: "05/03/2026",
    responsavel: "Equipe Manutenção B",
    tempoEstimado: "3 horas",
  },
];

const monthlyMaintenance = [
  { mes: "Jan", preventiva: 12, corretiva: 8 },
  { mes: "Fev", preventiva: 15, corretiva: 6 },
  { mes: "Mar", preventiva: 14, corretiva: 9 },
];

const equipmentStatus = [
  { nome: "Linha de Montagem 1", status: "operacional", ultimaManutencao: "01/02/2026", proximaManutencao: "10/03/2026" },
  { nome: "Linha de Montagem 2", status: "operacional", ultimaManutencao: "15/02/2026", proximaManutencao: "20/03/2026" },
  { nome: "Linha de Pintura", status: "manutencao", ultimaManutencao: "28/02/2026", proximaManutencao: "07/03/2026" },
  { nome: "Robô de Soldagem 1", status: "operacional", ultimaManutencao: "10/02/2026", proximaManutencao: "12/03/2026" },
  { nome: "Robô de Soldagem 2", status: "operacional", ultimaManutencao: "05/03/2026", proximaManutencao: "15/04/2026" },
  { nome: "Esteira Transportadora 1", status: "operacional", ultimaManutencao: "20/02/2026", proximaManutencao: "25/03/2026" },
  { nome: "Esteira Transportadora 2", status: "operacional", ultimaManutencao: "22/02/2026", proximaManutencao: "28/03/2026" },
  { nome: "Esteira Transportadora 3", status: "alerta", ultimaManutencao: "05/02/2026", proximaManutencao: "08/03/2026" },
];

export function Maintenance() {
  const pendente = maintenanceSchedule.filter((m) => m.status === "pendente").length;
  const agendada = maintenanceSchedule.filter((m) => m.status === "agendada").length;
  const emAndamento = maintenanceSchedule.filter((m) => m.status === "em_andamento").length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-gray-900">Manutenção</h2>
        <p className="text-gray-600 mt-1">Gestão e agendamento de manutenção</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Em Andamento</p>
              <p className="text-3xl font-semibold text-blue-600 mt-2">{emAndamento}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Wrench className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Agendadas</p>
              <p className="text-3xl font-semibold text-green-600 mt-2">{agendada}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pendentes</p>
              <p className="text-3xl font-semibold text-orange-600 mt-2">{pendente}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Equipamentos</p>
              <p className="text-3xl font-semibold text-gray-900 mt-2">{equipmentStatus.length}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Manutenções por Mês</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyMaintenance}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="mes" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="preventiva" fill="#10b981" name="Preventiva" radius={[8, 8, 0, 0]} />
            <Bar dataKey="corretiva" fill="#ef4444" name="Corretiva" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Maintenance Schedule */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Agenda de Manutenção</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Equipamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prioridade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Agendada
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Responsável
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tempo Estimado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {maintenanceSchedule.map((maintenance) => (
                <tr key={maintenance.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{maintenance.equipamento}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        maintenance.tipo === "preventiva"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {maintenance.tipo === "preventiva" ? "Preventiva" : "Corretiva"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        maintenance.prioridade === "alta"
                          ? "bg-red-100 text-red-800"
                          : maintenance.prioridade === "media"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {maintenance.prioridade === "alta"
                        ? "Alta"
                        : maintenance.prioridade === "media"
                        ? "Média"
                        : "Baixa"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {maintenance.status === "concluida" && (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-900">Concluída</span>
                        </>
                      )}
                      {maintenance.status === "em_andamento" && (
                        <>
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-900">Em Andamento</span>
                        </>
                      )}
                      {maintenance.status === "agendada" && (
                        <>
                          <Calendar className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-900">Agendada</span>
                        </>
                      )}
                      {maintenance.status === "pendente" && (
                        <>
                          <AlertTriangle className="w-4 h-4 text-orange-600" />
                          <span className="text-sm text-gray-900">Pendente</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-900">{maintenance.dataAgendada}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-600">{maintenance.responsavel}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-600">{maintenance.tempoEstimado}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Equipment Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Status dos Equipamentos</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          {equipmentStatus.map((equipment, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{equipment.nome}</h4>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    equipment.status === "operacional"
                      ? "bg-green-100 text-green-800"
                      : equipment.status === "manutencao"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {equipment.status === "operacional"
                    ? "Operacional"
                    : equipment.status === "manutencao"
                    ? "Em Manutenção"
                    : "Alerta"}
                </span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Última manutenção:</span> {equipment.ultimaManutencao}
                </p>
                <p>
                  <span className="font-medium">Próxima manutenção:</span> {equipment.proximaManutencao}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
