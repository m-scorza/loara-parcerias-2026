import { useData } from '../../context/DataContext'
import { formatCurrency } from '../../utils/format'
import StatCard from '../StatCard'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Users, UserCheck, DollarSign, Briefcase } from 'lucide-react'

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
  const { data } = useData()
  const d = data.diagnostico

  const pieDataCategoria = Object.entries(d.por_tipo).map(([name, value]) => ({
    name,
    value,
    fill: CATEGORY_COLORS[name] || '#94a3b8'
  }))

  const pieDataStatus = Object.entries(d.por_status).map(([name, value]) => ({
    name,
    value,
    fill: STATUS_COLORS[name] || '#94a3b8'
  }))

  const totalStatus = Object.values(d.por_status).reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <span className="text-2xl">🔍</span>
          Diagnóstico da Carteira
        </h2>
        <p className="text-slate-500 mt-2">
          Período: {d.periodo.inicio} a {d.periodo.fim}
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Parceiros"
          value={d.resumo.total_parceiros}
          subtitle="Base cadastral"
          color="loara"
          icon={Users}
        />
        <StatCard
          title="Parceiros Ativos"
          value={d.resumo.parceiros_ativos}
          subtitle={`${Math.round(d.resumo.parceiros_ativos / d.resumo.total_parceiros * 100)}% do total`}
          color="emerald"
          icon={UserCheck}
        />
        <StatCard
          title="Captação"
          value={d.resumo.captacao}
          subtitle="Volume realizado"
          color="sky"
          icon={Briefcase}
          formatter={formatCurrency}
        />
        <StatCard
          title="Faturamento"
          value={d.resumo.faturamento}
          subtitle="Receita gerada"
          color="amber"
          icon={DollarSign}
          formatter={formatCurrency}
        />
      </div>

      {/* Métricas adicionais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Parceiros Ouro', value: d.resumo.parceiros_ouro, color: 'bg-amber-100 text-amber-800' },
          { label: 'Parceiros Prata', value: d.resumo.parceiros_prata, color: 'bg-slate-100 text-slate-800' },
          { label: 'Parceiros Bronze', value: d.resumo.parceiros_bronze, color: 'bg-orange-100 text-orange-800' },
          { label: 'Empresas Originadas', value: d.resumo.empresas_originadas, color: 'bg-loara-100 text-loara-800' },
        ].map((item, i) => (
          <div key={i} className="card p-5 text-center">
            <div className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold mb-2 ${item.color}`}>
              {item.label}
            </div>
            <div className="text-3xl font-bold text-slate-900">{item.value}</div>
          </div>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Por Categoria */}
        <div className="card p-6">
          <h3 className="font-bold text-slate-900 mb-6">Distribuição por Categoria</h3>
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

        {/* Por Status */}
        <div className="card p-6">
          <h3 className="font-bold text-slate-900 mb-6">Distribuição por Status</h3>
          <div className="space-y-4">
            {Object.entries(d.por_status).map(([status, count], i) => {
              const pct = Math.round(count / totalStatus * 100)
              const isActive = status === 'Ativado'
              const color = STATUS_COLORS[status] || '#94a3b8'

              return (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className={`font-medium ${isActive ? 'text-emerald-700' : 'text-slate-600'}`}>
                      {status}
                    </span>
                    <span className="font-bold">{count} ({pct}%)</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: color
                      }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Detalhes do Pipeline */}
      <div className="card p-6">
        <h3 className="font-bold text-slate-900 mb-6">Resumo do Pipeline</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-5 bg-loara-50 rounded-xl text-center">
            <div className="text-4xl font-bold text-loara-700">{d.resumo.empresas_originadas}</div>
            <div className="text-sm text-loara-600 mt-1">Empresas Originadas</div>
          </div>
          <div className="p-5 bg-emerald-50 rounded-xl text-center">
            <div className="text-4xl font-bold text-emerald-700">{d.resumo.empresas_com_negocio}</div>
            <div className="text-sm text-emerald-600 mt-1">Com Negócio Criado</div>
            <div className="text-xs text-emerald-500 mt-1">
              {Math.round(d.resumo.empresas_com_negocio / d.resumo.empresas_originadas * 100)}% de conversão
            </div>
          </div>
          <div className="p-5 bg-amber-50 rounded-xl text-center">
            <div className="text-4xl font-bold text-amber-700">{d.resumo.negocios_pipeline}</div>
            <div className="text-sm text-amber-600 mt-1">Negócios no Pipeline</div>
          </div>
        </div>
      </div>
    </div>
  )
}
