import { useState, useMemo } from 'react'
import { useData } from '../../context/DataContext'
import { formatCurrency } from '../../utils/format'
import EditableField from '../EditableField'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import {
  Users, UserCheck, DollarSign, Briefcase, Star, Search,
  Filter, AlertTriangle, CheckCircle2, TrendingUp,
  ChevronDown, ChevronUp, XCircle, X, Eye, Plus, Trash2, Edit3, Save
} from 'lucide-react'

const CATEGORY_COLORS = {
  'Ouro': '#F59E0B',
  'Prata': '#64748b',
  'Bronze': '#CD7F32'
}

// Componente de Modal para mostrar lista de parceiros
function ParceiroListModal({ isOpen, onClose, title, parceiros, subtitle }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden animate-fadeIn"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[60vh]">
          {parceiros.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              Nenhum parceiro encontrado
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {parceiros.map((p, i) => (
                <div key={p.id || i} className="p-4 hover:bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium text-white"
                      style={{ backgroundColor: CATEGORY_COLORS[p.tipoParceria] || '#64748b' }}
                    >
                      {p.nome?.split(' ').slice(0, 2).map(n => n[0]).join('') || '??'}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{p.nome}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded text-xs" style={{
                          backgroundColor: `${CATEGORY_COLORS[p.tipoParceria]}20`,
                          color: CATEGORY_COLORS[p.tipoParceria]
                        }}>
                          {p.tipoParceria}
                        </span>
                        {p.email && <span>{p.email}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    {p.empresasIndicadas !== undefined && (
                      <div className="text-slate-600">{p.empresasIndicadas} indicações</div>
                    )}
                    {p.empresasCIC !== undefined && p.empresasCIC > 0 && (
                      <div className="text-loara-600 font-medium">{p.empresasCIC} CIC</div>
                    )}
                    {p.creditoTomado !== undefined && p.creditoTomado > 0 && (
                      <div className="text-emerald-600 font-medium">{formatCurrency(p.creditoTomado)}</div>
                    )}
                    {p.diasSemIndicar !== undefined && p.diasSemIndicar !== null && (
                      <div className={p.diasSemIndicar > 45 ? 'text-rose-600' : 'text-slate-500'}>
                        {p.diasSemIndicar} dias sem indicar
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <div className="text-sm text-slate-600 text-center">
            Total: <span className="font-bold">{parceiros.length}</span> parceiros
          </div>
        </div>
      </div>
    </div>
  )
}

// Modal para criar/editar parceiro
function ParceiroFormModal({ isOpen, onClose, onSave, parceiro = null }) {
  const [formData, setFormData] = useState({
    nome_completo: parceiro?.nome || '',
    email: parceiro?.email || '',
    tipo_parceria: parceiro?.tipoParceria || 'Bronze',
    status: parceiro?.status || 'Ativado',
    empresasIndicadas: parceiro?.empresasIndicadas || 0,
    empresasCIC: parceiro?.empresasCIC || 0,
    creditoTomado: parceiro?.creditoTomado || 0,
    receitaLoara: parceiro?.receitaLoara || 0,
    dias_sem_indicar: parceiro?.diasSemIndicar || null
  })

  const handleSave = () => {
    if (!formData.nome_completo) return
    onSave({
      ...formData,
      id: parceiro?.id || `parceiro_${Date.now()}`
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-fadeIn" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">
            {parceiro ? 'Editar Parceiro' : 'Novo Parceiro'}
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            {parceiro ? 'Atualize os dados do parceiro' : 'Adicione um novo parceiro à carteira'}
          </p>
        </div>
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome completo *</label>
              <input
                type="text"
                value={formData.nome_completo}
                onChange={(e) => setFormData({ ...formData, nome_completo: e.target.value })}
                placeholder="Nome do parceiro"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-loara-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@exemplo.com"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-loara-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
              <select
                value={formData.tipo_parceria}
                onChange={(e) => setFormData({ ...formData, tipo_parceria: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-loara-500"
              >
                <option value="Ouro">🥇 Ouro</option>
                <option value="Prata">🥈 Prata</option>
                <option value="Bronze">🥉 Bronze</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-loara-500"
              >
                <option value="Ativado">Ativo</option>
                <option value="Inativo">Inativo</option>
                <option value="Suspenso">Suspenso</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Empresas Indicadas</label>
              <input
                type="number"
                value={formData.empresasIndicadas}
                onChange={(e) => setFormData({ ...formData, empresasIndicadas: parseInt(e.target.value) || 0 })}
                min="0"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-loara-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Empresas CIC</label>
              <input
                type="number"
                value={formData.empresasCIC}
                onChange={(e) => setFormData({ ...formData, empresasCIC: parseInt(e.target.value) || 0 })}
                min="0"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-loara-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Crédito Tomado (R$)</label>
              <input
                type="number"
                value={formData.creditoTomado}
                onChange={(e) => setFormData({ ...formData, creditoTomado: parseFloat(e.target.value) || 0 })}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-loara-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Receita LOARA (R$)</label>
              <input
                type="number"
                value={formData.receitaLoara}
                onChange={(e) => setFormData({ ...formData, receitaLoara: parseFloat(e.target.value) || 0 })}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-loara-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Dias sem indicar</label>
              <input
                type="number"
                value={formData.dias_sem_indicar || ''}
                onChange={(e) => setFormData({ ...formData, dias_sem_indicar: e.target.value ? parseInt(e.target.value) : null })}
                min="0"
                placeholder="Deixe vazio se nunca indicou"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-loara-500"
              />
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!formData.nome_completo}
            className="px-4 py-2 text-sm font-medium text-white bg-loara-600 hover:bg-loara-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {parceiro ? 'Salvar Alterações' : 'Criar Parceiro'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Card clicável sem tooltip
function InteractiveStatCard({ title, value, subtitle, color, icon: Icon, onClick }) {
  const colorClasses = {
    loara: 'bg-loara-50 border-loara-200 text-loara-700',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    sky: 'bg-sky-50 border-sky-200 text-sky-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
    rose: 'bg-rose-50 border-rose-200 text-rose-700',
  }

  const iconBgClasses = {
    loara: 'bg-loara-100 text-loara-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    sky: 'bg-sky-100 text-sky-600',
    amber: 'bg-amber-100 text-amber-600',
    rose: 'bg-rose-100 text-rose-600',
  }

  return (
    <div
      className={`card p-5 border-2 cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] ${colorClasses[color] || colorClasses.loara}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-xs mt-2 opacity-70">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${iconBgClasses[color] || iconBgClasses.loara}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
      <div className="mt-3 pt-3 border-t border-current/10 flex items-center gap-1 text-xs opacity-60">
        <Eye className="w-3 h-3" />
        <span>Clique para ver detalhes</span>
      </div>
    </div>
  )
}

// Card de resultado clicável sem tooltip
function InteractiveResultCard({ title, value, subtitle, icon: Icon, borderColor, textColor, onClick }) {
  return (
    <div
      className={`card p-5 border-l-4 ${borderColor} cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-500">{title}</div>
          <div className={`text-2xl font-bold ${textColor}`}>{value}</div>
        </div>
        <Icon className={`w-10 h-10 ${textColor.replace('text-', 'text-').replace('-600', '-500')}`} />
      </div>
      {subtitle && <p className="text-xs text-slate-400 mt-2">{subtitle}</p>}
      <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
        <Eye className="w-3 h-3" />
        <span>Clique para ver</span>
      </div>
    </div>
  )
}

export default function TabDiagnostico() {
  const { data, updateData, editMode } = useData()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('todos')
  const [sortBy, setSortBy] = useState('indicacoes')
  const [sortOrder, setSortOrder] = useState('desc')
  const [showFilters, setShowFilters] = useState(true)

  // Filtros globais por tipo de parceria (checkboxes)
  const [selectedCategories, setSelectedCategories] = useState({
    Ouro: true,
    Prata: true,
    Bronze: true
  })

  // Modal state para lista de parceiros
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    subtitle: '',
    parceiros: []
  })

  // Modal state para criar/editar parceiro
  const [parceiroModal, setParceiroModal] = useState({
    isOpen: false,
    parceiro: null
  })

  const openModal = (title, parceiros, subtitle = '') => {
    setModalConfig({
      isOpen: true,
      title,
      subtitle,
      parceiros
    })
  }

  const closeModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }))
  }

  // Toggle categoria
  const toggleCategory = (category) => {
    setSelectedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  // Selecionar/deselecionar todas
  const selectAllCategories = () => {
    setSelectedCategories({ Ouro: true, Prata: true, Bronze: true })
  }

  const deselectAllCategories = () => {
    setSelectedCategories({ Ouro: false, Prata: false, Bronze: false })
  }

  // Dados dos parceiros - adapta para ambas estruturas de dados
  const allParceiros = useMemo(() => {
    const lista = data.parceiros_lista || []
    return lista.map(p => ({
      id: p.id,
      nome: p.nome_completo || p.nome || '',
      email: p.email || '',
      tipoParceria: p.tipo_parceria || p.tipoParceria || 'Bronze',
      status: p.status || 'Ativado',
      empresasIndicadas: p.empresasIndicadas ?? p.indicacoes ?? 0,
      empresasCIC: p.empresasCIC ?? 0,
      creditoTomado: p.creditoTomado ?? p.resultado ?? 0,
      receitaLoara: p.receitaLoara ?? p.faturamentoLoara ?? 0,
      diasSemIndicar: p.dias_sem_indicar ?? p.diasSemIndicar ?? null,
      ultimaIndicacao: p.ultima_indicacao || null,
      highPerformer: p.highPerformer || false
    }))
  }, [data.parceiros_lista])

  // Parceiros filtrados pelo filtro global de categoria
  const parceiros = useMemo(() => {
    return allParceiros.filter(p => selectedCategories[p.tipoParceria])
  }, [allParceiros, selectedCategories])

  // Filtros e ordenação para a tabela
  const filteredParceiros = useMemo(() => {
    let result = [...parceiros]

    // Filtro por busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(p =>
        p.nome.toLowerCase().includes(term) ||
        (p.email && p.email.toLowerCase().includes(term))
      )
    }

    // Filtro por status
    if (filterStatus === 'ativos') {
      result = result.filter(p => p.status === 'Ativado')
    } else if (filterStatus === 'inativos') {
      result = result.filter(p => p.status !== 'Ativado')
    } else if (filterStatus === 'com_indicacoes') {
      result = result.filter(p => p.empresasIndicadas > 0)
    } else if (filterStatus === 'sem_indicacoes') {
      result = result.filter(p => p.empresasIndicadas === 0)
    } else if (filterStatus === 'com_resultado') {
      result = result.filter(p => p.creditoTomado > 0)
    } else if (filterStatus === 'cic') {
      result = result.filter(p => p.empresasCIC > 0)
    } else if (filterStatus === 'alerta_45dias') {
      result = result.filter(p => p.diasSemIndicar !== null && p.diasSemIndicar > 45)
    }

    // Ordenação
    result.sort((a, b) => {
      let comparison = 0
      if (sortBy === 'nome') {
        comparison = a.nome.localeCompare(b.nome)
      } else if (sortBy === 'categoria') {
        const order = { 'Ouro': 0, 'Prata': 1, 'Bronze': 2 }
        comparison = order[a.tipoParceria] - order[b.tipoParceria]
      } else if (sortBy === 'indicacoes') {
        comparison = (b.empresasIndicadas || 0) - (a.empresasIndicadas || 0)
      } else if (sortBy === 'cic') {
        comparison = (b.empresasCIC || 0) - (a.empresasCIC || 0)
      } else if (sortBy === 'resultado') {
        comparison = (b.creditoTomado || 0) - (a.creditoTomado || 0)
      } else if (sortBy === 'diasSemIndicar') {
        const aDias = a.diasSemIndicar ?? 9999
        const bDias = b.diasSemIndicar ?? 9999
        comparison = bDias - aDias
      }
      return sortOrder === 'asc' ? -comparison : comparison
    })

    return result
  }, [parceiros, searchTerm, filterStatus, sortBy, sortOrder])

  // Estatísticas calculadas - agora usando os parceiros filtrados por categoria
  const stats = useMemo(() => {
    const ativos = parceiros.filter(p => p.status === 'Ativado')
    const comIndicacoes = ativos.filter(p => p.empresasIndicadas > 0)
    const comCIC = ativos.filter(p => p.empresasCIC > 0)
    const comResultado = ativos.filter(p => p.creditoTomado > 0)
    const semIndicar45dias = ativos.filter(p => p.diasSemIndicar !== null && p.diasSemIndicar > 45)
    const highPerformers = parceiros.filter(p => p.highPerformer)

    const totalIndicacoes = ativos.reduce((sum, p) => sum + (p.empresasIndicadas || 0), 0)
    const totalCIC = ativos.reduce((sum, p) => sum + (p.empresasCIC || 0), 0)
    const totalCredito = ativos.reduce((sum, p) => sum + (p.creditoTomado || 0), 0)
    const totalReceitaLoara = ativos.reduce((sum, p) => sum + (p.receitaLoara || 0), 0)

    return {
      totalParceiros: parceiros.length,
      ativos: ativos.length,
      ativosList: ativos,
      ouro: ativos.filter(p => p.tipoParceria === 'Ouro').length,
      ouroList: ativos.filter(p => p.tipoParceria === 'Ouro'),
      prata: ativos.filter(p => p.tipoParceria === 'Prata').length,
      prataList: ativos.filter(p => p.tipoParceria === 'Prata'),
      bronze: ativos.filter(p => p.tipoParceria === 'Bronze').length,
      bronzeList: ativos.filter(p => p.tipoParceria === 'Bronze'),
      comIndicacoes: comIndicacoes.length,
      comIndicacoesList: comIndicacoes,
      semIndicacoes: ativos.length - comIndicacoes.length,
      semIndicacoesList: ativos.filter(p => p.empresasIndicadas === 0),
      comCIC: comCIC.length,
      comCICList: comCIC,
      comResultado: comResultado.length,
      comResultadoList: comResultado,
      semResultado: ativos.length - comResultado.length,
      semIndicar45dias: semIndicar45dias.length,
      semIndicar45diasList: semIndicar45dias,
      highPerformers: highPerformers.length,
      highPerformersList: highPerformers,
      taxaAtivacao: ativos.length > 0 ? Math.round((comIndicacoes.length / ativos.length) * 100) : 0,
      taxaConversao: comIndicacoes.length > 0 ? Math.round((comCIC.length / comIndicacoes.length) * 100) : 0,
      totalIndicacoes,
      totalCIC,
      totalCredito,
      totalReceitaLoara
    }
  }, [parceiros])

  // Toggle High Performer
  const toggleHighPerformer = (parceiroId) => {
    const index = allParceiros.findIndex(p => p.id === parceiroId)
    if (index !== -1) {
      const lista = data.parceiros_lista || []
      const newValue = !lista[index].highPerformer
      updateData(`parceiros_lista[${index}].highPerformer`, newValue)
    }
  }

  // Adicionar novo parceiro
  const addParceiro = (parceiroData) => {
    const newParceiro = {
      id: parceiroData.id,
      nome_completo: parceiroData.nome_completo,
      email: parceiroData.email,
      tipo_parceria: parceiroData.tipo_parceria,
      status: parceiroData.status,
      empresasIndicadas: parceiroData.empresasIndicadas,
      empresasCIC: parceiroData.empresasCIC,
      creditoTomado: parceiroData.creditoTomado,
      receitaLoara: parceiroData.receitaLoara,
      dias_sem_indicar: parceiroData.dias_sem_indicar,
      highPerformer: false
    }
    const lista = [...(data.parceiros_lista || []), newParceiro]
    updateData('parceiros_lista', lista)
    setParceiroModal({ isOpen: false, parceiro: null })
  }

  // Editar parceiro existente
  const editParceiro = (parceiroData) => {
    const lista = data.parceiros_lista || []
    const index = lista.findIndex(p => p.id === parceiroData.id)
    if (index !== -1) {
      const updatedLista = [...lista]
      updatedLista[index] = {
        ...updatedLista[index],
        nome_completo: parceiroData.nome_completo,
        email: parceiroData.email,
        tipo_parceria: parceiroData.tipo_parceria,
        status: parceiroData.status,
        empresasIndicadas: parceiroData.empresasIndicadas,
        empresasCIC: parceiroData.empresasCIC,
        creditoTomado: parceiroData.creditoTomado,
        receitaLoara: parceiroData.receitaLoara,
        dias_sem_indicar: parceiroData.dias_sem_indicar
      }
      updateData('parceiros_lista', updatedLista)
    }
    setParceiroModal({ isOpen: false, parceiro: null })
  }

  // Excluir parceiro
  const removeParceiro = (parceiroId) => {
    if (!confirm('Tem certeza que deseja excluir este parceiro? Esta ação não pode ser desfeita.')) {
      return
    }
    const lista = (data.parceiros_lista || []).filter(p => p.id !== parceiroId)
    updateData('parceiros_lista', lista)
  }

  // Abrir modal de edição
  const openEditModal = (parceiro) => {
    setParceiroModal({
      isOpen: true,
      parceiro: {
        id: parceiro.id,
        nome: parceiro.nome,
        email: parceiro.email,
        tipoParceria: parceiro.tipoParceria,
        status: parceiro.status,
        empresasIndicadas: parceiro.empresasIndicadas,
        empresasCIC: parceiro.empresasCIC,
        creditoTomado: parceiro.creditoTomado,
        receitaLoara: parceiro.receitaLoara,
        diasSemIndicar: parceiro.diasSemIndicar
      }
    })
  }

  // Toggle sort order
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  // Dados para gráficos - usando stats filtrados
  const pieDataCategoria = [
    { name: 'Ouro', value: stats.ouro, fill: CATEGORY_COLORS['Ouro'] },
    { name: 'Prata', value: stats.prata, fill: CATEGORY_COLORS['Prata'] },
    { name: 'Bronze', value: stats.bronze, fill: CATEGORY_COLORS['Bronze'] },
  ].filter(d => d.value > 0)

  const barDataPerformance = [
    { name: 'Com Indicações', value: stats.comIndicacoes, fill: '#10B981', key: 'comIndicacoes' },
    { name: 'Sem Indicações', value: stats.semIndicacoes, fill: '#F59E0B', key: 'semIndicacoes' },
    { name: 'Empresas CIC', value: stats.comCIC, fill: '#6370f1', key: 'comCIC' },
    { name: 'Com Crédito Tomado', value: stats.comResultado, fill: '#0ea5e9', key: 'comResultado' },
  ]

  // Handler para clique no gráfico de barras
  const handleBarClick = (key) => {
    const barConfig = {
      comIndicacoes: {
        title: 'Parceiros com Indicações',
        list: stats.comIndicacoesList,
        subtitle: `${stats.comIndicacoes} parceiros que já fizeram indicações`
      },
      semIndicacoes: {
        title: 'Parceiros sem Indicações',
        list: stats.semIndicacoesList,
        subtitle: `${stats.semIndicacoes} parceiros que nunca indicaram`
      },
      comCIC: {
        title: 'Parceiros com Empresas CIC',
        list: stats.comCICList,
        subtitle: `${stats.comCIC} parceiros com contratos assinados`
      },
      comResultado: {
        title: 'Parceiros com Crédito Tomado',
        list: stats.comResultadoList,
        subtitle: `${stats.comResultado} parceiros geraram crédito`
      }
    }

    const config = barConfig[key]
    if (config) {
      openModal(config.title, config.list, config.subtitle)
    }
  }

  // Contagem de categorias ativas para label do filtro
  const activeCategoriesCount = Object.values(selectedCategories).filter(Boolean).length

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Modal de lista de parceiros */}
      <ParceiroListModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        title={modalConfig.title}
        subtitle={modalConfig.subtitle}
        parceiros={modalConfig.parceiros}
      />

      {/* Modal de criar/editar parceiro */}
      <ParceiroFormModal
        isOpen={parceiroModal.isOpen}
        onClose={() => setParceiroModal({ isOpen: false, parceiro: null })}
        onSave={parceiroModal.parceiro ? editParceiro : addParceiro}
        parceiro={parceiroModal.parceiro}
      />

      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <span className="text-2xl">🔍</span>
          {editMode ? (
            <EditableField path="textos.titulo_diagnostico" defaultValue="Diagnóstico da Carteira" />
          ) : (
            'Diagnóstico da Carteira'
          )}
        </h2>
        <p className="text-slate-500 mt-2">
          Análise detalhada dos parceiros ativos - Dados reais extraídos em 30/01/2026
        </p>
      </div>

      {/* Filtro Global por Categoria */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-loara-500" />
            <span className="font-semibold text-slate-700">Filtrar por Tipo:</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Checkbox Ouro */}
            <label className={`flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer transition-all border-2 ${
              selectedCategories.Ouro
                ? 'bg-amber-50 border-amber-300 text-amber-700'
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}>
              <input
                type="checkbox"
                checked={selectedCategories.Ouro}
                onChange={() => toggleCategory('Ouro')}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                selectedCategories.Ouro ? 'bg-amber-500 border-amber-500' : 'border-slate-300'
              }`}>
                {selectedCategories.Ouro && <span className="text-white text-xs">✓</span>}
              </div>
              <span className="font-medium">🥇 Ouro</span>
              <span className={`text-xs px-1.5 py-0.5 rounded ${
                selectedCategories.Ouro ? 'bg-amber-200' : 'bg-slate-200'
              }`}>
                {allParceiros.filter(p => p.tipoParceria === 'Ouro' && p.status === 'Ativado').length}
              </span>
            </label>

            {/* Checkbox Prata */}
            <label className={`flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer transition-all border-2 ${
              selectedCategories.Prata
                ? 'bg-slate-100 border-slate-400 text-slate-700'
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}>
              <input
                type="checkbox"
                checked={selectedCategories.Prata}
                onChange={() => toggleCategory('Prata')}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                selectedCategories.Prata ? 'bg-slate-500 border-slate-500' : 'border-slate-300'
              }`}>
                {selectedCategories.Prata && <span className="text-white text-xs">✓</span>}
              </div>
              <span className="font-medium">🥈 Prata</span>
              <span className={`text-xs px-1.5 py-0.5 rounded ${
                selectedCategories.Prata ? 'bg-slate-300' : 'bg-slate-200'
              }`}>
                {allParceiros.filter(p => p.tipoParceria === 'Prata' && p.status === 'Ativado').length}
              </span>
            </label>

            {/* Checkbox Bronze */}
            <label className={`flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer transition-all border-2 ${
              selectedCategories.Bronze
                ? 'bg-orange-50 border-orange-300 text-orange-700'
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}>
              <input
                type="checkbox"
                checked={selectedCategories.Bronze}
                onChange={() => toggleCategory('Bronze')}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                selectedCategories.Bronze ? 'bg-orange-500 border-orange-500' : 'border-slate-300'
              }`}>
                {selectedCategories.Bronze && <span className="text-white text-xs">✓</span>}
              </div>
              <span className="font-medium">🥉 Bronze</span>
              <span className={`text-xs px-1.5 py-0.5 rounded ${
                selectedCategories.Bronze ? 'bg-orange-200' : 'bg-slate-200'
              }`}>
                {allParceiros.filter(p => p.tipoParceria === 'Bronze' && p.status === 'Ativado').length}
              </span>
            </label>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={selectAllCategories}
              className="text-xs text-loara-600 hover:text-loara-800 font-medium"
            >
              Selecionar todos
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={deselectAllCategories}
              className="text-xs text-slate-500 hover:text-slate-700 font-medium"
            >
              Limpar
            </button>
          </div>
        </div>

        {activeCategoriesCount < 3 && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <p className="text-sm text-loara-600">
              <strong>Filtro ativo:</strong> Mostrando apenas parceiros {
                Object.entries(selectedCategories)
                  .filter(([_, v]) => v)
                  .map(([k]) => k)
                  .join(' e ')
              }
            </p>
          </div>
        )}
      </div>

      {/* KPIs Principais - Agora Interativos */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <InteractiveStatCard
          title="Parceiros Ativos"
          value={stats.ativos}
          subtitle={`${stats.ouro} Ouro | ${stats.prata} Prata | ${stats.bronze} Bronze`}
          color="loara"
          icon={Users}
          parceiros={stats.ativosList}
          onClick={() => openModal(
            'Parceiros Ativos',
            stats.ativosList,
            `${stats.ouro} Ouro, ${stats.prata} Prata, ${stats.bronze} Bronze`
          )}
        />
        <InteractiveStatCard
          title="Com Indicações"
          value={stats.comIndicacoes}
          subtitle={`${stats.taxaAtivacao}% de ativação`}
          color="emerald"
          icon={TrendingUp}
          parceiros={stats.comIndicacoesList}
          onClick={() => openModal(
            'Parceiros com Indicações',
            stats.comIndicacoesList,
            `Taxa de ativação: ${stats.taxaAtivacao}%`
          )}
        />
        <InteractiveStatCard
          title="Geraram Resultado"
          value={stats.comResultado}
          subtitle={`${stats.taxaConversao}% de conversão`}
          color="sky"
          icon={CheckCircle2}
          parceiros={stats.comResultadoList}
          onClick={() => openModal(
            'Parceiros que Geraram Crédito',
            stats.comResultadoList,
            `Total de crédito: ${formatCurrency(stats.totalCredito)}`
          )}
        />
        <InteractiveStatCard
          title="Alerta +45 dias"
          value={stats.semIndicar45dias}
          subtitle="Sem indicar"
          color="amber"
          icon={AlertTriangle}
          parceiros={stats.semIndicar45diasList}
          onClick={() => openModal(
            'Parceiros em Alerta (+45 dias)',
            stats.semIndicar45diasList,
            'Parceiros há mais de 45 dias sem fazer indicações'
          )}
        />
      </div>

      {/* Cards de Resultados - Agora Interativos */}
      <div className="grid md:grid-cols-5 gap-4">
        <InteractiveResultCard
          title="Total Empresas Indicadas"
          value={stats.totalIndicacoes}
          subtitle="Empresas originadas pelos parceiros"
          icon={UserCheck}
          borderColor="border-l-sky-500"
          textColor="text-sky-600"
          parceiros={stats.comIndicacoesList}
          onClick={() => openModal(
            'Parceiros com Indicações',
            stats.comIndicacoesList.sort((a, b) => b.empresasIndicadas - a.empresasIndicadas),
            `Total de ${stats.totalIndicacoes} empresas indicadas`
          )}
        />

        <InteractiveResultCard
          title="Empresas CIC"
          value={stats.totalCIC}
          subtitle="Empresas que assinaram contrato"
          icon={Briefcase}
          borderColor="border-l-loara-500"
          textColor="text-loara-600"
          parceiros={stats.comCICList}
          onClick={() => openModal(
            'Parceiros com Empresas CIC',
            stats.comCICList.sort((a, b) => b.empresasCIC - a.empresasCIC),
            `Total de ${stats.totalCIC} empresas CIC`
          )}
        />

        <InteractiveResultCard
          title="Crédito Tomado Total"
          value={formatCurrency(stats.totalCredito)}
          subtitle='Operações em fase "Crédito Tomado"'
          icon={DollarSign}
          borderColor="border-l-emerald-500"
          textColor="text-emerald-600"
          parceiros={stats.comResultadoList}
          onClick={() => openModal(
            'Parceiros com Crédito Tomado',
            stats.comResultadoList.sort((a, b) => b.creditoTomado - a.creditoTomado),
            `Total: ${formatCurrency(stats.totalCredito)}`
          )}
        />

        <InteractiveResultCard
          title="Receita Loara"
          value={formatCurrency(stats.totalReceitaLoara)}
          subtitle="Faturamento bruto gerado"
          icon={Star}
          borderColor="border-l-amber-500"
          textColor="text-amber-600"
          parceiros={stats.comResultadoList.filter(p => p.receitaLoara > 0)}
          onClick={() => openModal(
            'Parceiros que Geraram Receita',
            stats.comResultadoList.filter(p => p.receitaLoara > 0).sort((a, b) => b.receitaLoara - a.receitaLoara),
            `Total: ${formatCurrency(stats.totalReceitaLoara)}`
          )}
        />

        <InteractiveResultCard
          title="Sem Indicações"
          value={stats.semIndicacoes}
          subtitle="Parceiros que nunca indicaram"
          icon={XCircle}
          borderColor="border-l-rose-500"
          textColor="text-rose-600"
          parceiros={stats.semIndicacoesList}
          onClick={() => openModal(
            'Parceiros sem Indicações',
            stats.semIndicacoesList,
            'Parceiros ativos que ainda não fizeram nenhuma indicação'
          )}
        />
      </div>

      {/* Gráficos */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Distribuição por Categoria */}
        <div className="card p-6">
          <h3 className="font-bold text-slate-900 mb-6">Distribuição por Categoria (Filtrado)</h3>
          <div className="flex items-center gap-8">
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieDataCategoria}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieDataCategoria.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-4">
              {pieDataCategoria.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors"
                  onClick={() => {
                    const list = item.name === 'Ouro' ? stats.ouroList :
                                 item.name === 'Prata' ? stats.prataList : stats.bronzeList
                    openModal(`Parceiros ${item.name}`, list, `Total: ${item.value} parceiros`)
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.fill }}
                    ></div>
                    <span className="text-slate-600 font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance - Agora Clicável */}
        <div className="card p-6">
          <h3 className="font-bold text-slate-900 mb-2">Performance dos Parceiros (Filtrado)</h3>
          <p className="text-xs text-slate-500 mb-4">Clique em uma barra para ver os parceiros</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barDataPerformance}
                layout="vertical"
                onClick={(data) => {
                  if (data && data.activePayload && data.activePayload[0]) {
                    const item = data.activePayload[0].payload
                    handleBarClick(item.key)
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} fontSize={12} />
                <Tooltip
                  cursor={{ fill: 'rgba(99, 112, 241, 0.1)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
                          <p className="font-semibold text-slate-900">{payload[0].payload.name}</p>
                          <p className="text-sm text-slate-600">{payload[0].value} parceiros</p>
                          <p className="text-xs text-loara-600 mt-1">Clique para ver lista</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar
                  dataKey="value"
                  radius={[0, 4, 4, 0]}
                  cursor="pointer"
                >
                  {barDataPerformance.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} className="hover:opacity-80 transition-opacity" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Listagem de Parceiros */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-loara-500" />
                Listagem de Parceiros
                <span className="ml-2 px-2 py-0.5 bg-loara-100 text-loara-700 rounded-full text-sm">
                  {filteredParceiros.length} de {stats.ativos}
                </span>
              </h3>
              {editMode && (
                <button
                  onClick={() => setParceiroModal({ isOpen: true, parceiro: null })}
                  className="flex items-center gap-1 px-3 py-1.5 bg-loara-600 text-white rounded-lg text-sm hover:bg-loara-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Novo Parceiro
                </button>
              )}
            </div>

            {/* Search */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-loara-500 w-64"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  showFilters ? 'bg-loara-100 text-loara-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filtros
                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Filtros expandidos */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Filtrar por Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-loara-500"
                >
                  <option value="todos">Todos os parceiros</option>
                  <option value="ativos">✅ Apenas Ativos</option>
                  <option value="com_indicacoes">📤 Com Indicações ({stats.comIndicacoes})</option>
                  <option value="sem_indicacoes">📭 Sem Indicações ({stats.semIndicacoes})</option>
                  <option value="cic">📝 Com Empresas CIC ({stats.comCIC})</option>
                  <option value="com_resultado">💰 Com Crédito Tomado ({stats.comResultado})</option>
                  <option value="alerta_45dias">⚠️ Alerta +45 dias ({stats.semIndicar45dias})</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Ordenar por</label>
                <select
                  value={sortBy}
                  onChange={(e) => handleSort(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-loara-500"
                >
                  <option value="nome">Nome (A-Z)</option>
                  <option value="categoria">Categoria</option>
                  <option value="indicacoes">Empresas Indicadas</option>
                  <option value="cic">Empresas CIC</option>
                  <option value="resultado">Crédito Tomado</option>
                  <option value="diasSemIndicar">Dias sem indicar</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Ordem</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-loara-500"
                >
                  <option value="desc">Decrescente ↓</option>
                  <option value="asc">Crescente ↑</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="p-4 text-left font-semibold text-slate-600 w-12">⭐</th>
                <th className="p-4 text-left font-semibold text-slate-600 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('nome')}>
                  Parceiro {sortBy === 'nome' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-4 text-center font-semibold text-slate-600 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('categoria')}>
                  Categoria {sortBy === 'categoria' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-4 text-center font-semibold text-slate-600 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('indicacoes')}>
                  Indicações {sortBy === 'indicacoes' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-4 text-center font-semibold text-slate-600 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('cic')}>
                  CIC {sortBy === 'cic' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-4 text-center font-semibold text-slate-600 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('resultado')}>
                  Crédito Tomado {sortBy === 'resultado' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-4 text-center font-semibold text-slate-600 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('diasSemIndicar')}>
                  Última Indicação {sortBy === 'diasSemIndicar' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                {editMode && <th className="p-4 text-center font-semibold text-slate-600 w-24">Ações</th>}
              </tr>
            </thead>
            <tbody>
              {filteredParceiros.length === 0 ? (
                <tr>
                  <td colSpan={editMode ? 8 : 7} className="p-8 text-center text-slate-500">
                    Nenhum parceiro encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredParceiros.map((p) => (
                  <tr key={p.id} className={`border-b last:border-0 hover:bg-slate-50 transition-colors ${p.diasSemIndicar !== null && p.diasSemIndicar > 45 ? 'bg-rose-50/50' : ''}`}>
                    <td className="p-4">
                      <button
                        onClick={() => toggleHighPerformer(p.id)}
                        className={`p-1 rounded-lg transition-colors ${
                          p.highPerformer
                            ? 'text-amber-500 hover:bg-amber-50'
                            : 'text-slate-300 hover:text-amber-400 hover:bg-slate-100'
                        }`}
                        title={p.highPerformer ? 'Remover destaque' : 'Marcar como High Performer'}
                      >
                        <Star className={`w-5 h-5 ${p.highPerformer ? 'fill-current' : ''}`} />
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-medium text-slate-600">
                          {p.nome.split(' ').slice(0, 2).map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{p.nome}</div>
                          <div className="text-xs text-slate-500">{p.email || '-'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className="inline-flex px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: `${CATEGORY_COLORS[p.tipoParceria]}20`,
                          color: CATEGORY_COLORS[p.tipoParceria]
                        }}
                      >
                        {p.tipoParceria === 'Ouro' && '🥇'}
                        {p.tipoParceria === 'Prata' && '🥈'}
                        {p.tipoParceria === 'Bronze' && '🥉'}
                        {p.tipoParceria}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`font-bold text-lg ${p.empresasIndicadas > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {p.empresasIndicadas}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`font-bold ${p.empresasCIC > 0 ? 'text-loara-600' : 'text-slate-400'}`}>
                        {p.empresasCIC > 0 ? p.empresasCIC : '-'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {p.creditoTomado > 0 ? (
                        <span className="font-bold text-emerald-600">{formatCurrency(p.creditoTomado)}</span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {p.diasSemIndicar !== null ? (
                        <span className={`text-sm ${p.diasSemIndicar > 45 ? 'text-rose-600 font-medium' : p.diasSemIndicar > 30 ? 'text-amber-600' : 'text-slate-600'}`}>
                          {p.diasSemIndicar > 45 ? (
                            <span className="flex items-center justify-center gap-1">
                              <AlertTriangle className="w-4 h-4" />
                              {p.diasSemIndicar} dias
                            </span>
                          ) : (
                            `${p.diasSemIndicar} dias`
                          )}
                        </span>
                      ) : (
                        <span className="text-rose-400 text-sm">Nunca indicou</span>
                      )}
                    </td>
                    {editMode && (
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-2 text-slate-500 hover:text-loara-600 hover:bg-loara-50 rounded-lg transition-colors"
                            title="Editar parceiro"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeParceiro(p.id)}
                            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Excluir parceiro"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legenda */}
      <div className="card p-6">
        <h3 className="font-bold text-slate-900 mb-4">Como usar</h3>
        <div className="grid md:grid-cols-4 gap-4 text-sm">
          <div className="p-4 bg-slate-50 rounded-xl">
            <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Filter className="w-4 h-4 text-loara-500" />
              Filtros Globais
            </h4>
            <p className="text-slate-600">Use as checkboxes no topo para filtrar por tipo de parceria. Isso afeta todos os cards, gráficos e a tabela.</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl">
            <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Eye className="w-4 h-4 text-sky-500" />
              Cards Interativos
            </h4>
            <p className="text-slate-600">Clique em qualquer card ou passe o mouse para ver quem são os parceiros daquela métrica.</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl">
            <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" />
              High Performer
            </h4>
            <p className="text-slate-600">Clique na estrela para marcar um parceiro como alta performance.</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl">
            <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              Atenção
            </h4>
            <p className="text-slate-600">Linhas em vermelho indicam parceiros há mais de 45 dias sem indicar.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
