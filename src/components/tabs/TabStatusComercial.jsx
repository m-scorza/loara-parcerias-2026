import { useState, useMemo, useEffect } from 'react'
import { useData } from '../../context/DataContext'
import {
  FileText, Send, UserPlus, AlertTriangle, CheckCircle2,
  TrendingUp, TrendingDown, Calendar, ChevronRight, Info,
  ThumbsUp, AlertCircle, Clock, XCircle, Snowflake, Eye,
  BarChart3, ArrowRight, Users, Building2, Edit3, Save, X,
  Plus, Trash2, ChevronDown
} from 'lucide-react'

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

const statusOptions = Object.keys(statusConfig)

// Componente de campo editável inline
function EditableText({ value, onChange, className = '', placeholder = '', multiline = false }) {
  const { editMode } = useData()
  const [isEditing, setIsEditing] = useState(false)
  const [tempValue, setTempValue] = useState(value)

  useEffect(() => {
    setTempValue(value)
  }, [value])

  const handleSave = () => {
    onChange(tempValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTempValue(value)
    setIsEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !multiline) handleSave()
    if (e.key === 'Escape') handleCancel()
  }

  if (!editMode) {
    return <span className={className}>{value}</span>
  }

  if (isEditing) {
    return (
      <span className="inline-flex items-center gap-1">
        {multiline ? (
          <textarea
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="px-2 py-1 border border-loara-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-loara-500 min-w-[150px] resize-none"
            rows={2}
            autoFocus
          />
        ) : (
          <input
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="px-2 py-1 border border-loara-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-loara-500 min-w-[100px]"
            autoFocus
          />
        )}
        <button onClick={handleSave} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded">
          <Save className="w-4 h-4" />
        </button>
        <button onClick={handleCancel} className="p-1 text-slate-400 hover:bg-slate-100 rounded">
          <X className="w-4 h-4" />
        </button>
      </span>
    )
  }

  return (
    <span
      className={`${className} cursor-pointer hover:bg-loara-100 px-1 py-0.5 rounded transition-colors border border-dashed border-transparent hover:border-loara-300`}
      onClick={() => {
        setTempValue(value)
        setIsEditing(true)
      }}
      title="Clique para editar"
    >
      {value || <span className="text-slate-400 italic">{placeholder || 'Clique para editar'}</span>}
      <Edit3 className="w-3 h-3 inline ml-1 opacity-50" />
    </span>
  )
}

// Componente de número editável
function EditableNumber({ value, onChange, className = '' }) {
  const { editMode } = useData()
  const [isEditing, setIsEditing] = useState(false)
  const [tempValue, setTempValue] = useState(value)

  useEffect(() => {
    setTempValue(value)
  }, [value])

  const handleSave = () => {
    onChange(parseInt(tempValue) || 0)
    setIsEditing(false)
  }

  if (!editMode) {
    return <span className={className}>{value}</span>
  }

  if (isEditing) {
    return (
      <span className="inline-flex items-center gap-1">
        <input
          type="number"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave()
            if (e.key === 'Escape') {
              setTempValue(value)
              setIsEditing(false)
            }
          }}
          className="w-16 px-2 py-1 border border-loara-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-loara-500"
          autoFocus
        />
        <button onClick={handleSave} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded">
          <Save className="w-4 h-4" />
        </button>
      </span>
    )
  }

  return (
    <span
      className={`${className} cursor-pointer hover:bg-white/50 px-2 py-1 rounded transition-colors`}
      onClick={() => setIsEditing(true)}
      title="Clique para editar"
    >
      {value}
      <Edit3 className="w-3 h-3 inline ml-1 opacity-50" />
    </span>
  )
}

// Seletor de Status
function StatusSelect({ value, onChange }) {
  const { editMode } = useData()
  const [isOpen, setIsOpen] = useState(false)

  if (!editMode) {
    return <StatusPill status={value} />
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1"
      >
        <StatusPill status={value} />
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 min-w-[180px]">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => {
                onChange(status)
                setIsOpen(false)
              }}
              className={`w-full p-2 text-left hover:bg-slate-50 rounded-lg ${value === status ? 'bg-slate-100' : ''}`}
            >
              <StatusPill status={status} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
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

// Card de KPI Editável
function KPICard({ title, value, icon: Icon, color, subtitle, trend, onValueChange, onSubtitleChange }) {
  const { editMode } = useData()

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
          <p className="text-4xl font-bold mt-1">
            {editMode && onValueChange ? (
              <EditableNumber value={value} onChange={onValueChange} />
            ) : value}
          </p>
          {subtitle && (
            <p className="text-xs mt-2 opacity-70">
              {editMode && onSubtitleChange ? (
                <EditableText value={subtitle} onChange={onSubtitleChange} />
              ) : subtitle}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${iconBgClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {trend !== null && trend !== undefined && (
        <div className={`mt-3 flex items-center gap-1 text-xs ${trend > 0 ? 'text-emerald-600' : trend < 0 ? 'text-rose-600' : 'text-slate-500'}`}>
          {trend > 0 ? <TrendingUp className="w-3 h-3" /> : trend < 0 ? <TrendingDown className="w-3 h-3" /> : null}
          <span>{trend > 0 ? '+' : ''}{trend} vs semana anterior</span>
        </div>
      )}
    </div>
  )
}

// Componente de Insights Editável
function InsightsPanel({ positivos, atencao, onUpdatePositivos, onUpdateAtencao, onAddPositivo, onAddAtencao, onRemovePositivo, onRemoveAtencao }) {
  const { editMode } = useData()

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Pontos Positivos */}
      <div className="card p-5 border-l-4 border-l-emerald-500 bg-emerald-50/50">
        <h4 className="font-semibold text-emerald-800 flex items-center gap-2 mb-3">
          <ThumbsUp className="w-5 h-5" />
          Pontos Positivos
          {editMode && (
            <button
              onClick={onAddPositivo}
              className="ml-auto p-1 text-emerald-600 hover:bg-emerald-100 rounded"
              title="Adicionar"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </h4>
        <ul className="space-y-2">
          {positivos.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-emerald-700">
              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
              {editMode ? (
                <div className="flex-1 flex items-start gap-1">
                  <EditableText
                    value={item}
                    onChange={(v) => onUpdatePositivos(i, v)}
                    className="flex-1"
                  />
                  <button
                    onClick={() => onRemovePositivo(i)}
                    className="p-1 text-rose-500 hover:bg-rose-50 rounded shrink-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <span>{item}</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Pontos de Atenção */}
      <div className="card p-5 border-l-4 border-l-amber-500 bg-amber-50/50">
        <h4 className="font-semibold text-amber-800 flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5" />
          Pontos de Atenção
          {editMode && (
            <button
              onClick={onAddAtencao}
              className="ml-auto p-1 text-amber-600 hover:bg-amber-100 rounded"
              title="Adicionar"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </h4>
        <ul className="space-y-2">
          {atencao.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-amber-700">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              {editMode ? (
                <div className="flex-1 flex items-start gap-1">
                  <EditableText
                    value={item}
                    onChange={(v) => onUpdateAtencao(i, v)}
                    className="flex-1"
                  />
                  <button
                    onClick={() => onRemoveAtencao(i)}
                    className="p-1 text-rose-500 hover:bg-rose-50 rounded shrink-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <span>{item}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// Tabela de Atividades Editável
function AtividadesTable({ atividades, title, onUpdate, onAdd, onRemove }) {
  const { editMode } = useData()

  if (!atividades || atividades.length === 0) {
    if (editMode) {
      return (
        <div className="card p-6 text-center">
          <p className="text-slate-500 mb-4">Nenhuma atividade registrada</p>
          <button
            onClick={onAdd}
            className="inline-flex items-center gap-2 px-4 py-2 bg-loara-600 text-white rounded-xl hover:bg-loara-700"
          >
            <Plus className="w-4 h-4" />
            Adicionar Atividade
          </button>
        </div>
      )
    }
    return null
  }

  return (
    <div className="card overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <h4 className="font-semibold text-slate-800 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-loara-500" />
          {title}
          <span className="ml-2 px-2 py-0.5 bg-loara-100 text-loara-700 rounded-full text-xs">
            {atividades.length}
          </span>
        </h4>
        {editMode && (
          <button
            onClick={onAdd}
            className="flex items-center gap-1 px-3 py-1.5 bg-loara-600 text-white rounded-lg text-sm hover:bg-loara-700"
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="p-3 text-left font-semibold text-slate-600 text-sm">Empresa</th>
              <th className="p-3 text-left font-semibold text-slate-600 text-sm">Responsável</th>
              <th className="p-3 text-center font-semibold text-slate-600 text-sm">Status</th>
              <th className="p-3 text-left font-semibold text-slate-600 text-sm">Detalhes</th>
              {editMode && <th className="p-3 text-center font-semibold text-slate-600 text-sm w-16">Ações</th>}
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
                  {editMode ? (
                    <EditableText
                      value={item.empresa}
                      onChange={(v) => onUpdate(i, 'empresa', v)}
                      className={`font-medium text-slate-900 ${item.status === 'descartada' ? 'line-through' : ''}`}
                    />
                  ) : (
                    <span className={`font-medium text-slate-900 ${item.status === 'descartada' ? 'line-through' : ''}`}>
                      {item.empresa}
                    </span>
                  )}
                </td>
                <td className="p-3 text-slate-600">
                  {editMode ? (
                    <EditableText
                      value={item.responsavel}
                      onChange={(v) => onUpdate(i, 'responsavel', v)}
                    />
                  ) : item.responsavel}
                </td>
                <td className="p-3 text-center">
                  <StatusSelect
                    value={item.status}
                    onChange={(v) => onUpdate(i, 'status', v)}
                  />
                </td>
                <td className="p-3 text-sm text-slate-500">
                  {editMode ? (
                    <EditableText
                      value={item.detalhe}
                      onChange={(v) => onUpdate(i, 'detalhe', v)}
                    />
                  ) : item.detalhe}
                </td>
                {editMode && (
                  <td className="p-3 text-center">
                    <button
                      onClick={() => onRemove(i)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Tabela de Follow-ups Editável
function FollowupsTable({ followups, onUpdate, onAdd, onRemove }) {
  const { editMode } = useData()

  if (!followups || followups.length === 0) {
    if (editMode) {
      return (
        <div className="card p-6 text-center">
          <p className="text-slate-500 mb-4">Nenhum follow-up registrado</p>
          <button
            onClick={onAdd}
            className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700"
          >
            <Plus className="w-4 h-4" />
            Adicionar Follow-up
          </button>
        </div>
      )
    }
    return null
  }

  return (
    <div className="card overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <h4 className="font-semibold text-slate-800 flex items-center gap-2">
          <Users className="w-5 h-5 text-violet-500" />
          Follow-up (Parcerias & Pendências)
          <span className="ml-2 px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full text-xs">
            {followups.length}
          </span>
        </h4>
        {editMode && (
          <button
            onClick={onAdd}
            className="flex items-center gap-1 px-3 py-1.5 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700"
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="p-3 text-left font-semibold text-slate-600 text-sm">Lead/Parceiro</th>
              <th className="p-3 text-left font-semibold text-slate-600 text-sm">Responsável</th>
              <th className="p-3 text-center font-semibold text-slate-600 text-sm">Status</th>
              <th className="p-3 text-left font-semibold text-slate-600 text-sm">Observações</th>
              {editMode && <th className="p-3 text-center font-semibold text-slate-600 text-sm w-16">Ações</th>}
            </tr>
          </thead>
          <tbody>
            {followups.map((item, i) => (
              <tr key={i} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                <td className="p-3 font-medium text-slate-900">
                  {editMode ? (
                    <EditableText value={item.empresa} onChange={(v) => onUpdate(i, 'empresa', v)} />
                  ) : item.empresa}
                </td>
                <td className="p-3 text-slate-600">
                  {editMode ? (
                    <EditableText value={item.responsavel} onChange={(v) => onUpdate(i, 'responsavel', v)} />
                  ) : item.responsavel}
                </td>
                <td className="p-3 text-center">
                  <StatusSelect value={item.status} onChange={(v) => onUpdate(i, 'status', v)} />
                </td>
                <td className="p-3 text-sm text-slate-500">
                  {editMode ? (
                    <EditableText value={item.observacao} onChange={(v) => onUpdate(i, 'observacao', v)} />
                  ) : item.observacao}
                </td>
                {editMode && (
                  <td className="p-3 text-center">
                    <button onClick={() => onRemove(i)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Comparativo entre semanas (dinâmico)
function ComparativoView({ statusData }) {
  // Pegar todas as semanas ordenadas
  const semanas = Object.entries(statusData || {})
    .filter(([key]) => key.startsWith('semana'))
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => {
      const dateA = a.periodo?.inicio || a.id
      const dateB = b.periodo?.inicio || b.id
      return dateA.localeCompare(dateB)
    })

  if (semanas.length === 0) {
    return (
      <div className="card p-8 text-center text-slate-500">
        Nenhuma semana cadastrada ainda. Adicione semanas para ver o comparativo.
      </div>
    )
  }

  // Calcular totais
  const totals = semanas.reduce((acc, s) => ({
    contratos: acc.contratos + (s.kpis?.contratos || 0),
    minutas: acc.minutas + (s.kpis?.minutas || 0),
    novosLeads: acc.novosLeads + (s.kpis?.novosLeads || 0),
    alertas: acc.alertas + (s.kpis?.alertas || 0),
    atividades: acc.atividades + (s.atividades?.length || 0)
  }), { contratos: 0, minutas: 0, novosLeads: 0, alertas: 0, atividades: 0 })

  const kpiConfig = [
    { key: 'contratos', label: 'Contratos Emitidos', color: 'emerald' },
    { key: 'minutas', label: 'Minutas Enviadas', color: 'sky' },
    { key: 'novosLeads', label: 'Novos Leads', color: 'amber' },
    { key: 'alertas', label: 'Alertas', color: 'rose' }
  ]

  return (
    <div className="space-y-6">
      {/* KPIs Comparativos por semana */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpiConfig.map(({ key, label, color }) => (
          <div key={key} className="card p-4">
            <div className="text-sm text-slate-500 mb-2">{label}</div>
            <div className="flex items-end gap-2 flex-wrap">
              {semanas.map((s, i) => (
                <div key={s.id} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight className="w-4 h-4 text-slate-300" />}
                  <div>
                    <div className="text-xs text-slate-400">S{i + 1}</div>
                    <div className={`text-xl font-bold text-${color}-600`}>{s.kpis?.[key] || 0}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Resumo Consolidado */}
      <div className="card p-6 bg-gradient-to-br from-loara-50 to-violet-50">
        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-loara-500" />
          Resumo Consolidado ({semanas.length} semanas)
        </h4>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-emerald-600">{totals.contratos}</div>
            <div className="text-sm text-slate-600 mt-1">Contratos Emitidos</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-sky-600">{totals.minutas}</div>
            <div className="text-sm text-slate-600 mt-1">Minutas Enviadas</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-amber-600">{totals.atividades}</div>
            <div className="text-sm text-slate-600 mt-1">Empresas Trabalhadas</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-violet-600">
              {Math.round((totals.contratos / Math.max(1, totals.minutas + totals.contratos)) * 100)}%
            </div>
            <div className="text-sm text-slate-600 mt-1">Taxa de Conversão</div>
          </div>
        </div>
      </div>

      {/* Insights de todas as semanas */}
      <div className="grid lg:grid-cols-2 gap-6">
        {semanas.map((semana, i) => (
          <div key={semana.id}>
            <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {semana.label}
              <span className={`text-xs px-2 py-0.5 rounded-full ${i % 2 === 0 ? 'bg-loara-100 text-loara-700' : 'bg-violet-100 text-violet-700'}`}>
                {semana.foco}
              </span>
            </h4>
            <InsightsPanel
              positivos={semana.insights?.positivos || []}
              atencao={semana.insights?.atencao || []}
              onUpdatePositivos={() => {}}
              onUpdateAtencao={() => {}}
              onAddPositivo={() => {}}
              onAddAtencao={() => {}}
              onRemovePositivo={() => {}}
              onRemoveAtencao={() => {}}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// Modal para criar nova semana
function NovaSemanaModal({ isOpen, onClose, onSave }) {
  const [label, setLabel] = useState('')
  const [foco, setFoco] = useState('')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')

  const handleSave = () => {
    if (!label || !dataInicio || !dataFim) return

    const id = `semana_${dataInicio.replace(/-/g, '_')}`
    onSave({
      id,
      label,
      foco: foco || 'Execução',
      periodo: { inicio: dataInicio, fim: dataFim },
      kpis: {
        contratos: 0,
        minutas: 0,
        novosLeads: 0,
        alertas: 0,
        alertaTexto: ''
      },
      insights: {
        positivos: [],
        atencao: []
      },
      atividades: [],
      followups: []
    })

    // Reset form
    setLabel('')
    setFoco('')
    setDataInicio('')
    setDataFim('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fadeIn" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">Nova Semana</h3>
          <p className="text-sm text-slate-500 mt-1">Adicione um novo período de acompanhamento</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome do período *</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Ex: Semana 03/02 - 07/02"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-loara-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Foco</label>
            <input
              type="text"
              value={foco}
              onChange={(e) => setFoco(e.target.value)}
              placeholder="Ex: Prospecção, Execução, Onboarding..."
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-loara-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Data início *</label>
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-loara-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Data fim *</label>
              <input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-loara-500"
              />
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!label || !dataInicio || !dataFim}
            className="px-4 py-2 text-sm font-medium text-white bg-loara-600 hover:bg-loara-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Criar Semana
          </button>
        </div>
      </div>
    </div>
  )
}

export default function TabStatusComercial() {
  const { data, updateData, editMode } = useData()
  const [selectedPeriod, setSelectedPeriod] = useState(null)
  const [showNewModal, setShowNewModal] = useState(false)

  // Usar dados diretamente do context (já garantido que existe no DataContext)
  const statusData = data.status_comercial

  // Salvar alterações no context (agora com auto-save)
  const saveToContext = (newData) => {
    updateData('status_comercial', newData)
  }

  // Gerar períodos dinamicamente a partir dos dados
  const periods = useMemo(() => {
    const dynamicPeriods = Object.entries(statusData || {})
      .filter(([key]) => key !== 'comparativo' && key.startsWith('semana'))
      .map(([id, semana]) => ({
        id,
        label: semana.label,
        foco: semana.foco,
        color: Object.keys(statusData).indexOf(id) % 2 === 0 ? 'loara' : 'violet'
      }))
      .sort((a, b) => {
        // Ordenar por data se disponível, senão por ID
        const dateA = statusData[a.id]?.periodo?.inicio || a.id
        const dateB = statusData[b.id]?.periodo?.inicio || b.id
        return dateA.localeCompare(dateB)
      })

    return [
      ...dynamicPeriods,
      { id: 'comparativo', label: 'Comparativo', foco: 'Visão Consolidada', color: 'emerald' }
    ]
  }, [statusData])

  // Selecionar primeiro período se nenhum selecionado
  useEffect(() => {
    if (!selectedPeriod && periods.length > 0) {
      setSelectedPeriod(periods[0].id)
    }
  }, [periods, selectedPeriod])

  const currentData = statusData?.[selectedPeriod]

  // Função para adicionar nova semana
  const addSemana = (novaSemana) => {
    const newData = {
      ...statusData,
      [novaSemana.id]: novaSemana
    }
    saveToContext(newData)
    setSelectedPeriod(novaSemana.id)
  }

  // Função para excluir semana
  const removeSemana = (semanaId) => {
    if (!confirm(`Tem certeza que deseja excluir "${statusData[semanaId]?.label}"? Esta ação não pode ser desfeita.`)) {
      return
    }

    const { [semanaId]: removed, ...newData } = statusData
    saveToContext(newData)

    // Selecionar outra semana se a atual foi removida
    if (selectedPeriod === semanaId) {
      const remainingPeriods = Object.keys(newData).filter(k => k.startsWith('semana'))
      setSelectedPeriod(remainingPeriods[0] || 'comparativo')
    }
  }

  // Funções de atualização
  const updateKPI = (field, value) => {
    const newData = {
      ...statusData,
      [selectedPeriod]: {
        ...statusData[selectedPeriod],
        kpis: {
          ...statusData[selectedPeriod].kpis,
          [field]: value
        }
      }
    }
    saveToContext(newData)
  }

  const updateInsightPositivo = (index, value) => {
    const newPositivos = [...statusData[selectedPeriod].insights.positivos]
    newPositivos[index] = value
    const newData = {
      ...statusData,
      [selectedPeriod]: {
        ...statusData[selectedPeriod],
        insights: {
          ...statusData[selectedPeriod].insights,
          positivos: newPositivos
        }
      }
    }
    saveToContext(newData)
  }

  const updateInsightAtencao = (index, value) => {
    const newAtencao = [...statusData[selectedPeriod].insights.atencao]
    newAtencao[index] = value
    const newData = {
      ...statusData,
      [selectedPeriod]: {
        ...statusData[selectedPeriod],
        insights: {
          ...statusData[selectedPeriod].insights,
          atencao: newAtencao
        }
      }
    }
    saveToContext(newData)
  }

  const addInsightPositivo = () => {
    const newData = {
      ...statusData,
      [selectedPeriod]: {
        ...statusData[selectedPeriod],
        insights: {
          ...statusData[selectedPeriod].insights,
          positivos: [...statusData[selectedPeriod].insights.positivos, 'Novo ponto positivo']
        }
      }
    }
    saveToContext(newData)
  }

  const addInsightAtencao = () => {
    const newData = {
      ...statusData,
      [selectedPeriod]: {
        ...statusData[selectedPeriod],
        insights: {
          ...statusData[selectedPeriod].insights,
          atencao: [...statusData[selectedPeriod].insights.atencao, 'Novo ponto de atenção']
        }
      }
    }
    saveToContext(newData)
  }

  const removeInsightPositivo = (index) => {
    const newPositivos = statusData[selectedPeriod].insights.positivos.filter((_, i) => i !== index)
    const newData = {
      ...statusData,
      [selectedPeriod]: {
        ...statusData[selectedPeriod],
        insights: {
          ...statusData[selectedPeriod].insights,
          positivos: newPositivos
        }
      }
    }
    saveToContext(newData)
  }

  const removeInsightAtencao = (index) => {
    const newAtencao = statusData[selectedPeriod].insights.atencao.filter((_, i) => i !== index)
    const newData = {
      ...statusData,
      [selectedPeriod]: {
        ...statusData[selectedPeriod],
        insights: {
          ...statusData[selectedPeriod].insights,
          atencao: newAtencao
        }
      }
    }
    saveToContext(newData)
  }

  const updateAtividade = (index, field, value) => {
    const newAtividades = [...statusData[selectedPeriod].atividades]
    newAtividades[index] = { ...newAtividades[index], [field]: value }
    const newData = {
      ...statusData,
      [selectedPeriod]: {
        ...statusData[selectedPeriod],
        atividades: newAtividades
      }
    }
    saveToContext(newData)
  }

  const addAtividade = () => {
    const newData = {
      ...statusData,
      [selectedPeriod]: {
        ...statusData[selectedPeriod],
        atividades: [...statusData[selectedPeriod].atividades, {
          empresa: 'Nova Empresa',
          responsavel: '-',
          status: 'agendar',
          detalhe: 'Detalhes'
        }]
      }
    }
    saveToContext(newData)
  }

  const removeAtividade = (index) => {
    const newAtividades = statusData[selectedPeriod].atividades.filter((_, i) => i !== index)
    const newData = {
      ...statusData,
      [selectedPeriod]: {
        ...statusData[selectedPeriod],
        atividades: newAtividades
      }
    }
    saveToContext(newData)
  }

  const updateFollowup = (index, field, value) => {
    const newFollowups = [...statusData[selectedPeriod].followups]
    newFollowups[index] = { ...newFollowups[index], [field]: value }
    const newData = {
      ...statusData,
      [selectedPeriod]: {
        ...statusData[selectedPeriod],
        followups: newFollowups
      }
    }
    saveToContext(newData)
  }

  const addFollowup = () => {
    const newData = {
      ...statusData,
      [selectedPeriod]: {
        ...statusData[selectedPeriod],
        followups: [...(statusData[selectedPeriod].followups || []), {
          empresa: 'Novo Lead',
          responsavel: '-',
          status: 'followup',
          observacao: 'Observações'
        }]
      }
    }
    saveToContext(newData)
  }

  const removeFollowup = (index) => {
    const newFollowups = statusData[selectedPeriod].followups.filter((_, i) => i !== index)
    const newData = {
      ...statusData,
      [selectedPeriod]: {
        ...statusData[selectedPeriod],
        followups: newFollowups
      }
    }
    saveToContext(newData)
  }

  // Calcular trends comparando com a semana anterior
  const getTrend = (field) => {
    const semanas = Object.keys(statusData || {})
      .filter(k => k.startsWith('semana'))
      .sort((a, b) => {
        const dateA = statusData[a]?.periodo?.inicio || a
        const dateB = statusData[b]?.periodo?.inicio || b
        return dateA.localeCompare(dateB)
      })

    const currentIndex = semanas.indexOf(selectedPeriod)
    if (currentIndex <= 0) return null

    const previousPeriod = semanas[currentIndex - 1]
    const currentValue = statusData[selectedPeriod]?.kpis?.[field] || 0
    const previousValue = statusData[previousPeriod]?.kpis?.[field] || 0

    return currentValue - previousValue
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
        {editMode && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <strong>Modo de edição ativo:</strong> Clique em qualquer valor para editar. Use os botões + para adicionar itens e 🗑️ para remover.
            </div>
          </div>
        )}
      </div>

      {/* Modal de nova semana */}
      <NovaSemanaModal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        onSave={addSemana}
      />

      {/* Seletor de Período (Timeline) */}
      <div className="card p-2">
        <div className="flex flex-wrap gap-2">
          {periods.map((period) => (
            <div
              key={period.id}
              className={`flex-1 min-w-[200px] p-4 rounded-xl transition-all relative group ${
                selectedPeriod === period.id
                  ? period.color === 'loara'
                    ? 'bg-loara-600 text-white shadow-lg'
                    : period.color === 'violet'
                    ? 'bg-violet-600 text-white shadow-lg'
                    : 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 cursor-pointer'
              }`}
              onClick={() => setSelectedPeriod(period.id)}
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="font-semibold">{period.label}</div>
                  <div className={`text-xs mt-1 ${selectedPeriod === period.id ? 'opacity-80' : 'text-slate-500'}`}>
                    Foco: {period.foco}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedPeriod === period.id && (
                    <CheckCircle2 className="w-5 h-5" />
                  )}
                  {/* Botão de excluir - só mostra em modo edição e não no comparativo */}
                  {editMode && period.id !== 'comparativo' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeSemana(period.id)
                      }}
                      className={`p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${
                        selectedPeriod === period.id
                          ? 'hover:bg-white/20 text-white'
                          : 'hover:bg-rose-100 text-rose-500'
                      }`}
                      title="Excluir semana"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Botão de adicionar nova semana */}
          {editMode && (
            <button
              onClick={() => setShowNewModal(true)}
              className="min-w-[150px] p-4 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 hover:border-loara-400 hover:text-loara-600 hover:bg-loara-50 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Nova Semana</span>
            </button>
          )}
        </div>
      </div>

      {/* Conteúdo baseado no período selecionado */}
      {selectedPeriod === 'comparativo' ? (
        <ComparativoView statusData={statusData} />
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
              onValueChange={(v) => updateKPI('contratos', v)}
            />
            <KPICard
              title="Minutas Enviadas"
              value={currentData.kpis.minutas}
              icon={Send}
              color="sky"
              subtitle="Pipeline quente"
              trend={getTrend('minutas')}
              onValueChange={(v) => updateKPI('minutas', v)}
            />
            <KPICard
              title="Novos Leads"
              value={currentData.kpis.novosLeads}
              icon={UserPlus}
              color="amber"
              subtitle="Topo de funil"
              trend={getTrend('novosLeads')}
              onValueChange={(v) => updateKPI('novosLeads', v)}
            />
            <KPICard
              title="Alertas"
              value={currentData.kpis.alertas}
              icon={AlertTriangle}
              color="rose"
              subtitle={currentData.kpis.alertaTexto}
              onValueChange={(v) => updateKPI('alertas', v)}
              onSubtitleChange={(v) => updateKPI('alertaTexto', v)}
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
            onUpdatePositivos={updateInsightPositivo}
            onUpdateAtencao={updateInsightAtencao}
            onAddPositivo={addInsightPositivo}
            onAddAtencao={addInsightAtencao}
            onRemovePositivo={removeInsightPositivo}
            onRemoveAtencao={removeInsightAtencao}
          />

          {/* Tabelas */}
          <div className="space-y-6">
            <AtividadesTable
              atividades={currentData.atividades}
              title={selectedPeriod === 'semana_19_25' ? 'Atividades da Semana' : 'Novas Empresas (Entrada)'}
              onUpdate={updateAtividade}
              onAdd={addAtividade}
              onRemove={removeAtividade}
            />

            <FollowupsTable
              followups={currentData.followups}
              onUpdate={updateFollowup}
              onAdd={addFollowup}
              onRemove={removeFollowup}
            />
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
