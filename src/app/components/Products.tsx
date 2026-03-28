import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X, Package, Layers } from "lucide-react";
import { RawMaterial } from "./RawMaterials";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/productService";
import {
  getRawMaterials,
  createRawMaterial as createProductRawMaterial,
  deleteRawMaterial as deleteProductRawMaterial,
} from "../../services/rawMaterialService";
import { apiFetch } from "../../services/api";

export interface Product {
  id: number;
  code: string;
  name: string;
  value: number;
  description: string;
  category: string;
  productionTime: number;
  rawMaterials?: ProductRawMaterial[];
}

export interface ProductRawMaterial {
  id?: number;
  rawMaterialId: number;
  rawMaterialName?: string;
  quantityRequired: number;
}

interface ProductForm {
  code: string;
  name: string;
  value: number;
  description: string;
  category: string;
  productionTime: number;
  rawMaterials: ProductRawMaterial[];
}

const emptyForm: ProductForm = {
  code: "",
  name: "",
  value: 0,
  description: "",
  category: "",
  productionTime: 0,
  rawMaterials: [],
};

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [productRawMaterials, setProductRawMaterials] = useState<Record<number, ProductRawMaterial[]>>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ProductForm>(emptyForm);
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [materialQuantity, setMaterialQuantity] = useState(0);

  useEffect(() => {
    loadProducts();
    loadRawMaterials();
  }, []);

  async function loadProducts() {
    try {
      const data = await getProducts();
      setProducts(data);
      await loadProductRawMaterials(data);
    } catch (error) {
      console.error("Erro ao carregar produtos", error);
    }
  }

  async function loadRawMaterials() {
    try {
      const data = await getRawMaterials();
      setRawMaterials(data);
    } catch (error) {
      console.error("Erro ao carregar matérias-primas", error);
    }
  }

  async function loadProductRawMaterials(productList: Product[]) {
    try {
      const allRelations = await apiFetch("/api/product-raw-materials");
      const grouped: Record<number, ProductRawMaterial[]> = {};
      for (const rel of allRelations) {
        if (!grouped[rel.productId]) grouped[rel.productId] = [];
        grouped[rel.productId].push({
          id: rel.id,
          rawMaterialId: rel.rawMaterialId,
          rawMaterialName: rel.rawMaterialName,
          quantityRequired: rel.quantityRequired,
        });
      }
      setProductRawMaterials(grouped);
    } catch (error) {
      console.error("Erro ao carregar vínculos", error);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        code: formData.code,
        name: formData.name,
        value: formData.value,
        description: formData.description,
        category: formData.category,
        productionTime: formData.productionTime,
      };

      let productId: number;

      if (editingId) {
        await updateProduct(editingId, payload);
        productId = editingId;

        // remove vínculos antigos e recria
        const existing = productRawMaterials[editingId] || [];
        for (const rel of existing) {
          if (rel.id) {
            await apiFetch(`/api/product-raw-materials/${rel.id}`, { method: "DELETE" });
          }
        }
      } else {
        const created = await createProduct(payload);
        productId = created.id;
      }

      // cria vínculos com matérias-primas
      for (const rm of formData.rawMaterials) {
        await apiFetch("/api/product-raw-materials", {
          method: "POST",
          body: JSON.stringify({
            productId,
            rawMaterialId: rm.rawMaterialId,
            quantityRequired: rm.quantityRequired,
          }),
        });
      }

      await loadProducts();
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar produto", error);
    }
  };

  const handleEdit = (product: Product) => {
    const relations = productRawMaterials[product.id] || [];
    setFormData({
      code: product.code,
      name: product.name,
      value: product.value,
      description: product.description,
      category: product.category,
      productionTime: product.productionTime,
      rawMaterials: relations.map((r) => ({
        id: r.id,
        rawMaterialId: r.rawMaterialId,
        rawMaterialName: r.rawMaterialName,
        quantityRequired: r.quantityRequired,
      })),
    });
    setEditingId(product.id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await deleteProduct(id);
        await loadProducts();
      } catch (error) {
        console.error("Erro ao excluir produto", error);
      }
    }
  };

  const addMaterial = () => {
    if (!selectedMaterial || materialQuantity <= 0) return;
    const id = parseInt(selectedMaterial);
    const exists = formData.rawMaterials.find((m) => m.rawMaterialId === id);
    if (exists) {
      setFormData({
        ...formData,
        rawMaterials: formData.rawMaterials.map((m) =>
          m.rawMaterialId === id ? { ...m, quantityRequired: materialQuantity } : m
        ),
      });
    } else {
      const material = rawMaterials.find((m) => m.id === id);
      setFormData({
        ...formData,
        rawMaterials: [
          ...formData.rawMaterials,
          { rawMaterialId: id, rawMaterialName: material?.name, quantityRequired: materialQuantity },
        ],
      });
    }
    setSelectedMaterial("");
    setMaterialQuantity(0);
  };

  const removeMaterial = (rawMaterialId: number) => {
    setFormData({
      ...formData,
      rawMaterials: formData.rawMaterials.filter((m) => m.rawMaterialId !== rawMaterialId),
    });
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setIsFormOpen(false);
    setEditingId(null);
    setSelectedMaterial("");
    setMaterialQuantity(0);
  };

  const getMaterialName = (rawMaterialId: number) => {
    return rawMaterials.find((m) => m.id === rawMaterialId)?.name || "Material não encontrado";
  };

  const getMaterialUnit = (rawMaterialId: number) => {
    return rawMaterials.find((m) => m.id === rawMaterialId)?.unit || "";
  };

  const calculateProductCost = (product: Product) => {
    const relations = productRawMaterials[product.id] || [];
    return relations.reduce((total, rel) => {
      const material = rawMaterials.find((m) => m.id === rel.rawMaterialId);
      if (!material) return total;
      return total + material.unitPrice * rel.quantityRequired;
    }, 0);
  };

  const canProduce = (product: Product) => {
    const relations = productRawMaterials[product.id] || [];
    if (relations.length === 0) return false;
    return relations.every((rel) => {
      const material = rawMaterials.find((m) => m.id === rel.rawMaterialId);
      return material && material.stockQuantity >= rel.quantityRequired;
    });
  };

  const handleProduce = async (product: Product) => {
    if (!canProduce(product)) {
      alert("Não há materiais suficientes para produzir este produto!");
      return;
    }
    if (confirm(`Deseja produzir 1 unidade de ${product.name}?`)) {
      try {
        const relations = productRawMaterials[product.id] || [];
        for (const rel of relations) {
          const material = rawMaterials.find((m) => m.id === rel.rawMaterialId);
          if (material) {
            await apiFetch(`/api/raw-materials/${material.id}`, {
              method: "PUT",
              body: JSON.stringify({
                code: material.code,
                name: material.name,
                quantity: material.stockQuantity - rel.quantityRequired,
                category: material.category,
                minimumQuantity: material.minimumQuantity,
                unit: material.unit,
                location: material.location,
                unitPrice: material.unitPrice,
              }),
            });
          }
        }
        await loadRawMaterials();
        await loadProducts();
        alert(`Produto ${product.name} produzido com sucesso!`);
      } catch (error) {
        console.error("Erro ao produzir produto", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">Produtos</h2>
          <p className="text-gray-600 mt-1">Gerenciamento de produtos e receitas</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Produto</span>
        </button>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Produtos</p>
              <p className="text-3xl font-semibold text-gray-900 mt-2">{products.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Produtos Disponíveis</p>
              <p className="text-3xl font-semibold text-green-600 mt-2">
                {products.filter((p) => canProduce(p)).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Layers className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div>
            <p className="text-sm text-gray-600">Receita Potencial</p>
            <p className="text-3xl font-semibold text-gray-900 mt-2">
              R${" "}
              {products
                .reduce((sum, p) => sum + p.value, 0)
                .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Formulário Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingId ? "Editar Produto" : "Novo Produto"}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Informações Básicas</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Código *</label>
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: PROD001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: Motor Elétrico 220V"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: Motores"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preço de Venda (R$) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tempo de Produção (min)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.productionTime}
                      onChange={(e) => setFormData({ ...formData, productionTime: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="Descrição do produto..."
                    />
                  </div>
                </div>
              </div>

              {/* Matérias-Primas */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Matérias-Primas Necessárias</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Selecione a Matéria-Prima</label>
                    <select
                      value={selectedMaterial}
                      onChange={(e) => setSelectedMaterial(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Escolha uma matéria-prima...</option>
                      {rawMaterials.map((material) => (
                        <option key={material.id} value={material.id}>
                          {material.name} - Disponível: {material.stockQuantity} {material.unit}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="0"
                        value={materialQuantity}
                        onChange={(e) => setMaterialQuantity(parseInt(e.target.value))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                      />
                      <button
                        type="button"
                        onClick={addMaterial}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {formData.rawMaterials.length > 0 && (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Matéria-Prima</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantidade</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {formData.rawMaterials.map((rm) => (
                          <tr key={rm.rawMaterialId}>
                            <td className="px-4 py-2 text-sm text-gray-900">{getMaterialName(rm.rawMaterialId)}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              {rm.quantityRequired} {getMaterialUnit(rm.rawMaterialId)}
                            </td>
                            <td className="px-4 py-2">
                              <button
                                type="button"
                                onClick={() => removeMaterial(rm.rawMaterialId)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
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

      {/* Cards de Produtos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const cost = calculateProductCost(product);
          const profit = product.value - cost;
          const profitMargin = product.value > 0 ? (profit / product.value) * 100 : 0;
          const available = canProduce(product);
          const relations = productRawMaterials[product.id] || [];

          return (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.category}</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {available ? "Disponível" : "Indisponível"}
                  </span>
                </div>

                {product.description && (
                  <p className="text-sm text-gray-600">{product.description}</p>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Custo:</span>
                    <span className="font-medium text-gray-900">R$ {cost.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Preço de Venda:</span>
                    <span className="font-medium text-gray-900">R$ {product.value.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Lucro:</span>
                    <span className={`font-medium ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                      R$ {profit.toFixed(2)} ({profitMargin.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tempo:</span>
                    <span className="font-medium text-gray-900">{product.productionTime} min</span>
                  </div>
                </div>

                {relations.length > 0 && (
                  <div className="border-t border-gray-200 pt-3">
                    <p className="text-xs font-medium text-gray-500 mb-2">MATÉRIAS-PRIMAS:</p>
                    <div className="space-y-1">
                      {relations.map((rel) => {
                        const material = rawMaterials.find((m) => m.id === rel.rawMaterialId);
                        const hasEnough = material && material.stockQuantity >= rel.quantityRequired;
                        return (
                          <div key={rel.rawMaterialId} className="flex items-center justify-between text-xs">
                            <span className={hasEnough ? "text-gray-600" : "text-red-600"}>
                              {getMaterialName(rel.rawMaterialId)}
                            </span>
                            <span className={hasEnough ? "text-gray-900" : "text-red-600 font-medium"}>
                              {rel.quantityRequired} {getMaterialUnit(rel.rawMaterialId)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleProduce(product)}
                    disabled={!available}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      available ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <Package className="w-4 h-4" />
                    <span>Produzir</span>
                  </button>
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar produto"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir produto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {products.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum produto cadastrado</h3>
          <p className="text-gray-600 mb-4">Comece criando seu primeiro produto com as matérias-primas disponíveis</p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Criar Primeiro Produto</span>
          </button>
        </div>
      )}
    </div>
  );
}