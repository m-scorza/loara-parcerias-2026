import { useData } from '../../context/DataContext'
import { BarChart3, Target, Clock, Calculator } from 'lucide-react'

const kpiColors = [
  { bg: 'bg-gradient-to-br from-loara-500 to-loara-600', light: 'bg-loara-50', border: 'border-loara-200' },
  { bg: 'bg-gradient-to-br from-emerald-500 to-emerald-600', light: 'bg-emerald-50', border: 'border-emerald-200' },
  { bg: 'bg-gradient-to-br from-sky-500 to-sky-600', light: 'bg-sky-50', border: 'border-sky-200' },
  { bg: 'bg-gradient-to-br from-amber-500 to-amber-600', light: 'bg-amber-50', border: 'border-amber-200' },
  { bg: 'bg-gradient-to-br from-violet-500 to-violet-600', light: 'bg-violet-50', border: 'border-violet-200' },
  { bg: 'bg-gradient-to-br from-rose-500 to-rose-600', light: 'bg-rose-50', border: 'border-rose-200' },
  { bg: 'bg-gradient-to-br from-teal-500 to-teal-600', light: 'bg-teal-50', border: 'border-teal-200' },
  { bg: 'bg-gradient-to-br from-indigo-500 to-indigo-600', light: 'bg-indigo-50', border: 'border-indigo-200' },
]

export default function TabKPIs() {
  const { data } = useData()

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <span className="text-2xl">📊</span>
          {data.textos.titulo_kpis}
        </h2>
        <p className="text-slate-500 mt-2">Métricas de acompanhamento e metas para a área de parcerias</p>
      </div>

      {/* Grid de KPIs */}
      <div className="grid md:grid-cols-2 gap-4">
        {data.kpis.map((k, i) => {
          const colors = kpiColors[i % kpiColors.length]

          return (
            <div key={i} className={`card overflow-hidden card-hover border ${colors.border}`}>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center text-white shadow-lg`}>
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{k.nome}</h3>
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500 mt-1">
                        <Clock className="w-3 h-3" />
                        {k.frequencia}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`p-4 ${colors.light} rounded-xl mb-4`}>
                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                    <Calculator className="w-4 h-4" />
                    Fórmula
                  </div>
                  <code className="text-sm font-mono text-slate-800">{k.formula}</code>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Target className="w-4 h-4" />
                    Meta
                  </div>
                  <div className="text-2xl font-bold text-loara-600">{k.meta}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tabela Resumo */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">Resumo dos Indicadores</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="p-4 text-left font-semibold text-slate-600">Indicador</th>
                <th className="p-4 text-left font-semibold text-slate-600">Fórmula</th>
                <th className="p-4 text-center font-semibold text-slate-600">Meta</th>
                <th className="p-4 text-center font-semibold text-slate-600">Frequência</th>
              </tr>
            </thead>
            <tbody>
              {data.kpis.map((k, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-900">{k.nome}</td>
                  <td className="p-4 text-sm text-slate-600 font-mono">{k.formula}</td>
                  <td className="p-4 text-center">
                    <span className="inline-flex px-3 py-1 bg-loara-100 text-loara-700 rounded-full text-sm font-semibold">
                      {k.meta}
                    </span>
                  </td>
                  <td className="p-4 text-center text-slate-600">{k.frequencia}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
