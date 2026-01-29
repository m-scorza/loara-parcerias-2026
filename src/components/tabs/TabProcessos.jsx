import { useData } from '../../context/DataContext'
import { Settings, UserPlus, ClipboardCheck, ArrowRight, Clock, User, CheckCircle2 } from 'lucide-react'

export default function TabProcessos() {
  const { data } = useData()

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <span className="text-2xl">⚙️</span>
          Processos Operacionais
        </h2>
        <p className="text-slate-500 mt-2">Fluxos e procedimentos padronizados da área de parcerias</p>
      </div>

      {/* Processo de Prospecção */}
      <div className="card p-6">
        <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Settings className="w-5 h-5 text-loara-500" />
          {data.textos.titulo_prospeccao}
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.processos.prospeccao.map((p, i) => (
            <div key={i} className="relative">
              <div className="card p-4 h-full bg-gradient-to-br from-slate-50 to-white border border-slate-200 hover:border-loara-300 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-loara-500 to-loara-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {p.passo}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 text-sm mb-1">{p.acao}</h4>
                    <p className="text-xs text-slate-500 mb-2">{p.ferramenta}</p>
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-loara-100 text-loara-700 rounded-full text-xs">
                      <Clock className="w-3 h-3" />
                      {p.tempo}
                    </div>
                  </div>
                </div>
              </div>
              {i < data.processos.prospeccao.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Processo de Onboarding */}
      <div className="card p-6">
        <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-emerald-500" />
          {data.textos.titulo_onboarding}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {data.processos.onboarding.map((o, i) => (
            <div
              key={i}
              className="p-4 bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-100 text-center hover:shadow-md transition-shadow"
            >
              <div className="inline-flex px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full mb-3">
                {o.dia}
              </div>
              <div className="text-sm font-medium text-slate-900 mb-2">{o.atividade}</div>
              <div className="inline-flex items-center gap-1 text-xs text-slate-500">
                <User className="w-3 h-3" />
                {o.responsavel}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Framework de Scoring */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-amber-500" />
            {data.textos.titulo_scoring}
          </h3>
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            {data.textos.titulo_scoring_desc}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="p-4 text-left font-semibold text-slate-600">Critério</th>
                <th className="p-4 text-center font-semibold text-slate-600">Peso</th>
                <th className="p-4 text-left font-semibold text-rose-600">0 Pontos</th>
                <th className="p-4 text-left font-semibold text-emerald-600">10 Pontos</th>
              </tr>
            </thead>
            <tbody>
              {data.processos.scoring.map((s, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <span className="font-medium text-slate-900">{s.criterio}</span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex px-3 py-1 bg-loara-100 text-loara-700 rounded-full text-sm font-semibold">
                      {s.peso}%
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-rose-600 bg-rose-50 px-2 py-1 rounded">
                      {s.pontos_0}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                      {s.pontos_10}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Barra de pesos */}
        <div className="mt-6 p-4 bg-slate-50 rounded-xl">
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Distribuição de Pesos</h4>
          <div className="flex h-6 rounded-full overflow-hidden">
            {data.processos.scoring.map((s, i) => {
              const colors = [
                'bg-loara-500', 'bg-emerald-500', 'bg-amber-500',
                'bg-sky-500', 'bg-violet-500', 'bg-rose-500'
              ]
              return (
                <div
                  key={i}
                  className={`${colors[i % colors.length]} flex items-center justify-center text-xs text-white font-medium`}
                  style={{ width: `${s.peso}%` }}
                  title={`${s.criterio}: ${s.peso}%`}
                >
                  {s.peso}%
                </div>
              )
            })}
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {data.processos.scoring.map((s, i) => {
              const colors = [
                'bg-loara-500', 'bg-emerald-500', 'bg-amber-500',
                'bg-sky-500', 'bg-violet-500', 'bg-rose-500'
              ]
              return (
                <div key={i} className="flex items-center gap-1 text-xs text-slate-600">
                  <div className={`w-3 h-3 rounded ${colors[i % colors.length]}`}></div>
                  {s.criterio}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
