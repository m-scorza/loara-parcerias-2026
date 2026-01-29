import { useData } from '../../context/DataContext'
import { formatCurrency } from '../../utils/format'
import EditableField from '../EditableField'
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const quarterColors = [
  { gradient: 'from-sky-500 to-sky-600', bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700' },
  { gradient: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
  { gradient: 'from-amber-500 to-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
  { gradient: 'from-violet-500 to-violet-600', bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700' },
]

export default function TabMetas() {
  const { data } = useData()

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <span className="text-2xl">📈</span>
          Metas 2026
        </h2>
        <p className="text-slate-500 mt-2">Detalhamento trimestral e mensal das metas de crescimento</p>
      </div>

      {/* Cards Trimestrais */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.metas_trimestrais.map((t, i) => {
          const colors = quarterColors[i]
          return (
            <div key={i} className="card overflow-hidden">
              <div className={`bg-gradient-to-r ${colors.gradient} p-5 text-white`}>
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-bold">{t.trimestre}</span>
                  <span className="text-xs opacity-80 bg-white/20 px-2 py-1 rounded-full">{t.periodo}</span>
                </div>
                <div className="mt-3">
                  <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                    {t.foco}
                  </span>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Novos Parceiros</span>
                  <span className="font-bold text-emerald-600">
                    +<EditableField
                      path={`metas_trimestrais[${i}].novos`}
                      value={t.novos}
                      type="number"
                      parser={parseInt}
                    />
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Churn</span>
                  <span className="font-bold text-rose-500">
                    -<EditableField
                      path={`metas_trimestrais[${i}].churn`}
                      value={t.churn}
                      type="number"
                      parser={parseInt}
                    />
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Indicações</span>
                  <span className="font-bold">
                    <EditableField
                      path={`metas_trimestrais[${i}].indicacoes`}
                      value={t.indicacoes}
                      type="number"
                      parser={parseInt}
                    />
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Contratos</span>
                  <span className="font-bold">
                    <EditableField
                      path={`metas_trimestrais[${i}].contratos`}
                      value={t.contratos}
                      type="number"
                      parser={parseInt}
                    />
                  </span>
                </div>
                <div className="flex justify-between text-sm pt-3 border-t border-slate-100">
                  <span className="text-slate-600 font-medium">Receita</span>
                  <span className="font-bold text-emerald-600">
                    <EditableField
                      path={`metas_trimestrais[${i}].receita`}
                      value={t.receita}
                      formatter={formatCurrency}
                      type="number"
                      parser={parseFloat}
                    />
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Gráfico Evolução Mensal */}
      <div className="card p-6">
        <h3 className="font-bold text-slate-900 mb-6">Evolução Mensal - Novos vs Churn vs Carteira</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data.metas_mensais}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="mes" stroke="#64748b" fontSize={12} />
              <YAxis yAxisId="left" stroke="#64748b" fontSize={12} />
              <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="novos" name="Novos" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="left" dataKey="churn" name="Churn" fill="#F43F5E" radius={[4, 4, 0, 0]} />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="carteira_fim"
                name="Carteira"
                stroke="#6370f1"
                strokeWidth={3}
                dot={{ fill: '#6370f1', strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabela Mensal Completa */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">{data.textos.titulo_metas_mensal}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="p-3 text-left font-semibold text-slate-600 text-sm">Mês</th>
                <th className="p-3 text-center font-semibold text-slate-600 text-sm">Carteira Início</th>
                <th className="p-3 text-center font-semibold text-emerald-600 text-sm">Novos</th>
                <th className="p-3 text-center font-semibold text-rose-600 text-sm">Churn</th>
                <th className="p-3 text-center font-semibold text-loara-600 text-sm">Carteira Fim</th>
                <th className="p-3 text-center font-semibold text-slate-600 text-sm">Indicações</th>
                <th className="p-3 text-center font-semibold text-slate-600 text-sm">Contratos</th>
                <th className="p-3 text-center font-semibold text-slate-600 text-sm">Operações</th>
                <th className="p-3 text-center font-semibold text-slate-600 text-sm">Captação</th>
                <th className="p-3 text-center font-semibold text-emerald-600 text-sm">Receita</th>
              </tr>
            </thead>
            <tbody>
              {data.metas_mensais.map((m, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-medium">{m.mes}</td>
                  <td className="p-3 text-center text-slate-600">
                    <EditableField
                      path={`metas_mensais[${i}].carteira_inicio`}
                      value={m.carteira_inicio}
                      type="number"
                      parser={parseInt}
                    />
                  </td>
                  <td className="p-3 text-center text-emerald-600 font-medium">
                    +<EditableField
                      path={`metas_mensais[${i}].novos`}
                      value={m.novos}
                      type="number"
                      parser={parseInt}
                    />
                  </td>
                  <td className="p-3 text-center text-rose-600 font-medium">
                    -<EditableField
                      path={`metas_mensais[${i}].churn`}
                      value={m.churn}
                      type="number"
                      parser={parseInt}
                    />
                  </td>
                  <td className="p-3 text-center font-bold text-loara-600">
                    <EditableField
                      path={`metas_mensais[${i}].carteira_fim`}
                      value={m.carteira_fim}
                      type="number"
                      parser={parseInt}
                    />
                  </td>
                  <td className="p-3 text-center">
                    <EditableField
                      path={`metas_mensais[${i}].indicacoes`}
                      value={m.indicacoes}
                      type="number"
                      parser={parseInt}
                    />
                  </td>
                  <td className="p-3 text-center">
                    <EditableField
                      path={`metas_mensais[${i}].contratos`}
                      value={m.contratos}
                      type="number"
                      parser={parseInt}
                    />
                  </td>
                  <td className="p-3 text-center">
                    <EditableField
                      path={`metas_mensais[${i}].operacoes`}
                      value={m.operacoes}
                      type="number"
                      parser={parseInt}
                    />
                  </td>
                  <td className="p-3 text-center">
                    <EditableField
                      path={`metas_mensais[${i}].captacao`}
                      value={m.captacao}
                      formatter={formatCurrency}
                      type="number"
                      parser={parseFloat}
                    />
                  </td>
                  <td className="p-3 text-center font-medium text-emerald-600">
                    <EditableField
                      path={`metas_mensais[${i}].receita`}
                      value={m.receita}
                      formatter={formatCurrency}
                      type="number"
                      parser={parseFloat}
                    />
                  </td>
                </tr>
              ))}
              {/* Linha de Total */}
              <tr className="bg-loara-50 font-bold">
                <td className="p-3 text-loara-800">TOTAL</td>
                <td className="p-3 text-center text-loara-700">-</td>
                <td className="p-3 text-center text-emerald-700">+{data.totais_2026.novos}</td>
                <td className="p-3 text-center text-rose-700">-{data.totais_2026.churn}</td>
                <td className="p-3 text-center text-loara-800">{data.totais_2026.carteira_final}</td>
                <td className="p-3 text-center text-loara-700">{data.totais_2026.indicacoes}</td>
                <td className="p-3 text-center text-loara-700">{data.totais_2026.contratos}</td>
                <td className="p-3 text-center text-loara-700">{data.totais_2026.operacoes}</td>
                <td className="p-3 text-center text-loara-700">{formatCurrency(data.totais_2026.captacao)}</td>
                <td className="p-3 text-center text-emerald-700">{formatCurrency(data.totais_2026.receita)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
