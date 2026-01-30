import { useState, useMemo } from 'react'
import { useData } from '../../context/DataContext'
import { formatCurrency } from '../../utils/format'
import StatCard from '../StatCard'
import EditableField from '../EditableField'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import {
  Users, UserCheck, DollarSign, Briefcase, Star, Search,
  Filter, AlertTriangle, CheckCircle2, Clock, TrendingUp,
  ChevronDown, ChevronUp, XCircle
} from 'lucide-react'

const CATEGORY_COLORS = {
  'Ouro': '#F59E0B',
  'Prata': '#64748b',
  'Bronze': '#CD7F32'
}

export default function TabDiagnostico() {
  const { data, updateData, editMode } = useData()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('todos')
  const [filterStatus, setFilterStatus] = useState('todos')
  const [sortBy, setSortBy] = useState('indicacoes')
  const [sortOrder, setSortOrder] = useState('desc')
  const [showFilters, setShowFilters] = useState(true)

  // Dados dos parceiros - adapta para ambas estruturas de dados
  const parceiros = useMemo(() => {
    const lista = data.parceiros_lista || []
    return lista.map(p => ({
      id: p.id,
      nome: p.nome_completo || p.nome || '',
      email: p.email || '',
      tipoParceria: p.tipo_parceria || p.tipoParceria || 'Bronze',
      status: p.status || 'Ativado',
      // Novos campos corretos do Excel
      empresasIndicadas: p.empresasIndicadas ?? p.indicacoes ?? 0,
      empresasCIC: p.empresasCIC ?? 0,
      creditoTomado: p.creditoTomado ?? p.resultado ?? 0,
      receitaLoara: p.receitaLoara ?? p.faturamentoLoara ?? 0,
      diasSemIndicar: p.dias_sem_indicar ?? p.diasSemIndicar ?? null,
      ultimaIndicacao: p.ultima_indicacao || null,
      highPerformer: p.highPerformer || false
    }))
  }, [data.parceiros_lista])

  // Filtros e ordenação
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

    // Filtro por categoria
    if (filterCategory !== 'todos') {
      result = result.filter(p => p.tipoParceria === filterCategory)
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
  }, [parceiros, searchTerm, filterCategory, filterStatus, sortBy, sortOrder])

  // Estatísticas calculadas
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
      ouro: ativos.filter(p => p.tipoParceria === 'Ouro').length,
      prata: ativos.filter(p => p.tipoParceria === 'Prata').length,
      bronze: ativos.filter(p => p.tipoParceria === 'Bronze').length,
      comIndicacoes: comIndicacoes.length,
      semIndicacoes: ativos.length - comIndicacoes.length,
      comCIC: comCIC.length,
      comResultado: comResultado.length,
      semResultado: ativos.length - comResultado.length,
      semIndicar45dias: semIndicar45dias.length,
      highPerformers: highPerformers.length,
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
    const index = parceiros.findIndex(p => p.id === parceiroId)
    if (index !== -1) {
      const lista = data.parceiros_lista || []
      const newValue = !lista[index].highPerformer
      updateData(`parceiros_lista[${index}].highPerformer`, newValue)
    }
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

  // Dados para gráficos
  const pieDataCategoria = [
    { name: 'Ouro', value: stats.ouro, fill: CATEGORY_COLORS['Ouro'] },
    { name: 'Prata', value: stats.prata, fill: CATEGORY_COLORS['Prata'] },
    { name: 'Bronze', value: stats.bronze, fill: CATEGORY_COLORS['Bronze'] },
  ]

  const barDataPerformance = [
    { name: 'Com Indicações', value: stats.comIndicacoes, fill: '#10B981' },
    { name: 'Sem Indicações', value: stats.semIndicacoes, fill: '#F59E0B' },
    { name: 'Empresas CIC', value: stats.comCIC, fill: '#6370f1' },
    { name: 'Com Crédito Tomado', value: stats.comResultado, fill: '#0ea5e9' },
  ]

  return (
    <div className="space-y-8 animate-fadeIn">
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

      {/* KPIs Principais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Parceiros Ativos"
          value={stats.ativos}
          subtitle={`${stats.ouro} Ouro | ${stats.prata} Prata | ${stats.bronze} Bronze`}
          color="loara"
          icon={Users}
        />
        <StatCard
          title="Com Indicações"
          value={stats.comIndicacoes}
          subtitle={`${stats.taxaAtivacao}% de ativação`}
          color="emerald"
          icon={TrendingUp}
        />
        <StatCard
          title="Geraram Resultado"
          value={stats.comResultado}
          subtitle={`${stats.taxaConversao}% de conversão`}
          color="sky"
          icon={CheckCircle2}
        />
        <StatCard
          title="Alerta +45 dias"
          value={stats.semIndicar45dias}
          subtitle="Sem indicar"
          color="amber"
          icon={AlertTriangle}
        />
      </div>

      {/* Cards de Resultados */}
      <div className="grid md:grid-cols-5 gap-4">
        <div className="card p-5 border-l-4 border-l-sky-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-500">Total Empresas Indicadas</div>
              <div className="text-2xl font-bold text-sky-600">{stats.totalIndicacoes}</div>
            </div>
            <UserCheck className="w-10 h-10 text-sky-500" />
          </div>
          <p className="text-xs text-slate-400 mt-2">Empresas originadas pelos parceiros</p>
        </div>

        <div className="card p-5 border-l-4 border-l-loara-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-500">Empresas CIC</div>
              <div className="text-2xl font-bold text-loara-600">{stats.totalCIC}</div>
            </div>
            <Briefcase className="w-10 h-10 text-loara-500" />
          </div>
          <p className="text-xs text-slate-400 mt-2">Empresas que assinaram contrato</p>
        </div>

        <div className="card p-5 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-500">Crédito Tomado Total</div>
              <div className="text-2xl font-bold text-emerald-600">{formatCurrency(stats.totalCredito)}</div>
            </div>
            <DollarSign className="w-10 h-10 text-emerald-500" />
          </div>
          <p className="text-xs text-slate-400 mt-2">Operações em fase "Crédito Tomado"</p>
        </div>

        <div className="card p-5 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-500">Receita Loara</div>
              <div className="text-2xl font-bold text-amber-600">{formatCurrency(stats.totalReceitaLoara)}</div>
            </div>
            <Star className="w-10 h-10 text-amber-500" />
          </div>
          <p className="text-xs text-slate-400 mt-2">Faturamento bruto gerado</p>
        </div>

        <div className="card p-5 border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-500">Inadimplentes</div>
              <div className="text-2xl font-bold text-rose-600">{data.diagnostico?.pagamentos?.inadimplentes || 8}</div>
            </div>
            <XCircle className="w-10 h-10 text-rose-500" />
          </div>
          <p className="text-xs text-slate-400 mt-2">{formatCurrency(data.diagnostico?.pagamentos?.valor_total_a_receber || 96127)} a receber</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Distribuição por Categoria */}
        <div className="card p-6">
          <h3 className="font-bold text-slate-900 mb-6">Distribuição por Categoria (Ativos)</h3>
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
                <div key={i} className="flex items-center justify-between">
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

        {/* Performance */}
        <div className="card p-6">
          <h3 className="font-bold text-slate-900 mb-6">Performance dos Parceiros Ativos</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barDataPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {barDataPerformance.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
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
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-loara-500" />
              Listagem de Parceiros
              <span className="ml-2 px-2 py-0.5 bg-loara-100 text-loara-700 rounded-full text-sm">
                {filteredParceiros.length} de {stats.ativos}
              </span>
            </h3>

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
                <label className="block text-xs text-slate-500 mb-1">Categoria</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-loara-500"
                >
                  <option value="todos">Todas as categorias</option>
                  <option value="Ouro">🥇 Ouro ({stats.ouro})</option>
                  <option value="Prata">🥈 Prata ({stats.prata})</option>
                  <option value="Bronze">🥉 Bronze ({stats.bronze})</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Filtrar por</label>
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
              </tr>
            </thead>
            <tbody>
              {filteredParceiros.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
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
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 bg-slate-50 rounded-xl">
            <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" />
              High Performer
            </h4>
            <p className="text-slate-600">Clique na estrela ao lado do nome para marcar um parceiro como alta performance. Essa marcação é salva automaticamente.</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl">
            <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              Atenção
            </h4>
            <p className="text-slate-600">Linhas em vermelho indicam parceiros há mais de 45 dias sem indicar. "Nunca indicou" significa que o parceiro nunca fez uma indicação.</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl">
            <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Filter className="w-4 h-4 text-loara-500" />
              Filtros
            </h4>
            <p className="text-slate-600">Use os filtros para encontrar parceiros por categoria, status de indicações ou ordenar por performance. Clique nos cabeçalhos para ordenar.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
