import { useData } from '../../context/DataContext'
import { Building2, Users, Clock, Target, Calendar, User } from 'lucide-react'

const forumColors = [
  { gradient: 'from-sky-500 to-sky-600', bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700' },
  { gradient: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
  { gradient: 'from-amber-500 to-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
  { gradient: 'from-violet-500 to-violet-600', bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700' },
]

export default function TabGovernanca() {
  const { data } = useData()

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <span className="text-2xl">🏛️</span>
          Governança
        </h2>
        <p className="text-slate-500 mt-2">Estrutura de fóruns e calendário mensal de atividades</p>
      </div>

      {/* Fóruns de Governança */}
      <div>
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-loara-500" />
          {data.textos.titulo_foruns}
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {data.governanca.foruns.map((f, i) => {
            const colors = forumColors[i % forumColors.length]

            return (
              <div key={i} className={`card overflow-hidden border ${colors.border}`}>
                <div className={`bg-gradient-to-r ${colors.gradient} p-5 text-white`}>
                  <h4 className="text-lg font-bold">{f.nome}</h4>
                  <p className="text-sm opacity-90 mt-1">{f.objetivo}</p>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center`}>
                      <Users className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Participantes</div>
                      <div className="font-medium text-slate-900">{f.participantes}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center`}>
                      <Calendar className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Frequência</div>
                      <div className="font-medium text-slate-900">{f.frequencia}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center`}>
                      <Clock className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Duração</div>
                      <div className="font-medium text-slate-900">{f.duracao}</div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Calendário Mensal */}
      <div className="card p-6">
        <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-loara-500" />
          {data.textos.titulo_calendario}
        </h3>

        {/* Timeline Visual */}
        <div className="relative">
          {/* Linha do tempo */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200"></div>

          <div className="space-y-4">
            {data.governanca.calendario_mensal.map((c, i) => (
              <div key={i} className="relative flex items-start gap-6 pl-4">
                {/* Marcador */}
                <div className="relative z-10 w-5 h-5 rounded-full bg-loara-500 border-4 border-white shadow flex-shrink-0"></div>

                {/* Conteúdo */}
                <div className="flex-1 -mt-1">
                  <div className="card p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex px-3 py-1 bg-loara-100 text-loara-700 rounded-full text-sm font-bold">
                          {c.dia}
                        </span>
                        <span className="font-medium text-slate-900">{c.atividade}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <User className="w-4 h-4" />
                        {c.responsavel}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabela de Calendário */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">Visão em Tabela</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="p-4 text-left font-semibold text-slate-600">Dia</th>
                <th className="p-4 text-left font-semibold text-slate-600">Atividade</th>
                <th className="p-4 text-left font-semibold text-slate-600">Responsável</th>
              </tr>
            </thead>
            <tbody>
              {data.governanca.calendario_mensal.map((c, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <span className="inline-flex px-3 py-1 bg-loara-100 text-loara-700 rounded-full text-sm font-semibold">
                      {c.dia}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-slate-900">{c.atividade}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-2 text-slate-600">
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium">
                        {c.responsavel.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      {c.responsavel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
