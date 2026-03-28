import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X, AlertTriangle, Package } from "lucide-react";
import {
  getRawMaterials,
  createRawMaterial,
  updateRawMaterial,
  deleteRawMaterial,
} from "../../services/rawMaterialService";

export interface RawMaterial {
  id: number;
  code: string;
  name: string;
  stockQuantity: number;
  category: string;
  minimumQuantity: number;
  unit: string;
  location: string;
  unitPrice: number;
}

interface RawMaterialForm {
  code: string;
  name: string;
  quantity: number;
  category: string;
  minimumQuantity: number;
  unit: string;
  location: string;
  unitPrice: number;
}

const emptyForm: RawMaterialForm = {
  code: "",
  name: "",
  quantity: 0,
  category: "",
  minimumQuantity: 0,
  unit: "unid",
  location: "",
  unitPrice: 0,
};

export function RawMaterials() {
  const [materials, setMaterials] = useState<RawMaterial[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<RawMaterialForm>(emptyForm);

  useEffect(() => {
    loadMaterials();
  }, []);

  async function loadMaterials() {
    try {
      const data = await getRawMaterials();
      setMaterials(data);
    } catch (error) {
      console.error("Erro ao carregar matérias-primas", error);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateRawMaterial(editingId, formData);
      } else {
        await createRawMaterial(formData);
      }
      await loadMaterials();
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar matéria-prima", error);
    }
  };

  const handleEdit = (material: RawMaterial) => {
    setFormData({
      code: material.code,
      name: material.name,
      quantity: material.stockQuantity,
      category: material.category,
      minimumQuantity: material.minimumQuantity,
      unit: material.unit,
      location: material.location,
      unitPrice: material.unitPrice,
    });
    setEditingId(material.id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta matéria-prima?")) {
      try {
        await deleteRawMaterial(id);
        await loadMaterials();
      } catch (error) {
        console.error("Erro ao excluir matéria-prima", error);
      }
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setIsFormOpen(false);
    setEditingId(null);
  };

  const getStockStatus = (material: RawMaterial) => {
    if (!material.minimumQuantity) return { status: "normal", label: "Normal", color: "green" };
    const percentage = (material.stockQuantity / material.minimumQuantity) * 100;
    if (percentage < 10) return { status: "critico", label: "Crítico", color: "red" };
    if (percentage <= 20) return { status: "alerta", label: "Alerta 10%", color: "orange" };
    if (percentage <= 100) return { status: "baixo", label: "Baixo", color: "yellow" };
    return { status: "normal", label: "Normal", color: "green" };
  };

  const criticalMaterials = materials.filter((m) => {
    if (!m.minimumQuantity) return false;
    return (m.stockQuantity / m.minimumQuantity) * 100 < 10;
  });

  const alertMaterials = materials.filter((m) => {
    if (!m.minimumQuantity) return false;
    const pct = (m.stockQuantity / m.minimumQuantity) * 100;
    return pct >= 10 && pct <= 20;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">Matérias-Primas</h2>
          <p className="text-gray-600 mt-1">Gerenciamento de materiais do estoque</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors group relative"
          title="Adicionar nova matéria-prima ao estoque"
        >
          <Plus className="w-5 h-5" />
          <span>Nova Matéria-Prima</span>
        </button>
      </div>

      {/* Alertas Críticos */}
      {criticalMaterials.length > 0 && (
        <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 text-lg">Alerta Crítico - Estoque Abaixo de 10%</h3>
              <div className="mt-2 space-y-1">
                {criticalMaterials.map((material) => (
                  <p key={material.id} className="text-sm text-red-800">
                    <strong>{material.name}</strong>: {material.stockQuantity} {material.unit}
                    (Mínimo: {material.minimumQuantity} {material.unit}) -
                    <strong className="ml-1">
                      {((material.stockQuantity / material.minimumQuantity) * 100).toFixed(1)}%
                    </strong>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alertas de Proximidade */}
      {alertMaterials.length > 0 && (
        <div className="bg-orange-50 border border-orange-300 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-orange-900">Atenção - Estoque Próximo de 10%</h3>
              <div className="mt-2 space-y-1">
                {alertMaterials.map((material) => (
                  <p key={material.id} className="text-sm text-orange-800">
                    <strong>{material.name}</strong>: {material.stockQuantity} {material.unit}
                    (Mínimo: {material.minimumQuantity} {material.unit}) -
                    <strong className="ml-1">
                      {((material.stockQuantity / material.minimumQuantity) * 100).toFixed(1)}%
                    </strong>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Materiais</p>
              <p className="text-3xl font-semibold text-gray-900 mt-2">{materials.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Críticos (&lt;10%)</p>
              <p className="text-3xl font-semibold text-red-600 mt-2">{criticalMaterials.length}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Alertas (10-20%)</p>
              <p className="text-3xl font-semibold text-orange-600 mt-2">{alertMaterials.length}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div>
            <p className="text-sm text-gray-600">Valor Total Estoque</p>
            <p className="text-3xl font-semibold text-gray-900 mt-2">
              R${" "}
              {materials
                .reduce((sum, m) => sum + m.stockQuantity * m.unitPrice, 0)
                .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Formulário Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingId ? "Editar Matéria-Prima" : "Nova Matéria-Prima"}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código *</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: RM001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Parafusos M6"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Fixadores"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade Atual *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade Mínima</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minimumQuantity}
                    onChange={(e) => setFormData({ ...formData, minimumQuantity: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unidade *</label>
                  <select
                    required
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="unid">Unidade</option>
                    <option value="kg">Quilograma (kg)</option>
                    <option value="g">Grama (g)</option>
                    <option value="L">Litro (L)</option>
                    <option value="mL">Mililitro (mL)</option>
                    <option value="m">Metro (m)</option>
                    <option value="cm">Centímetro (cm)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Localização</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: A-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preço Unitário (R$)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  <span>{editingId ? "Salvar" : "Criar"}</span>
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                  <span>Cancelar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabela */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantidade</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mínimo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Local</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preço Unit.</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {materials.map((material) => {
                const stockStatus = getStockStatus(material);
                return (
                  <tr key={material.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <p className="text-sm font-medium text-gray-900">{material.name}</p>
                      <p className="text-xs text-gray-400">{material.code}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-600">{material.category}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-900">{material.stockQuantity} {material.unit}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-600">{material.minimumQuantity} {material.unit}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-600">{material.location}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-600">R$ {material.unitPrice?.toFixed(2)}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        stockStatus.color === "red" ? "bg-red-100 text-red-800" :
                        stockStatus.color === "orange" ? "bg-orange-100 text-orange-800" :
                        stockStatus.color === "yellow" ? "bg-yellow-100 text-yellow-800" :
                        "bg-green-100 text-green-800"
                      }`}>
                        {stockStatus.label}
                      </span>
                      {material.minimumQuantity > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          {((material.stockQuantity / material.minimumQuantity) * 100).toFixed(1)}%
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(material)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar matéria-prima"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(material.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir matéria-prima"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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