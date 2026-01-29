import { useData } from '../../context/DataContext'
import { formatCurrency } from '../../utils/format'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart
} from 'recharts'
import { BarChart3, TrendingUp, PieChartIcon, Activity } from 'lucide-react'

const COLORS = ['#6370f1', '#10B981', '#F59E0B', '#F43F5E', '#8B5CF6', '#06B6D4']

export default function TabGraficos() {
  const { data } = useData()

  // Dados para gráficos mensais
  const dadosMensais = data.metas_mensais.map(m => ({
    mes: m.mes,
    carteira: m.carteira_fim,
    novos: m.novos,
    churn: m.churn,
    indicacoes: m.indicacoes,
    contratos: m.contratos,
    receita: m.receita / 1000,
    captacao: m.captacao / 1000000
  }))

  // Dados trimestrais
  const dadosTrimestrais = data.metas_trimestrais.map(t => ({
    trimestre: t.trimestre,
    novos: t.novos,
    churn: t.churn,
    indicacoes: t.indicacoes,
    contratos: t.contratos,
    receita: t.receita / 1000
  }))

  // Dados de cenários para comparação
  const dadosCenarios = Object.entries(data.cenarios).map(([key, c]) => ({
    nome: c.nome,
    carteira: c.carteira_final,
    receita: c.receita / 1000000,
    captacao: c.captacao / 1000000000,
    roi: c.roi
  }))

  // Composição da carteira por categoria (simulado baseado nos dados)
  const composicaoCarteira = [
    { name: 'Ouro', value: 4, color: '#F59E0B' },
    { name: 'Prata', value: 35, color: '#64748b' },
    { name: 'Bronze', value: 27, color: '#CD7F32' },
  ]

  // Funil de conversão
  const funilConversao = [
    { etapa: 'Parceiros Ativos', valor: 66, percent: 100 },
    { etapa: 'Com Indicações', valor: 45, percent: 68 },
    { etapa: 'Geraram Negócio', valor: 32, percent: 48 },
    { etapa: 'Fecharam Contrato', valor: 18, percent: 27 },
  ]

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <span className="text-2xl">📊</span>
          Gráficos e Análises
        </h2>
        <p className="text-slate-500 mt-2">Visualizações detalhadas do planejamento 2026</p>
      </div>

      {/* Evolução da Carteira */}
      <div className="card p-6">
        <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-loara-500" />
          Evolução da Carteira 2026
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dadosMensais}>
              <defs>
                <linearGradient id="colorCarteira" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6370f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6370f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="mes" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
                formatter={(value) => [value, 'Parceiros']}
              />
              <Area
                type="monotone"
                dataKey="carteira"
                stroke="#6370f1"
                strokeWidth={3}
                fill="url(#colorCarteira)"
                name="Carteira"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid de gráficos menores */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Novos vs Churn */}
        <div className="card p-6">
          <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-500" />
            Novos vs Churn (Mensal)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosMensais}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="mes" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
                <Bar dataKey="novos" name="Novos" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="churn" name="Churn" fill="#F43F5E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Indicações e Contratos */}
        <div className="card p-6">
          <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-sky-500" />
            Indicações e Contratos (Mensal)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dadosMensais}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="mes" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="indicacoes"
                  name="Indicações"
                  stroke="#6370f1"
                  strokeWidth={2}
                  dot={{ fill: '#6370f1' }}
                />
                <Line
                  type="monotone"
                  dataKey="contratos"
                  name="Contratos"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: '#10B981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Receita e Captação */}
      <div className="card p-6">
        <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-amber-500" />
          Receita Mensal (R$ mil)
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={dadosMensais}>
              <defs>
                <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="mes" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
                formatter={(value) => [`R$ ${value.toFixed(0)}K`, '']}
              />
              <Area
                type="monotone"
                dataKey="receita"
                fill="url(#colorReceita)"
                stroke="#10B981"
                strokeWidth={2}
                name="Receita (R$ mil)"
              />
              <Line
                type="monotone"
                dataKey="receita"
                stroke="#059669"
                strokeWidth={3}
                dot={{ fill: '#059669', strokeWidth: 2 }}
                name="Tendência"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparativo por Trimestre */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-violet-500" />
            Performance Trimestral
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosTrimestrais}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="trimestre" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
                <Bar dataKey="novos" name="Novos" fill="#6370f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="indicacoes" name="Indicações" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="contratos" name="Contratos" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Composição da Carteira */}
        <div className="card p-6">
          <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-loara-500" />
            Composição da Carteira Atual
          </h3>
          <div className="flex items-center gap-8">
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={composicaoCarteira}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    stroke="none"
                  >
                    {composicaoCarteira.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-4">
              {composicaoCarteira.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-slate-600 font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">{item.value}</span>
                </div>
              ))}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 font-semibold">Total Ativos</span>
                  <span className="font-bold text-loara-600 text-lg">66</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparativo de Cenários */}
      <div className="card p-6">
        <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-rose-500" />
          Comparativo de Cenários
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dadosCenarios} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#64748b" fontSize={12} />
              <YAxis dataKey="nome" type="category" width={100} stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              />
              <Legend />
              <Bar dataKey="carteira" name="Carteira Final" fill="#6370f1" radius={[0, 4, 4, 0]} />
              <Bar dataKey="roi" name="ROI (%)" fill="#10B981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Funil de Conversão */}
      <div className="card p-6">
        <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-loara-500" />
          Funil de Conversão
        </h3>
        <div className="max-w-2xl mx-auto space-y-3">
          {funilConversao.map((item, i) => (
            <div key={i} className="relative">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-slate-700">{item.etapa}</span>
                <span className="font-bold text-slate-900">{item.valor} ({item.percent}%)</span>
              </div>
              <div className="h-10 bg-slate-100 rounded-lg overflow-hidden">
                <div
                  className="h-full rounded-lg transition-all duration-500 flex items-center justify-end pr-3"
                  style={{
                    width: `${item.percent}%`,
                    background: `linear-gradient(90deg, ${COLORS[i]} 0%, ${COLORS[i]}CC 100%)`
                  }}
                >
                  <span className="text-white text-sm font-semibold">{item.valor}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
