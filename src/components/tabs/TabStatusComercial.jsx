import { useState, useMemo } from 'react'
import { useData } from '../../context/DataContext'
import {
  FileText, Send, UserPlus, AlertTriangle, CheckCircle2,
  TrendingUp, TrendingDown, Calendar, ChevronRight, Info,
  ThumbsUp, AlertCircle, Clock, XCircle, Snowflake, Eye,
  BarChart3, ArrowRight, Users, Building2
} from 'lucide-react'

// Dados das semanas (mock inicial)
const statusData = {
  semana_19_25: {
    id: 'semana_19_25',
    label: 'Semana 19/01 - 25/01',
    foco: 'Execução',
    periodo: { inicio: '2026-01-19', fim: '2026-01-25' },
    kpis: {
      contratos: 2,
      minutas: 5,
      novosLeads: 0,
      alertas: 1,
      alertaTexto: '1 No-Show'
    },
    insights: {
      positivos: [
        'Semana de alta conversão de pipeline maduro',
        'Limpeza de funil realizada com sucesso',
        '2 contratos emitidos de reuniões anteriores'
      ],
      atencao: [
        '1 no-show registrado (Ribeiro Salgados)',
        'Panimundi desenquadrou na varredura'
      ]
    },
    atividades: [
      { empresa: 'Indústria Têxtil Tatuí', responsavel: 'Marcos', status: 'contrato', detalhe: 'Visita 20/01', data: '2026-01-20' },
      { empresa: 'Grupo Moby Dick', responsavel: 'Eric', status: 'contrato', detalhe: 'Reunião 19/01', data: '2026-01-19' },
      { empresa: 'Movitra e Sr. Alves', responsavel: 'Luciano Macedo', status: 'minuta', detalhe: 'Reunião 22/01', data: '2026-01-22' },
      { empresa: 'Albassi', responsavel: 'Beccari', status: 'minuta', detalhe: 'Reunião 23/01', data: '2026-01-23' },
      { empresa: 'Riopar', responsavel: 'Bruno Roquini', status: 'minuta', detalhe: 'Reunião 20/01', data: '2026-01-20' },
      { empresa: 'Cerâmica Strufaldi', responsavel: 'Marcos', status: 'minuta', detalhe: 'Visita 20/01', data: '2026-01-20' },
      { empresa: 'Thor Implementos', responsavel: 'Thales', status: 'minuta', detalhe: 'Reunião 20/01', data: '2026-01-20' },
      { empresa: 'GF Engenharia', responsavel: 'Celso', status: 'varredura', detalhe: 'Em análise', data: null },
      { empresa: 'Panimundi', responsavel: 'Bruno Roquini', status: 'congelada', detalhe: 'Desenquadrou na varredura', data: null },
      { empresa: 'Ribeiro Salgados', responsavel: 'Thales', status: 'noshow', detalhe: 'Reagendar', data: null },
      { empresa: 'Wert', responsavel: 'Luciano Macedo', status: 'descartada', detalhe: 'Restritivos', data: null },
    ],
    followups: []
  },
  semana_26_30: {
    id: 'semana_26_30',
    label: 'Semana 26/01 - 30/01',
    foco: 'Prospecção & Onboarding',
    periodo: { inicio: '2026-01-26', fim: '2026-01-30' },
    kpis: {
      contratos: 0,
      minutas: 1,
      novosLeads: 4,
      alertas: 1,
      alertaTexto: 'Eficiência Onboarding'
    },
    insights: {
      positivos: [
        'Evento de 26 e 27/01 teve bom feedback',
        'Visita presencial dos parceiros Eric e Claudio na terça (27/01) reforçou a cultura',
        '4 novos leads qualificados entraram no funil'
      ],
      atencao: [
        'Baixo ROI: Mobilizar o time inteiro para apenas 3 parceiros novos foi contraproducente',
        'Rever modelo para próximas edições do evento',
        '2 empresas descartadas por restritivos'
      ]
    },
    atividades: [
      { empresa: 'BBB Madeiras', responsavel: 'Eric', status: 'minuta', detalhe: 'Reunião realizada 26/01', data: '2026-01-26' },
      { empresa: 'Casa de Carnes Califórnia', responsavel: 'Celso Miguel', status: 'agendar', detalhe: 'Marcar reunião', data: null },
      { empresa: 'Ezlan Empreendimentos', responsavel: 'Vanessa', status: 'agendar', detalhe: 'Marcar reunião', data: null },
      { empresa: 'Estilo 360 Vestuário', responsavel: 'Claudine', status: 'agendar', detalhe: 'Marcar reunião', data: null },
      { empresa: 'Hyde Alimentos', responsavel: 'Eric', status: 'agendar', detalhe: 'Marcar reunião', data: null },
      { empresa: 'Amaral e Passos', responsavel: 'Claudine', status: 'descartada', detalhe: 'Restritivos', data: null },
      { empresa: 'Império Imports', responsavel: 'Claudine', status: 'descartada', detalhe: 'Restritivos', data: null },
    ],
    followups: [
      { empresa: 'Lead Renato', responsavel: '-', status: 'minuta', observacao: 'Aguardando resposta' },
      { empresa: 'Marcelo e Nelson', responsavel: '-', status: 'followup', observacao: 'Estratégia: Provocação com posts de comissão' },
    ]
  }
}

// Configuração dos status (pills)
const statusConfig = {
  contrato: { label: 'Contrato Emitido', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  minuta: { label: 'Minuta Enviada', color: 'bg-sky-100 text-sky-700 border-sky-200', icon: Send },
  agendar: { label: 'Marcar Reunião', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Calendar },
  agendado: { label: 'Agendado', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock },
  varredura: { label: 'Em Varredura', color: 'bg-violet-100 text-violet-700 border-violet-200', icon: Eye },
  followup: { label: 'Follow-up', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: ArrowRight },
  congelada: { label: 'Congelada', color: 'bg-rose-100 text-rose-700 border-rose-200', icon: Snowflake },
  noshow: { label: 'No Show', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: AlertCircle },
  descartada: { label: 'Descartada', color: 'bg-slate-200 text-slate-500 border-slate-300 line-through', icon: XCircle },
}

// Componente de Pill de Status
function StatusPill({ status }) {
  const config = statusConfig[status] || statusConfig.agendar
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  )
}

// Card de KPI
function KPICard({ title, value, icon: Icon, color, subtitle, trend }) {
  const colorClasses = {
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    sky: 'bg-sky-50 border-sky-200 text-sky-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
    rose: 'bg-rose-50 border-rose-200 text-rose-700',
    violet: 'bg-violet-50 border-violet-200 text-violet-700',
  }

  const iconBgClasses = {
    emerald: 'bg-emerald-100',
    sky: 'bg-sky-100',
    amber: 'bg-amber-100',
    rose: 'bg-rose-100',
    violet: 'bg-violet-100',
  }

  return (
    <div className={`card p-5 border-2 ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-4xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-xs mt-2 opacity-70">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${iconBgClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {trend && (
        <div className={`mt-3 flex items-center gap-1 text-xs ${trend > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
          {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{trend > 0 ? '+' : ''}{trend} vs semana anterior</span>
        </div>
      )}
    </div>
  )
}

// Componente de Insights
function InsightsPanel({ positivos, atencao }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Pontos Positivos */}
      <div className="card p-5 border-l-4 border-l-emerald-500 bg-emerald-50/50">
        <h4 className="font-semibold text-emerald-800 flex items-center gap-2 mb-3">
          <ThumbsUp className="w-5 h-5" />
          Pontos Positivos
        </h4>
        <ul className="space-y-2">
          {positivos.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-emerald-700">
              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Pontos de Atenção */}
      <div className="card p-5 border-l-4 border-l-amber-500 bg-amber-50/50">
        <h4 className="font-semibold text-amber-800 flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5" />
          Pontos de Atenção
        </h4>
        <ul className="space-y-2">
          {atencao.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-amber-700">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// Tabela de Atividades
function AtividadesTable({ atividades, title }) {
  if (!atividades || atividades.length === 0) return null

  return (
    <div className="card overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50">
        <h4 className="font-semibold text-slate-800 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-loara-500" />
          {title}
          <span className="ml-2 px-2 py-0.5 bg-loara-100 text-loara-700 rounded-full text-xs">
            {atividades.length}
          </span>
        </h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="p-3 text-left font-semibold text-slate-600 text-sm">Empresa</th>
              <th className="p-3 text-left font-semibold text-slate-600 text-sm">Responsável</th>
              <th className="p-3 text-center font-semibold text-slate-600 text-sm">Status</th>
              <th className="p-3 text-left font-semibold text-slate-600 text-sm">Detalhes</th>
            </tr>
          </thead>
          <tbody>
            {atividades.map((item, i) => (
              <tr
                key={i}
                className={`border-b last:border-0 hover:bg-slate-50 transition-colors ${
                  item.status === 'descartada' ? 'opacity-60' : ''
                }`}
              >
                <td className="p-3">
                  <span className={`font-medium text-slate-900 ${item.status === 'descartada' ? 'line-through' : ''}`}>
                    {item.empresa}
                  </span>
                </td>
                <td className="p-3 text-slate-600">{item.responsavel}</td>
                <td className="p-3 text-center">
                  <StatusPill status={item.status} />
                </td>
                <td className="p-3 text-sm text-slate-500">{item.detalhe}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Tabela de Follow-ups
function FollowupsTable({ followups }) {
  if (!followups || followups.length === 0) return null

  return (
    <div className="card overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50">
        <h4 className="font-semibold text-slate-800 flex items-center gap-2">
          <Users className="w-5 h-5 text-violet-500" />
          Follow-up (Parcerias & Pendências)
          <span className="ml-2 px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full text-xs">
            {followups.length}
          </span>
        </h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="p-3 text-left font-semibold text-slate-600 text-sm">Lead/Parceiro</th>
              <th className="p-3 text-left font-semibold text-slate-600 text-sm">Responsável</th>
              <th className="p-3 text-center font-semibold text-slate-600 text-sm">Status</th>
              <th className="p-3 text-left font-semibold text-slate-600 text-sm">Observações</th>
            </tr>
          </thead>
          <tbody>
            {followups.map((item, i) => (
              <tr key={i} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                <td className="p-3 font-medium text-slate-900">{item.empresa}</td>
                <td className="p-3 text-slate-600">{item.responsavel}</td>
                <td className="p-3 text-center">
                  <StatusPill status={item.status} />
                </td>
                <td className="p-3 text-sm text-slate-500">{item.observacao}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Comparativo entre semanas
function ComparativoView({ semanas }) {
  const semana1 = statusData.semana_19_25
  const semana2 = statusData.semana_26_30

  const calcTrend = (atual, anterior) => atual - anterior

  return (
    <div className="space-y-6">
      {/* KPIs Comparativos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="text-sm text-slate-500 mb-2">Contratos Emitidos</div>
          <div className="flex items-end gap-4">
            <div>
              <div className="text-xs text-slate-400">Sem 1</div>
              <div className="text-2xl font-bold text-emerald-600">{semana1.kpis.contratos}</div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300" />
            <div>
              <div className="text-xs text-slate-400">Sem 2</div>
              <div className="text-2xl font-bold text-emerald-600">{semana2.kpis.contratos}</div>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-slate-500 mb-2">Minutas Enviadas</div>
          <div className="flex items-end gap-4">
            <div>
              <div className="text-xs text-slate-400">Sem 1</div>
              <div className="text-2xl font-bold text-sky-600">{semana1.kpis.minutas}</div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300" />
            <div>
              <div className="text-xs text-slate-400">Sem 2</div>
              <div className="text-2xl font-bold text-sky-600">{semana2.kpis.minutas}</div>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-slate-500 mb-2">Novos Leads</div>
          <div className="flex items-end gap-4">
            <div>
              <div className="text-xs text-slate-400">Sem 1</div>
              <div className="text-2xl font-bold text-amber-600">{semana1.kpis.novosLeads}</div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300" />
            <div>
              <div className="text-xs text-slate-400">Sem 2</div>
              <div className="text-2xl font-bold text-amber-600">{semana2.kpis.novosLeads}</div>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-slate-500 mb-2">Alertas</div>
          <div className="flex items-end gap-4">
            <div>
              <div className="text-xs text-slate-400">Sem 1</div>
              <div className="text-2xl font-bold text-rose-600">{semana1.kpis.alertas}</div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300" />
            <div>
              <div className="text-xs text-slate-400">Sem 2</div>
              <div className="text-2xl font-bold text-rose-600">{semana2.kpis.alertas}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Resumo Quinzenal */}
      <div className="card p-6 bg-gradient-to-br from-loara-50 to-violet-50">
        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-loara-500" />
          Resumo Quinzenal (19/01 - 30/01)
        </h4>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-emerald-600">{semana1.kpis.contratos + semana2.kpis.contratos}</div>
            <div className="text-sm text-slate-600 mt-1">Contratos Emitidos</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-sky-600">{semana1.kpis.minutas + semana2.kpis.minutas}</div>
            <div className="text-sm text-slate-600 mt-1">Minutas Enviadas</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-amber-600">{semana1.atividades.length + semana2.atividades.length}</div>
            <div className="text-sm text-slate-600 mt-1">Empresas Trabalhadas</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-violet-600">
              {Math.round(((semana1.kpis.contratos + semana2.kpis.contratos) / (semana1.kpis.minutas + semana2.kpis.minutas + semana1.kpis.contratos + semana2.kpis.contratos)) * 100)}%
            </div>
            <div className="text-sm text-slate-600 mt-1">Taxa de Conversão</div>
          </div>
        </div>
      </div>

      {/* Lado a lado */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {semana1.label}
            <span className="text-xs bg-loara-100 text-loara-700 px-2 py-0.5 rounded-full">{semana1.foco}</span>
          </h4>
          <InsightsPanel positivos={semana1.insights.positivos} atencao={semana1.insights.atencao} />
        </div>
        <div>
          <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {semana2.label}
            <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">{semana2.foco}</span>
          </h4>
          <InsightsPanel positivos={semana2.insights.positivos} atencao={semana2.insights.atencao} />
        </div>
      </div>
    </div>
  )
}

export default function TabStatusComercial() {
  const { data } = useData()
  const [selectedPeriod, setSelectedPeriod] = useState('semana_19_25')

  const periods = [
    { id: 'semana_19_25', label: 'Semana 19/01 - 25/01', foco: 'Execução', color: 'loara' },
    { id: 'semana_26_30', label: 'Semana 26/01 - 30/01', foco: 'Prospecção & Onboarding', color: 'violet' },
    { id: 'comparativo', label: 'Comparativo Quinzenal', foco: 'Visão Consolidada', color: 'emerald' },
  ]

  const currentData = statusData[selectedPeriod]

  // Calcular trends para a segunda semana
  const getTrend = (field) => {
    if (selectedPeriod !== 'semana_26_30') return null
    return statusData.semana_26_30.kpis[field] - statusData.semana_19_25.kpis[field]
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <span className="text-2xl">📈</span>
          Status Comercial & Operacional
        </h2>
        <p className="text-slate-500 mt-2">
          Painel de controle semanal - Acompanhamento de pipeline e conversões
        </p>
      </div>

      {/* Seletor de Período (Timeline) */}
      <div className="card p-2">
        <div className="flex flex-wrap gap-2">
          {periods.map((period) => (
            <button
              key={period.id}
              onClick={() => setSelectedPeriod(period.id)}
              className={`flex-1 min-w-[200px] p-4 rounded-xl transition-all ${
                selectedPeriod === period.id
                  ? period.color === 'loara'
                    ? 'bg-loara-600 text-white shadow-lg'
                    : period.color === 'violet'
                    ? 'bg-violet-600 text-white shadow-lg'
                    : 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="font-semibold">{period.label}</div>
                  <div className={`text-xs mt-1 ${selectedPeriod === period.id ? 'opacity-80' : 'text-slate-500'}`}>
                    Foco: {period.foco}
                  </div>
                </div>
                {selectedPeriod === period.id && (
                  <CheckCircle2 className="w-5 h-5" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo baseado no período selecionado */}
      {selectedPeriod === 'comparativo' ? (
        <ComparativoView />
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Contratos Emitidos"
              value={currentData.kpis.contratos}
              icon={FileText}
              color="emerald"
              subtitle="Sucessos da semana"
              trend={getTrend('contratos')}
            />
            <KPICard
              title="Minutas Enviadas"
              value={currentData.kpis.minutas}
              icon={Send}
              color="sky"
              subtitle="Pipeline quente"
              trend={getTrend('minutas')}
            />
            <KPICard
              title="Novos Leads"
              value={currentData.kpis.novosLeads}
              icon={UserPlus}
              color="amber"
              subtitle="Topo de funil"
              trend={getTrend('novosLeads')}
            />
            <KPICard
              title="Alertas"
              value={currentData.kpis.alertas}
              icon={AlertTriangle}
              color="rose"
              subtitle={currentData.kpis.alertaTexto}
            />
          </div>

          {/* Info do período */}
          <div className="card p-4 bg-gradient-to-r from-slate-50 to-slate-100 flex items-center gap-4">
            <div className={`px-4 py-2 rounded-xl ${
              selectedPeriod === 'semana_19_25' ? 'bg-loara-100 text-loara-700' : 'bg-violet-100 text-violet-700'
            }`}>
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-slate-800">{currentData.label}</div>
              <div className="text-sm text-slate-500">Foco: {currentData.foco}</div>
            </div>
          </div>

          {/* Insights */}
          <InsightsPanel
            positivos={currentData.insights.positivos}
            atencao={currentData.insights.atencao}
          />

          {/* Tabelas */}
          <div className="space-y-6">
            <AtividadesTable
              atividades={currentData.atividades}
              title={selectedPeriod === 'semana_19_25' ? 'Atividades da Semana' : 'Novas Empresas (Entrada)'}
            />

            {currentData.followups && currentData.followups.length > 0 && (
              <FollowupsTable followups={currentData.followups} />
            )}
          </div>

          {/* Legenda de Status */}
          <div className="card p-6">
            <h4 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Legenda de Status
            </h4>
            <div className="flex flex-wrap gap-3">
              {Object.entries(statusConfig).map(([key, config]) => (
                <StatusPill key={key} status={key} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
