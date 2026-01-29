import { useState, useMemo } from 'react'
import { useData } from '../../context/DataContext'
import { formatCurrency } from '../../utils/format'
import StatCard from '../StatCard'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import {
  Users, UserCheck, DollarSign, Briefcase, Star, Search,
  Filter, AlertTriangle, CheckCircle2, Clock, TrendingUp,
  ChevronDown, ChevronUp
} from 'lucide-react'

const CATEGORY_COLORS = {
  'Ouro': '#F59E0B',
  'Prata': '#64748b',
  'Bronze': '#CD7F32'
}

const STATUS_COLORS = {
  'Ativado': '#10B981',
  'Descadastramento': '#F59E0B',
  'Desativado': '#64748b',
  'Exclusão': '#F43F5E'
}

export default function TabDiagnostico() {
  const { data, updateData } = useData()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('todos')
  const [filterStatus, setFilterStatus] = useState('ativos')
  const [sortBy, setSortBy] = useState('nome')
  const [showFilters, setShowFilters] = useState(false)

  // Dados dos parceiros
  const parceiros = useMemo(() => {
    return data.parceiros_lista || []
  }, [data.parceiros_lista])

  // Filtros e ordenação
  const filteredParceiros = useMemo(() => {
    let result = [...parceiros]

    // Filtro por busca
    if (searchTerm) {
      result = result.filter(p =>
        p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.email && p.email.toLowerCase().includes(searchTerm.toLowerCase()))
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
    }

    // Ordenação
    result.sort((a, b) => {
      if (sortBy === 'nome') return a.nome.localeCompare(b.nome)
      if (sortBy === 'categoria') {
        const order = { 'Ouro': 0, 'Prata': 1, 'Bronze': 2 }
        return order[a.tipoParceria] - order[b.tipoParceria]
      }
      if (sortBy === 'indicacoes') return (b.indicacoes || 0) - (a.indicacoes || 0)
      if (sortBy === 'resultado') return (b.resultado || 0) - (a.resultado || 0)
      return 0
    })

    return result
  }, [parceiros, searchTerm, filterCategory, filterStatus, sortBy])

  // Estatísticas calculadas
  const stats = useMemo(() => {
    const ativos = parceiros.filter(p => p.status === 'Ativado')
    const ativosOuroPrata = ativos.filter(p => p.tipoParceria === 'Ouro' || p.tipoParceria === 'Prata')
    const comIndicacoes = ativos.filter(p => (p.indicacoes || 0) > 0)
    const comResultado = ativos.filter(p => (p.resultado || 0) > 0)
    const semIndicar45dias = ativos.filter(p => p.diasSemIndicar > 45)
    const highPerformers = parceiros.filter(p => p.highPerformer)

    return {
      totalParceiros: parceiros.length,
      ativos: ativos.length,
      ativosOuroPrata: ativosOuroPrata.length,
      ouro: parceiros.filter(p => p.tipoParceria === 'Ouro' && p.status === 'Ativado').length,
      prata: parceiros.filter(p => p.tipoParceria === 'Prata' && p.status === 'Ativado').length,
      bronze: parceiros.filter(p => p.tipoParceria === 'Bronze' && p.status === 'Ativado').length,
      comIndicacoes: comIndicacoes.length,
      semIndicacoes: ativos.length - comIndicacoes.length,
      comResultado: comResultado.length,
      semResultado: ativos.length - comResultado.length,
      semIndicar45dias: semIndicar45dias.length,
      highPerformers: highPerformers.length,
      taxaAtivacao: ativos.length > 0 ? Math.round((comIndicacoes.length / ativos.length) * 100) : 0,
      taxaConversao: comIndicacoes.length > 0 ? Math.round((comResultado.length / comIndicacoes.length) * 100) : 0
    }
  }, [parceiros])

  // Toggle High Performer
  const toggleHighPerformer = (parceiroId) => {
    const index = parceiros.findIndex(p => p.id === parceiroId)
    if (index !== -1) {
      const newValue = !parceiros[index].highPerformer
      updateData(`parceiros_lista[${index}].highPerformer`, newValue)
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
    { name: 'Com Resultado', value: stats.comResultado, fill: '#6370f1' },
    { name: 'Sem Resultado', value: stats.semResultado, fill: '#94a3b8' },
  ]

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <span className="text-2xl">🔍</span>
          Diagnóstico da Carteira
        </h2>
        <p className="text-slate-500 mt-2">
          Análise detalhada dos parceiros Ouro e Prata ativos
        </p>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Parceiros Ativos"
          value={stats.ativos}
          subtitle={`${stats.ativosOuroPrata} Ouro/Prata`}
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
          title="Sem Indicar +45 dias"
          value={stats.semIndicar45dias}
          subtitle="Precisam de atenção"
          color="amber"
          icon={AlertTriangle}
        />
      </div>

      {/* Cards de Alertas */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-5 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-500">High Performers</div>
              <div className="text-3xl font-bold text-emerald-600">{stats.highPerformers}</div>
            </div>
            <Star className="w-10 h-10 text-emerald-500 fill-emerald-500" />
          </div>
          <p className="text-xs text-slate-400 mt-2">Parceiros marcados como alta performance</p>
        </div>

        <div className="card p-5 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-500">Parceiros Ouro Ativos</div>
              <div className="text-3xl font-bold text-amber-600">{stats.ouro}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <span className="text-lg">🥇</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">Top performers da carteira</p>
        </div>

        <div className="card p-5 border-l-4 border-l-slate-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-500">Parceiros Prata Ativos</div>
              <div className="text-3xl font-bold text-slate-600">{stats.prata}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
              <span className="text-lg">🥈</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">Parceiros em desenvolvimento</p>
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
                {filteredParceiros.length}
              </span>
            </h3>

            {/* Search */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar parceiro..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-loara-500 w-64"
                />
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
                  <option value="todos">Todas</option>
                  <option value="Ouro">Ouro</option>
                  <option value="Prata">Prata</option>
                  <option value="Bronze">Bronze</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-loara-500"
                >
                  <option value="ativos">Apenas Ativos</option>
                  <option value="inativos">Apenas Inativos</option>
                  <option value="todos">Todos</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Ordenar por</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-loara-500"
                >
                  <option value="nome">Nome</option>
                  <option value="categoria">Categoria</option>
                  <option value="indicacoes">Indicações</option>
                  <option value="resultado">Resultado</option>
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
                <th className="p-4 text-left font-semibold text-slate-600">Parceiro</th>
                <th className="p-4 text-center font-semibold text-slate-600">Categoria</th>
                <th className="p-4 text-center font-semibold text-slate-600">Status</th>
                <th className="p-4 text-center font-semibold text-slate-600">Indicações</th>
                <th className="p-4 text-center font-semibold text-slate-600">Resultado</th>
                <th className="p-4 text-center font-semibold text-slate-600">Última Indicação</th>
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
                filteredParceiros.map((p, i) => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
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
                        {p.tipoParceria}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          p.status === 'Ativado'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {p.status || 'N/A'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`font-bold ${(p.indicacoes || 0) > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {p.indicacoes || 0}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {(p.resultado || 0) > 0 ? (
                        <span className="font-bold text-loara-600">{formatCurrency(p.resultado)}</span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {p.diasSemIndicar !== undefined ? (
                        <span className={`text-sm ${p.diasSemIndicar > 45 ? 'text-rose-600 font-medium' : 'text-slate-600'}`}>
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
                        <span className="text-slate-400">-</span>
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
            <p className="text-slate-600">Parceiros marcados em vermelho na última indicação estão há mais de 45 dias sem indicar e precisam de um contato.</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl">
            <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Filter className="w-4 h-4 text-loara-500" />
              Filtros
            </h4>
            <p className="text-slate-600">Use os filtros para encontrar parceiros específicos por categoria, status ou ordenar por performance.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
