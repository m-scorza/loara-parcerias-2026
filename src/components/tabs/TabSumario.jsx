import { useData } from '../../context/DataContext'
import { formatCurrency } from '../../utils/format'
import StatCard from '../StatCard'
import EditableField from '../EditableField'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { Users, DollarSign, Briefcase, FileText, Target, AlertTriangle, Lightbulb } from 'lucide-react'

export default function TabSumario() {
  const { data } = useData()

  const chartData = data.metas_mensais.map(m => ({
    mes: m.mes,
    carteira: m.carteira_fim,
    receita: m.receita / 1000
  }))

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Objetivo Estratégico */}
      <div className="bg-gradient-to-r from-loara-600 via-loara-500 to-loara-600 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Target className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-3">{data.textos.titulo_objetivo}</h3>
            <p className="text-lg text-loara-100 leading-relaxed">
              Estabelecer um modelo operacional escalável, previsível e orientado por dados que
              permita à LOARA crescer de forma sustentável no segmento de parcerias.
            </p>
          </div>
        </div>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Carteira Final"
          value={data.totais_2026.carteira_final}
          subtitle="Parceiros ativos"
          trend={`+${data.crescimento.carteira}%`}
          trendDirection="up"
          color="loara"
          icon={Users}
          path="totais_2026.carteira_final"
          editable
        />
        <StatCard
          title="Receita Anual"
          value={data.totais_2026.receita}
          subtitle="Projeção 2026"
          trend={`+${data.crescimento.receita}%`}
          trendDirection="up"
          color="emerald"
          icon={DollarSign}
          formatter={formatCurrency}
          parser={parseFloat}
          path="totais_2026.receita"
          editable
        />
        <StatCard
          title="Captação Total"
          value={data.totais_2026.captacao}
          subtitle="Volume projetado"
          trend={`+${data.crescimento.captacao}%`}
          trendDirection="up"
          color="sky"
          icon={Briefcase}
          formatter={formatCurrency}
          parser={parseFloat}
          path="totais_2026.captacao"
          editable
        />
        <StatCard
          title="Contratos"
          value={data.totais_2026.contratos}
          subtitle="Meta anual"
          trend={`+${data.crescimento.contratos}%`}
          trendDirection="up"
          color="amber"
          icon={FileText}
          path="totais_2026.contratos"
          editable
        />
      </div>

      {/* Comparativo 2025 vs 2026 */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Baseline 2025 */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <span className="text-lg">📊</span>
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{data.textos.titulo_baseline}</h3>
              <p className="text-xs text-slate-500">{data.textos.titulo_baseline_desc}</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Carteira', value: data.valores_base.baseline_2025.carteira_inicial, path: 'valores_base.baseline_2025.carteira_inicial' },
              { label: 'Indicações', value: data.valores_base.baseline_2025.indicacoes, path: 'valores_base.baseline_2025.indicacoes' },
              { label: 'Contratos', value: data.valores_base.baseline_2025.contratos, path: 'valores_base.baseline_2025.contratos' },
              { label: 'Captação', value: data.valores_base.baseline_2025.captacao, path: 'valores_base.baseline_2025.captacao', format: formatCurrency },
              { label: 'Receita', value: data.valores_base.baseline_2025.receita, path: 'valores_base.baseline_2025.receita', format: formatCurrency, highlight: true },
            ].map((item, i) => (
              <div key={i} className={`flex justify-between items-center py-2 ${i < 4 ? 'border-b border-slate-100' : ''}`}>
                <span className="text-slate-600 text-sm">{item.label}</span>
                <span className={`font-bold tabular-nums ${item.highlight ? 'text-emerald-600' : ''}`}>
                  <EditableField
                    path={item.path}
                    value={item.value}
                    formatter={item.format || (v => v)}
                    parser={parseFloat}
                    type="number"
                  />
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Meta 2026 */}
        <div className="card p-6 border-2 border-loara-200 bg-gradient-to-br from-loara-50 to-white">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-loara-100 flex items-center justify-center">
              <span className="text-lg">🎯</span>
            </div>
            <div>
              <h3 className="font-bold text-loara-900">{data.textos.titulo_meta}</h3>
              <p className="text-xs text-loara-600">{data.textos.titulo_meta_desc}</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Carteira', value: data.totais_2026.carteira_final, path: 'totais_2026.carteira_final' },
              { label: 'Indicações', value: data.totais_2026.indicacoes, path: 'totais_2026.indicacoes' },
              { label: 'Contratos', value: data.totais_2026.contratos, path: 'totais_2026.contratos' },
              { label: 'Captação', value: data.totais_2026.captacao, path: 'totais_2026.captacao', format: formatCurrency },
              { label: 'Receita', value: data.totais_2026.receita, path: 'totais_2026.receita', format: formatCurrency, highlight: true },
            ].map((item, i) => (
              <div key={i} className={`flex justify-between items-center py-2 ${i < 4 ? 'border-b border-loara-100' : ''}`}>
                <span className="text-loara-700 text-sm">{item.label}</span>
                <span className={`font-bold tabular-nums ${item.highlight ? 'text-emerald-600 text-lg' : 'text-loara-900'}`}>
                  <EditableField
                    path={item.path}
                    value={item.value}
                    formatter={item.format || (v => v)}
                    parser={parseFloat}
                    type="number"
                  />
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Crescimento */}
        <div className="card p-6 bg-gradient-to-br from-emerald-50 to-white border border-emerald-200">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <span className="text-lg">📈</span>
            </div>
            <div>
              <h3 className="font-bold text-emerald-900">{data.textos.titulo_crescimento}</h3>
              <p className="text-xs text-emerald-600">{data.textos.titulo_crescimento_desc}</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Carteira', value: data.crescimento.carteira, path: 'crescimento.carteira' },
              { label: 'Indicações', value: data.crescimento.indicacoes, path: 'crescimento.indicacoes' },
              { label: 'Contratos', value: data.crescimento.contratos, path: 'crescimento.contratos' },
              { label: 'Captação', value: data.crescimento.captacao, path: 'crescimento.captacao' },
              { label: 'Receita', value: data.crescimento.receita, path: 'crescimento.receita', highlight: true },
            ].map((item, i) => (
              <div key={i} className={`flex justify-between items-center py-2 ${i < 4 ? 'border-b border-emerald-100' : item.highlight ? 'bg-emerald-100 -mx-2 px-2 rounded-lg' : ''}`}>
                <span className={`text-sm ${item.highlight ? 'text-emerald-800 font-semibold' : 'text-emerald-700'}`}>{item.label}</span>
                <span className={`font-bold text-emerald-600 tabular-nums ${item.highlight ? 'text-lg' : ''}`}>
                  +<EditableField
                    path={item.path}
                    value={item.value}
                    formatter={(v) => `${v}%`}
                    parser={parseFloat}
                    type="number"
                  />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gráfico de Evolução */}
      <div className="card p-6">
        <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
          <span className="text-lg">📈</span>
          {data.textos.titulo_graficos_evolucao}
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
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

      {/* Desafios e Oportunidades */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Desafios */}
        <div className="card p-6">
          <h3 className="font-bold text-rose-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            {data.textos.titulo_desafios}
          </h3>
          <div className="space-y-3">
            {data.desafios.slice(0, 4).map((d, i) => (
              <div key={i} className="p-4 bg-rose-50 rounded-xl border border-rose-100">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-rose-900 text-sm">{d.title}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    d.impact === 'Alto' ? 'bg-rose-200 text-rose-800' : 'bg-amber-200 text-amber-800'
                  }`}>
                    {d.impact}
                  </span>
                </div>
                <p className="text-xs text-rose-700">{d.quantified_impact}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Oportunidades */}
        <div className="card p-6">
          <h3 className="font-bold text-emerald-800 mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            {data.textos.titulo_oportunidades}
          </h3>
          <div className="space-y-3">
            {data.oportunidades.slice(0, 4).map((o, i) => (
              <div key={i} className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-emerald-900 text-sm">{o.title}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-200 text-emerald-800">
                    {o.timeline}
                  </span>
                </div>
                <p className="text-xs text-emerald-700">{o.potential_impact}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
