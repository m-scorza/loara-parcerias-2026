import { useData } from '../../context/DataContext'
import { formatCurrency } from '../../utils/format'
import EditableField from '../EditableField'
import { Star, Shield, Zap } from 'lucide-react'

const scenarioConfig = {
  conservador: {
    color: 'slate',
    gradient: 'from-slate-500 to-slate-600',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    icon: Shield,
  },
  moderado: {
    color: 'loara',
    gradient: 'from-loara-500 to-loara-600',
    bg: 'bg-loara-50',
    border: 'border-loara-300',
    ring: 'ring-4 ring-loara-100',
    recommended: true,
    icon: Star,
  },
  agressivo: {
    color: 'amber',
    gradient: 'from-amber-500 to-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: Zap,
  },
}

export default function TabCenarios() {
  const { data } = useData()

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <span className="text-2xl">🎯</span>
          {data.textos.titulo_cenarios}
        </h2>
        <p className="text-slate-500 mt-2">Comparativo entre os três cenários de planejamento para 2026</p>
      </div>

      {/* Cards de Cenários */}
      <div className="grid lg:grid-cols-3 gap-6">
        {Object.entries(data.cenarios).map(([key, scenario]) => {
          const config = scenarioConfig[key]
          const Icon = config.icon

          return (
            <div
              key={key}
              className={`card overflow-hidden ${config.recommended ? `border-2 ${config.border} ${config.ring}` : 'border'}`}
            >
              {/* Header */}
              <div className={`bg-gradient-to-r ${config.gradient} p-6 text-white`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">
                        <EditableField
                          path={`cenarios.${key}.nome`}
                          value={scenario.nome}
                          className="text-white"
                        />
                      </h3>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
                    Risco {scenario.risco}
                  </span>
                </div>
                <p className="text-sm opacity-90">{scenario.descricao}</p>
                {config.recommended && (
                  <span className="inline-flex items-center gap-1 mt-3 px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
                    <Star className="w-3 h-3" />
                    Recomendado
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-6 space-y-5">
                {/* Principais métricas */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-4 bg-slate-50 rounded-xl">
                    <div className="text-3xl font-bold text-slate-900">
                      <EditableField
                        path={`cenarios.${key}.carteira_final`}
                        value={scenario.carteira_final}
                        type="number"
                        parser={parseInt}
                      />
                    </div>
                    <div className="text-xs text-slate-500 mt-1">Carteira Final</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-xl">
                    <div className="text-3xl font-bold text-slate-900">
                      <EditableField
                        path={`cenarios.${key}.churn`}
                        value={scenario.churn}
                        formatter={(v) => `${v}%`}
                        type="number"
                        parser={parseInt}
                      />
                    </div>
                    <div className="text-xs text-slate-500 mt-1">Churn Meta</div>
                  </div>
                </div>

                {/* Detalhes */}
                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Novos Parceiros</span>
                    <span className="font-semibold">
                      <EditableField
                        path={`cenarios.${key}.novos`}
                        value={scenario.novos}
                        type="number"
                        parser={parseInt}
                      />
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Indicações</span>
                    <span className="font-semibold">
                      <EditableField
                        path={`cenarios.${key}.indicacoes`}
                        value={scenario.indicacoes}
                        type="number"
                        parser={parseInt}
                      />
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Contratos</span>
                    <span className="font-semibold">
                      <EditableField
                        path={`cenarios.${key}.contratos`}
                        value={scenario.contratos}
                        type="number"
                        parser={parseInt}
                      />
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Operações</span>
                    <span className="font-semibold">
                      <EditableField
                        path={`cenarios.${key}.operacoes`}
                        value={scenario.operacoes}
                        type="number"
                        parser={parseInt}
                      />
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Captação</span>
                    <span className="font-semibold">
                      <EditableField
                        path={`cenarios.${key}.captacao`}
                        value={scenario.captacao}
                        formatter={formatCurrency}
                        type="number"
                        parser={parseFloat}
                      />
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Margem</span>
                    <span className="font-semibold">
                      <EditableField
                        path={`cenarios.${key}.margem`}
                        value={scenario.margem}
                        formatter={(v) => `${v}%`}
                        type="number"
                        parser={parseFloat}
                      />
                    </span>
                  </div>
                </div>

                {/* Receita */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Receita Total</span>
                    <span className="text-2xl font-bold text-emerald-600">
                      <EditableField
                        path={`cenarios.${key}.receita`}
                        value={scenario.receita}
                        formatter={formatCurrency}
                        type="number"
                        parser={parseFloat}
                      />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tabela Comparativa */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">{data.textos.titulo_comparativo}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="p-4 text-left font-semibold text-slate-600">Métrica</th>
                <th className="p-4 text-center font-semibold text-slate-600">Conservador</th>
                <th className="p-4 text-center font-semibold text-loara-600 bg-loara-50">Moderado ⭐</th>
                <th className="p-4 text-center font-semibold text-amber-600">Agressivo</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Carteira Final', key: 'carteira_final' },
                { label: 'Novos Parceiros', key: 'novos' },
                { label: 'Churn Meta (%)', key: 'churn', suffix: '%' },
                { label: 'Indicações', key: 'indicacoes' },
                { label: 'Contratos', key: 'contratos' },
                { label: 'Operações', key: 'operacoes' },
                { label: 'Captação', key: 'captacao', format: formatCurrency },
                { label: 'Receita', key: 'receita', format: formatCurrency, highlight: true },
              ].map((row, i) => (
                <tr key={i} className={`border-b last:border-0 ${row.highlight ? 'bg-emerald-50/50' : 'hover:bg-slate-50'}`}>
                  <td className={`p-4 font-medium ${row.highlight ? 'text-emerald-800' : ''}`}>{row.label}</td>
                  {['conservador', 'moderado', 'agressivo'].map((cenario) => (
                    <td
                      key={cenario}
                      className={`p-4 text-center tabular-nums ${cenario === 'moderado' ? 'bg-loara-50/50 font-semibold' : ''} ${row.highlight ? 'text-emerald-700 font-bold' : ''}`}
                    >
                      {row.format
                        ? row.format(data.cenarios[cenario][row.key])
                        : `${data.cenarios[cenario][row.key]}${row.suffix || ''}`
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
