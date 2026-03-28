import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X, Package, Layers, DollarSign } from "lucide-react";
import { RawMaterial } from "./RawMaterials";
import { getProducts, createProduct } from "../../services/productService";

export interface Product {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  precoVenda: number;
  tempoProducao: number; 
  materiais: ProductRawMaterial[];
}

export interface ProductRawMaterial {
  materialId: string;
  quantidade: number;
}

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Product, "id">>({
    nome: "",
    descricao: "",
    categoria: "",
    precoVenda: 0,
    tempoProducao: 0,
    materiais: [],
  });
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [materialQuantity, setMaterialQuantity] = useState(0);

  useEffect(() => {
  async function loadProducts() {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Erro ao carregar produtos", error);
    }
  }

  loadProducts();
}, []);


  useEffect(() => {
    
    const storedMaterials = localStorage.getItem("rawMaterials");

    if (storedMaterials) {
      setRawMaterials(JSON.parse(storedMaterials));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const updated = products.map((p) =>
        p.id === editingId ? { ...formData, id: editingId } : p
      );
      
      setProducts(updated);
      setEditingId(null);
    } else {
      try {
        const payload = {
          name: formData.nome,
          code: `PRD-${Date.now()}`,
          value: formData.precoVenda
        };

      const createdProduct = await createProduct(payload);

      setProducts((prev) => [
        ...prev,
        {
          ...formData,
          id: createdProduct.id || Date.now().toString()
        }
      ]);
    } catch (error) {
      console.error("Erro ao criar produto", error);
    }

    }
    resetForm();
  };

  const handleEdit = (product: Product) => {
    setFormData({
      nome: product.nome,
      descricao: product.descricao,
      categoria: product.categoria,
      precoVenda: product.precoVenda,
      tempoProducao: product.tempoProducao,
      materiais: [...product.materiais],
    });
    setEditingId(product.id);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const addMaterial = () => {
    if (selectedMaterial && materialQuantity > 0) {
      const exists = formData.materiais.find((m) => m.materialId === selectedMaterial);
      if (exists) {
        setFormData({
          ...formData,
          materiais: formData.materiais.map((m) =>
            m.materialId === selectedMaterial ? { ...m, quantidade: materialQuantity } : m
          ),
        });
      } else {
        setFormData({
          ...formData,
          materiais: [...formData.materiais, { materialId: selectedMaterial, quantidade: materialQuantity }],
        });
      }
      setSelectedMaterial("");
      setMaterialQuantity(0);
    }
  };

  const removeMaterial = (materialId: string) => {
    setFormData({
      ...formData,
      materiais: formData.materiais.filter((m) => m.materialId !== materialId),
    });
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      descricao: "",
      categoria: "",
      precoVenda: 0,
      tempoProducao: 0,
      materiais: [],
    });
    setIsFormOpen(false);
    setEditingId(null);
    setSelectedMaterial("");
    setMaterialQuantity(0);
  };

  const getMaterialName = (materialId: string) => {
    return rawMaterials.find((m) => m.id === materialId)?.nome || "Material não encontrado";
  };

  const getMaterialUnit = (materialId: string) => {
    return rawMaterials.find((m) => m.id === materialId)?.unidade || "";
  };

 const calculateProductCost = (product: Product) => {
  if (!product || !product.materiais) return 0;

  return product.materiais.reduce((total, pm) => {
    const material = rawMaterials?.find((m) => m.id === pm.materialId);

    if (!material) return total;

    return total + material.precoUnitario * pm.quantidade;
  }, 0);
};

  const canProduce = (product: Product) => {
  return (product.materiais ?? []).every((pm) => {
    const material = rawMaterials.find((m) => m.id === pm.materialId);
    return material && material.quantidade >= pm.quantidade;
  });
};

  const handleProduce = (product: Product) => {
    if (!canProduce(product)) {
      alert("Não há materiais suficientes para produzir este produto!");
      return;
    }

    if (confirm(`Deseja produzir 1 unidade de ${product.nome}?`)) {
      const updatedMaterials = rawMaterials.map((material) => {
        const productMaterial = product.materiais.find((pm) => pm.materialId === material.id);
        if (productMaterial) {
          return {
            ...material,
            quantidade: material.quantidade - productMaterial.quantidade,
          };
        }
        return material;
      });

      setRawMaterials(updatedMaterials);
      localStorage.setItem("rawMaterials", JSON.stringify(updatedMaterials));
      alert(`Produto ${product.nome} produzido com sucesso!`);
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
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors group relative"
          title="Criar novo produto com matérias-primas"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Produto</span>
          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
            Criar novo produto com matérias-primas
          </span>
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
                {products.filter(p => canProduce(p)).length}
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
              R$ {products.reduce((sum, p) => sum + p.precoVenda, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
              {/* Informações Básicas */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Informações Básicas</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome do Produto *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: Motor Elétrico 220V"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoria *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.categoria}
                      onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: Motores"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição
                    </label>
                    <textarea
                      value={formData.descricao}
                      onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="Descrição do produto..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preço de Venda (R$) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.precoVenda}
                      onChange={(e) => setFormData({ ...formData, precoVenda: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tempo de Produção (minutos) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.tempoProducao}
                      onChange={(e) => setFormData({ ...formData, tempoProducao: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Matérias-Primas */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Matérias-Primas Necessárias</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Selecione a Matéria-Prima
                    </label>
                    <select
                      value={selectedMaterial}
                      onChange={(e) => setSelectedMaterial(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Escolha uma matéria-prima...</option>
                      {rawMaterials.map((material) => (
                        <option key={material.id} value={material.id}>
                          {material.nome} - Disponível: {material.quantidade} {material.unidade}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantidade
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={materialQuantity}
                        onChange={(e) => setMaterialQuantity(parseFloat(e.target.value))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                      />
                      <button
                        type="button"
                        onClick={addMaterial}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors relative group"
                        title="Adicionar matéria-prima ao produto"
                      >
                        <Plus className="w-5 h-5" />
                        <span className="absolute bottom-full mb-2 right-0 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                          Adicionar matéria-prima ao produto
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Lista de Materiais Adicionados */}
                {formData.materiais.length > 0 && (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            Matéria-Prima
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            Quantidade
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            Ação
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {formData.materiais.map((pm) => (
                          <tr key={pm.materialId}>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              {getMaterialName(pm.materialId)}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              {pm.quantidade} {getMaterialUnit(pm.materialId)}
                            </td>
                            <td className="px-4 py-2">
                              <button
                                type="button"
                                onClick={() => removeMaterial(pm.materialId)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors relative group"
                                title="Remover matéria-prima do produto"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                  Remover do produto
                                </span>
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
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors relative group"
                  title={editingId ? "Salvar alterações do produto" : "Criar novo produto"}
                >
                  <Save className="w-5 h-5" />
                  <span>{editingId ? "Salvar" : "Criar"}</span>
                  <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    {editingId ? "Salvar alterações do produto" : "Criar novo produto"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors relative group"
                  title="Cancelar e fechar o formulário"
                >
                  <X className="w-5 h-5" />
                  <span>Cancelar</span>
                  <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    Cancelar e fechar o formulário
                  </span>
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
          const profit = product.precoVenda - cost;
          const profitMargin = product.precoVenda > 0 ? (profit / product.precoVenda) * 100 : 0;
          const available = canProduce(product);

          return (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">{product.nome}</h3>
                    <p className="text-sm text-gray-500">{product.categoria}</p>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {available ? "Disponível" : "Indisponível"}
                  </span>
                </div>

                {product.descricao && (
                  <p className="text-sm text-gray-600">{product.descricao}</p>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Custo:</span>
                    <span className="font-medium text-gray-900">R$ {cost.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Preço de Venda:</span>
                    <span className="font-medium text-gray-900">R$ {(product.precoVenda ?? 0).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Lucro:</span>
                    <span className={`font-medium ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                      R$ {profit.toFixed(2)} ({profitMargin.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tempo:</span>
                    <span className="font-medium text-gray-900">{product.tempoProducao} min</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <p className="text-xs font-medium text-gray-500 mb-2">MATÉRIAS-PRIMAS:</p>
                  <div className="space-y-1">
                    {(product.materiais ?? []).map((pm) => {
                      const material = rawMaterials.find((m) => m.id === pm.materialId);
                      const hasEnough = material && material.quantidade >= pm.quantidade;
                      return (
                        <div key={pm.materialId} className="flex items-center justify-between text-xs">
                          <span className={hasEnough ? "text-gray-600" : "text-red-600"}>
                            {getMaterialName(pm.materialId)}
                          </span>
                          <span className={hasEnough ? "text-gray-900" : "text-red-600 font-medium"}>
                            {pm.quantidade} {getMaterialUnit(pm.materialId)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleProduce(product)}
                    disabled={!available}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors relative group ${
                      available
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                    title={available ? "Produzir uma unidade deste produto" : "Materiais insuficientes para produção"}
                  >
                    <Package className="w-4 h-4" />
                    <span>Produzir</span>
                    <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      {available ? "Produzir uma unidade deste produto" : "Materiais insuficientes"}
                    </span>
                  </button>
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors relative group"
                    title="Editar produto"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      Editar produto
                    </span>
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors relative group"
                    title="Excluir produto"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      Excluir produto
                    </span>
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
          <p className="text-gray-600 mb-4">
            Comece criando seu primeiro produto com as matérias-primas disponíveis
          </p>
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
