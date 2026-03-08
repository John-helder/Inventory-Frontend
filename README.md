# Sistema de Manufatura Industrial - IndustrialPro

Sistema completo de gerenciamento de manufatura industrial com CRUD de produtos, matérias-primas e sistema de alertas de estoque.

## 🚀 Funcionalidades

### ✅ CRUD Completo
- **Matérias-Primas**: Criar, editar, visualizar e deletar matérias-primas
- **Produtos**: Criar produtos usando matérias-primas do estoque
- **Relacionamento**: Vincular produtos com múltiplas matérias-primas (ProductRawMaterial)

### 🚨 Sistema de Alertas Inteligente
- **Alerta Crítico**: Exibido quando estoque < 10% do mínimo (borda vermelha destacada)
- **Alerta de Proximidade**: Exibido quando estoque entre 10-20% do mínimo
- **Dashboard Integrado**: Alertas aparecem no dashboard principal
- **Links Diretos**: Acesso rápido para gerenciar matérias-primas

### 🎯 Tooltips Informativos
- Todos os botões possuem tooltips explicativos
- Passe o mouse sobre qualquer botão para ver sua função
- Interface intuitiva e amigável

### 📱 Design Responsivo
- Funciona perfeitamente em desktop, tablet e mobile
- Layout adaptativo com sidebar colapsável
- Tabelas e cards responsivos
- Touch-friendly para dispositivos móveis

## 🗂️ Estrutura do Sistema

### Páginas Principais

1. **Dashboard** (`/`)
   - Visão geral com métricas
   - Alertas de estoque em tempo real
   - Gráficos de produção e eficiência

2. **Produção** (`/producao`)
   - Monitoramento de linhas de produção
   - Status em tempo real
   - Métricas de eficiência

3. **Estoque** (`/estoque`)
   - Visão geral do inventário
   - Status por categoria
   - Localização de materiais

4. **Matérias-Primas** (`/materias-primas`)
   - CRUD completo de matérias-primas
   - Sistema de alertas integrado
   - Controle de estoque mínimo
   - Preço unitário e localização

5. **Produtos** (`/produtos`)
   - CRUD completo de produtos
   - Criação de receitas (produto + matérias-primas)
   - Cálculo automático de custo e lucro
   - Verificação de disponibilidade de materiais
   - Botão de produção com desconto automático de estoque

6. **Qualidade** (`/qualidade`)
   - Controle de inspeções
   - Taxa de aprovação
   - Histórico de qualidade

7. **Manutenção** (`/manutencao`)
   - Agendamento de manutenções
   - Preventiva e corretiva
   - Status de equipamentos

## 💾 Armazenamento de Dados

Os dados são armazenados localmente usando `localStorage`:
- `rawMaterials`: Lista de matérias-primas
- `products`: Lista de produtos

## 🎨 Recursos de UX

### Tooltips
Todos os botões incluem tooltips que explicam suas funções:
- Adicionar novo item
- Editar existente
- Excluir item
- Produzir produto
- Salvar alterações
- Cancelar operação

### Feedback Visual
- **Status de Estoque**: Cores indicam níveis (verde, amarelo, laranja, vermelho)
- **Disponibilidade de Produto**: Badge verde/vermelho
- **Alertas Fixos**: Destacados no topo da página
- **Confirmações**: Diálogos de confirmação para ações destrutivas

### Sistema de Alertas de Estoque

#### Níveis de Alerta:
1. **Normal** (> 100%): Badge verde
2. **Baixo** (20-100%): Badge amarelo
3. **Alerta** (10-20%): Badge laranja + notificação no topo
4. **Crítico** (< 10%): Badge vermelho + alerta fixo destacado

## 🛠️ Como Usar

### Criar Matéria-Prima
1. Acesse "Matérias-Primas"
2. Clique em "Nova Matéria-Prima"
3. Preencha os campos (nome, categoria, quantidade, etc.)
4. Defina a quantidade mínima (base para alertas)
5. Clique em "Criar"

### Criar Produto
1. Acesse "Produtos"
2. Clique em "Novo Produto"
3. Preencha informações básicas
4. Adicione matérias-primas necessárias
5. Sistema calcula automaticamente o custo e lucro
6. Clique em "Criar"

### Produzir Produto
1. Localize o produto na lista
2. Verifique se está "Disponível" (materiais suficientes)
3. Clique em "Produzir"
4. Sistema desconta automaticamente as matérias-primas do estoque

## 📊 Recursos Técnicos

- **React 18** com TypeScript
- **React Router 7** (Data Mode)
- **Recharts** para gráficos
- **Lucide React** para ícones
- **Tailwind CSS v4** para estilização
- **LocalStorage** para persistência
- **Design Responsivo** com breakpoints mobile-first

## 🔔 Sistema de Notificações

O sistema monitora automaticamente os níveis de estoque e exibe:
- Alertas críticos no Dashboard
- Notificações na página de Matérias-Primas
- Contadores de alertas nos cards de resumo
- Links diretos para ação rápida

## 🎯 Boas Práticas Implementadas

✅ Componentes reutilizáveis
✅ TypeScript para type safety
✅ Validação de formulários
✅ Confirmação de ações destrutivas
✅ Feedback visual imediato
✅ Tooltips descritivos
✅ Design responsivo
✅ Persistência local de dados
✅ Cálculos automáticos
✅ Sistema de alertas proativo
