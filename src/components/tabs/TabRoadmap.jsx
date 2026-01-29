import { useData } from '../../context/DataContext'
import { useState } from 'react'
import { Map, ChevronDown, ChevronUp, Target, Calendar, User, FileText } from 'lucide-react'

const quarterColors = [
  { gradient: 'from-sky-500 to-sky-600', bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700', light: 'bg-sky-100' },
  { gradient: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', light: 'bg-emerald-100' },
  { gradient: 'from-amber-500 to-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', light: 'bg-amber-100' },
  { gradient: 'from-violet-500 to-violet-600', bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700', light: 'bg-violet-100' },
]

export default function TabRoadmap() {
  const { data } = useData()
  const [expandedQuarter, setExpandedQuarter] = useState('Q1')

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <span className="text-2xl">🗺️</span>
          {data.textos.titulo_roadmap}
        </h2>
        <p className="text-slate-500 mt-2">Cronograma de atividades e entregas planejadas para o ano</p>
      </div>

      {/* Timeline Visual */}
      <div className="hidden lg:flex items-center justify-between card p-6">
        {data.roadmap.map((q, i) => {
          const colors = quarterColors[i]
          return (
            <div key={i} className="flex-1 relative">
              <div className="flex flex-col items-center">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                  {q.quarter}
                </div>
                <div className="mt-3 text-center">
                  <div className="font-semibold text-slate-900">{q.foco}</div>
                  <div className="text-xs text-slate-500">{q.periodo}</div>
                  <div className={`mt-2 inline-flex px-3 py-1 ${colors.light} ${colors.text} rounded-full text-xs font-medium`}>
                    +{q.meta_novos} novos
                  </div>
                </div>
              </div>
              {i < data.roadmap.length - 1 && (
                <div className="absolute top-8 left-1/2 w-full h-1 bg-slate-200">
                  <div className={`h-full bg-gradient-to-r ${colors.gradient}`} style={{ width: '100%' }}></div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Accordion de Quarters */}
      <div className="space-y-4">
        {data.roadmap.map((q, i) => {
          const colors = quarterColors[i]
          const isExpanded = expandedQuarter === q.quarter

          return (
            <div key={i} className={`card overflow-hidden border ${colors.border}`}>
              {/* Header */}
              <button
                onClick={() => setExpandedQuarter(isExpanded ? null : q.quarter)}
                className={`w-full p-6 flex items-center justify-between transition-colors ${isExpanded ? colors.bg : 'hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                    {q.quarter}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-slate-900 text-lg">{q.foco}</h3>
                      <span className={`px-3 py-1 ${colors.light} ${colors.text} rounded-full text-xs font-semibold`}>
                        +{q.meta_novos} novos parceiros
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">{q.periodo}</p>
                  </div>
                </div>
                <div className={`p-2 rounded-lg ${isExpanded ? colors.light : 'bg-slate-100'}`}>
                  {isExpanded ? (
                    <ChevronUp className={`w-5 h-5 ${colors.text}`} />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Content */}
              {isExpanded && (
                <div className="p-6 border-t border-slate-100">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50">
                          <th className="p-3 text-left font-semibold text-slate-600 text-sm">Semana</th>
                          <th className="p-3 text-left font-semibold text-slate-600 text-sm">Atividade</th>
                          <th className="p-3 text-left font-semibold text-slate-600 text-sm">Responsável</th>
                          <th className="p-3 text-left font-semibold text-slate-600 text-sm">Entregável</th>
                        </tr>
                      </thead>
                      <tbody>
                        {q.atividades.map((a, j) => (
                          <tr key={j} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                            <td className="p-3">
                              <span className={`inline-flex px-2 py-1 ${colors.light} ${colors.text} rounded text-xs font-semibold`}>
                                {a.semana}
                              </span>
                            </td>
                            <td className="p-3 font-medium text-slate-900">{a.atividade}</td>
                            <td className="p-3">
                              <span className="inline-flex items-center gap-1 text-sm text-slate-600">
                                <User className="w-3 h-3" />
                                {a.responsavel}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className="inline-flex items-center gap-1 text-sm text-slate-600">
                                <FileText className="w-3 h-3" />
                                {a.entregavel}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Resumo do Quarter */}
                  <div className={`mt-4 p-4 ${colors.bg} rounded-xl`}>
                    <div className="flex items-center justify-between text-sm">
                      <span className={colors.text}>Total de atividades: <strong>{q.atividades.length}</strong></span>
                      <span className={colors.text}>Meta do trimestre: <strong>+{q.meta_novos} novos parceiros</strong></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Resumo Anual */}
      <div className="card p-6">
        <h3 className="font-bold text-slate-900 mb-4">Resumo Anual</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.roadmap.map((q, i) => {
            const colors = quarterColors[i]
            return (
              <div key={i} className={`p-4 ${colors.bg} rounded-xl text-center`}>
                <div className={`text-2xl font-bold ${colors.text}`}>{q.quarter}</div>
                <div className="text-sm text-slate-600 mt-1">{q.foco}</div>
                <div className="text-xs text-slate-500 mt-1">{q.atividades.length} atividades</div>
                <div className={`mt-2 text-lg font-bold ${colors.text}`}>+{q.meta_novos}</div>
              </div>
            )
          })}
        </div>
        <div className="mt-4 p-4 bg-loara-50 rounded-xl text-center">
          <span className="text-loara-700">
            Total de novos parceiros planejados: <strong className="text-2xl ml-2">{data.roadmap.reduce((acc, q) => acc + q.meta_novos, 0)}</strong>
          </span>
        </div>
      </div>
    </div>
  )
}
