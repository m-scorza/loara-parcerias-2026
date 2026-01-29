import { useData } from '../../context/DataContext'
import EditableField from '../EditableField'
import { AlertTriangle, Shield, AlertCircle, Activity } from 'lucide-react'

const getRiskLevel = (probability, impact) => {
  const score = (probability * impact) / 100
  if (score >= 3) return { level: 'CRÍTICO', color: 'rose', score }
  if (score >= 2) return { level: 'ALTO', color: 'amber', score }
  return { level: 'MÉDIO', color: 'loara', score }
}

const riskColors = {
  CRÍTICO: {
    bg: 'bg-rose-50',
    border: 'border-l-rose-500',
    badge: 'bg-rose-200 text-rose-800',
    text: 'text-rose-600'
  },
  ALTO: {
    bg: 'bg-amber-50',
    border: 'border-l-amber-500',
    badge: 'bg-amber-200 text-amber-800',
    text: 'text-amber-600'
  },
  MÉDIO: {
    bg: 'bg-loara-50',
    border: 'border-l-loara-500',
    badge: 'bg-loara-200 text-loara-800',
    text: 'text-loara-600'
  }
}

export default function TabRiscos() {
  const { data } = useData()

  // Ordenar riscos por score decrescente
  const sortedRiscos = [...data.riscos].sort((a, b) => {
    const scoreA = (a.probability * a.impact) / 100
    const scoreB = (b.probability * b.impact) / 100
    return scoreB - scoreA
  })

  const riskSummary = {
    critico: sortedRiscos.filter(r => getRiskLevel(r.probability, r.impact).level === 'CRÍTICO').length,
    alto: sortedRiscos.filter(r => getRiskLevel(r.probability, r.impact).level === 'ALTO').length,
    medio: sortedRiscos.filter(r => getRiskLevel(r.probability, r.impact).level === 'MÉDIO').length,
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          {data.textos.titulo_riscos}
        </h2>
        <p className="text-slate-500 mt-2">Análise e mitigação de riscos identificados para 2026</p>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-5 text-center border-l-4 border-l-rose-500">
          <div className="text-3xl font-bold text-rose-600">{riskSummary.critico}</div>
          <div className="text-sm text-slate-600 mt-1">Riscos Críticos</div>
        </div>
        <div className="card p-5 text-center border-l-4 border-l-amber-500">
          <div className="text-3xl font-bold text-amber-600">{riskSummary.alto}</div>
          <div className="text-sm text-slate-600 mt-1">Riscos Altos</div>
        </div>
        <div className="card p-5 text-center border-l-4 border-l-loara-500">
          <div className="text-3xl font-bold text-loara-600">{riskSummary.medio}</div>
          <div className="text-sm text-slate-600 mt-1">Riscos Médios</div>
        </div>
      </div>

      {/* Lista de Riscos */}
      <div className="space-y-4">
        {sortedRiscos.map((r, i) => {
          const riskIndex = data.riscos.findIndex(risk => risk.id === r.id)
          const { level, score } = getRiskLevel(r.probability, r.impact)
          const colors = riskColors[level]

          return (
            <div
              key={i}
              className={`card ${colors.bg} ${colors.border} border-l-4 p-6`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                {/* Conteúdo Principal */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="text-sm font-bold text-slate-500">{r.id}</span>
                    <h3 className="font-bold text-slate-900">{r.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors.badge}`}>
                      {level}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-600 mb-2 flex items-center gap-1">
                        <Shield className="w-4 h-4 text-emerald-500" />
                        Mitigação
                      </h4>
                      <p className="text-sm text-slate-700 bg-white/50 p-3 rounded-lg">
                        {r.mitigation}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-600 mb-2 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                        Contingência
                      </h4>
                      <p className="text-sm text-slate-700 bg-white/50 p-3 rounded-lg">
                        {r.contingency}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Métricas */}
                <div className="flex lg:flex-col gap-6 lg:gap-4 lg:items-end lg:min-w-[150px]">
                  <div className="text-center lg:text-right">
                    <div className="text-xs text-slate-500 mb-1">Probabilidade</div>
                    <div className="text-2xl font-bold text-slate-900">
                      <EditableField
                        path={`riscos[${riskIndex}].probability`}
                        value={r.probability}
                        formatter={(v) => `${v}%`}
                        type="number"
                        parser={parseInt}
                      />
                    </div>
                    <div className="h-2 w-24 bg-slate-200 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-slate-500 rounded-full"
                        style={{ width: `${r.probability}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-center lg:text-right">
                    <div className="text-xs text-slate-500 mb-1">Impacto</div>
                    <div className="text-2xl font-bold text-slate-900">
                      <EditableField
                        path={`riscos[${riskIndex}].impact`}
                        value={r.impact}
                        formatter={(v) => `${v}/10`}
                        type="number"
                        parser={parseInt}
                      />
                    </div>
                    <div className="h-2 w-24 bg-slate-200 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-slate-600 rounded-full"
                        style={{ width: `${r.impact * 10}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-center lg:text-right">
                    <div className="text-xs text-slate-500 mb-1">Score</div>
                    <div className={`text-2xl font-bold ${colors.text}`}>
                      {score.toFixed(1)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Legenda */}
      <div className="card p-6">
        <h3 className="font-bold text-slate-900 mb-4">Como interpretar</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 bg-slate-50 rounded-xl">
            <h4 className="font-semibold text-slate-700 mb-2">Cálculo do Score</h4>
            <p className="text-slate-600">Score = (Probabilidade × Impacto) / 100</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl">
            <h4 className="font-semibold text-slate-700 mb-2">Níveis de Risco</h4>
            <ul className="space-y-1 text-slate-600">
              <li><span className="text-rose-600 font-medium">Crítico:</span> Score ≥ 3.0</li>
              <li><span className="text-amber-600 font-medium">Alto:</span> Score ≥ 2.0</li>
              <li><span className="text-loara-600 font-medium">Médio:</span> Score &lt; 2.0</li>
            </ul>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl">
            <h4 className="font-semibold text-slate-700 mb-2">Ação Necessária</h4>
            <p className="text-slate-600">Riscos críticos e altos exigem monitoramento contínuo e planos de contingência ativos.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
