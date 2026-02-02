import { useState } from 'react'
import { useData } from '../../context/DataContext'
import { BarChart3, Target, Clock, Calculator, Edit3, Save, X, Plus, Trash2, Info } from 'lucide-react'

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

// Componente de campo editável inline
function EditableText({ value, onChange, className = '', placeholder = '' }) {
  const { editMode } = useData()
  const [isEditing, setIsEditing] = useState(false)
  const [tempValue, setTempValue] = useState(value)

  const handleSave = () => {
    onChange(tempValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTempValue(value)
    setIsEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') handleCancel()
  }

  if (!editMode) {
    return <span className={className}>{value}</span>
  }

  if (isEditing) {
    return (
      <span className="inline-flex items-center gap-1">
        <input
          type="text"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="px-2 py-1 border border-loara-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-loara-500 min-w-[100px]"
          autoFocus
        />
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
      {value || <span className="text-slate-400 italic">{placeholder}</span>}
      <Edit3 className="w-3 h-3 inline ml-1 opacity-50" />
    </span>
  )
}

export default function TabKPIs() {
  const { data, updateData, editMode } = useData()

  // Atualizar um campo específico de um KPI
  const updateKPI = (index, field, value) => {
    updateData(`kpis[${index}].${field}`, value)
  }

  // Adicionar novo KPI
  const addKPI = () => {
    const newKPI = {
      nome: 'Novo KPI',
      formula: 'Defina a fórmula',
      meta: 'Defina a meta',
      frequencia: 'Mensal'
    }
    const newKPIs = [...data.kpis, newKPI]
    updateData('kpis', newKPIs)
  }

  // Remover KPI
  const removeKPI = (index) => {
    const newKPIs = data.kpis.filter((_, i) => i !== index)
    updateData('kpis', newKPIs)
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <span className="text-2xl">📊</span>
          {data.textos.titulo_kpis}
        </h2>
        <p className="text-slate-500 mt-2">Métricas de acompanhamento e metas para a área de parcerias</p>
        {editMode && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <strong>Modo de edição ativo:</strong> Clique em qualquer valor para editar. Você pode adicionar ou remover KPIs.
            </div>
          </div>
        )}
      </div>

      {/* Botão Adicionar KPI */}
      {editMode && (
        <div className="flex justify-end">
          <button
            onClick={addKPI}
            className="flex items-center gap-2 px-4 py-2 bg-loara-600 text-white rounded-xl hover:bg-loara-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Adicionar KPI
          </button>
        </div>
      )}

      {/* Grid de KPIs */}
      <div className="grid md:grid-cols-2 gap-4">
        {data.kpis.map((k, i) => {
          const colors = kpiColors[i % kpiColors.length]

          return (
            <div key={i} className={`card overflow-hidden card-hover border ${colors.border} relative`}>
              {/* Botão Remover */}
              {editMode && (
                <button
                  onClick={() => removeKPI(i)}
                  className="absolute top-3 right-3 p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors z-10"
                  title="Remover KPI"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center text-white shadow-lg`}>
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">
                        {editMode ? (
                          <EditableText
                            value={k.nome}
                            onChange={(v) => updateKPI(i, 'nome', v)}
                            placeholder="Nome do KPI"
                          />
                        ) : k.nome}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500 mt-1">
                        <Clock className="w-3 h-3" />
                        {editMode ? (
                          <EditableText
                            value={k.frequencia}
                            onChange={(v) => updateKPI(i, 'frequencia', v)}
                            placeholder="Frequência"
                          />
                        ) : k.frequencia}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`p-4 ${colors.light} rounded-xl mb-4`}>
                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                    <Calculator className="w-4 h-4" />
                    Fórmula
                  </div>
                  {editMode ? (
                    <EditableText
                      value={k.formula}
                      onChange={(v) => updateKPI(i, 'formula', v)}
                      className="text-sm font-mono text-slate-800"
                      placeholder="Defina a fórmula"
                    />
                  ) : (
                    <code className="text-sm font-mono text-slate-800">{k.formula}</code>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Target className="w-4 h-4" />
                    Meta
                  </div>
                  <div className="text-2xl font-bold text-loara-600">
                    {editMode ? (
                      <EditableText
                        value={k.meta}
                        onChange={(v) => updateKPI(i, 'meta', v)}
                        placeholder="Meta"
                      />
                    ) : k.meta}
                  </div>
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
                {editMode && <th className="p-4 text-center font-semibold text-slate-600 w-16">Ações</th>}
              </tr>
            </thead>
            <tbody>
              {data.kpis.map((k, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-900">
                    {editMode ? (
                      <EditableText
                        value={k.nome}
                        onChange={(v) => updateKPI(i, 'nome', v)}
                        placeholder="Nome"
                      />
                    ) : k.nome}
                  </td>
                  <td className="p-4 text-sm text-slate-600 font-mono">
                    {editMode ? (
                      <EditableText
                        value={k.formula}
                        onChange={(v) => updateKPI(i, 'formula', v)}
                        placeholder="Fórmula"
                      />
                    ) : k.formula}
                  </td>
                  <td className="p-4 text-center">
                    {editMode ? (
                      <EditableText
                        value={k.meta}
                        onChange={(v) => updateKPI(i, 'meta', v)}
                        className="inline-flex px-3 py-1 bg-loara-100 text-loara-700 rounded-full text-sm font-semibold"
                        placeholder="Meta"
                      />
                    ) : (
                      <span className="inline-flex px-3 py-1 bg-loara-100 text-loara-700 rounded-full text-sm font-semibold">
                        {k.meta}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center text-slate-600">
                    {editMode ? (
                      <EditableText
                        value={k.frequencia}
                        onChange={(v) => updateKPI(i, 'frequencia', v)}
                        placeholder="Frequência"
                      />
                    ) : k.frequencia}
                  </td>
                  {editMode && (
                    <td className="p-4 text-center">
                      <button
                        onClick={() => removeKPI(i)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Remover"
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
    </div>
  )
}
