import { useState, useMemo } from 'react'
import { useData } from '../../context/DataContext'
import { formatCurrency } from '../../utils/format'
import { User, Target, DollarSign, Award, TrendingUp, Edit3, Save, X, Calculator, Info } from 'lucide-react'

// Componente de campo editável inline
function EditableValue({ value, onChange, type = 'number', formatter, prefix = '', suffix = '', className = '' }) {
  const { editMode } = useData()
  const [isEditing, setIsEditing] = useState(false)
  const [tempValue, setTempValue] = useState(value)

  const handleSave = () => {
    onChange(type === 'number' ? parseFloat(tempValue) || 0 : tempValue)
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
    return (
      <span className={className}>
        {prefix}{formatter ? formatter(value) : value}{suffix}
      </span>
    )
  }

  if (isEditing) {
    return (
      <span className="inline-flex items-center gap-1">
        <input
          type={type}
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-24 px-2 py-1 border border-loara-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-loara-500"
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
      className={`${className} cursor-pointer hover:bg-loara-100 px-2 py-1 rounded transition-colors border border-dashed border-transparent hover:border-loara-300`}
      onClick={() => {
        setTempValue(value)
        setIsEditing(true)
      }}
      title="Clique para editar"
    >
      {prefix}{formatter ? formatter(value) : value}{suffix}
      <Edit3 className="w-3 h-3 inline ml-1 opacity-50" />
    </span>
  )
}

// Estrutura de comissões editável
function ComissaoCard({ title, items, bgColor, textColor, onItemChange }) {
  const { editMode } = useData()

  return (
    <div className={`p-5 ${bgColor} rounded-xl`}>
      <h4 className={`font-bold ${textColor} mb-4`}>{title}</h4>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-slate-600">{item.label}</span>
            {editMode ? (
              <EditableValue
                value={item.value}
                onChange={(v) => onItemChange(i, v)}
                formatter={formatCurrency}
                className="font-semibold"
              />
            ) : (
              <span className="font-semibold">{formatCurrency(item.value)}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TabCompensacao() {
  const { data, updateData, editMode } = useData()
  const g = data.gerentes.matheus_scorza

  // Estado local para valores de comissão (estrutura editável)
  const [comissaoAquisicao, setComissaoAquisicao] = useState({
    parceiroQualificado: 500,
    primeiroContrato: 1000,
    primeiroCredito: 500
  })

  const [comissaoRecorrente, setComissaoRecorrente] = useState({
    ouro: 200,
    prata: 100,
    bronze: 50
  })

  const [bonusTrimestral, setBonusTrimestral] = useState({
    faixa80: 1500,
    faixa90: 2500,
    faixa100: 4000,
    faixa110: 5000
  })

  // Função para atualizar valor no data.json
  const handleUpdate = (path, value) => {
    updateData(path, value)
  }

  // Recalcular total de compensação automaticamente
  const totalCompensacao = useMemo(() => {
    return (
      (g.compensacao.salario_base_anual || 0) +
      (g.compensacao.comissao_aquisicao_anual || 0) +
      (g.compensacao.comissao_recorrente_anual || 0) +
      (g.compensacao.bonus_anual || 0)
    )
  }, [g.compensacao])

  // Atualizar total quando componentes mudam
  const updateComponentAndTotal = (path, value) => {
    updateData(path, value)
    // Recalcula o total após a atualização
    setTimeout(() => {
      const newTotal =
        (path.includes('salario_base_anual') ? value : g.compensacao.salario_base_anual) +
        (path.includes('comissao_aquisicao_anual') ? value : g.compensacao.comissao_aquisicao_anual) +
        (path.includes('comissao_recorrente_anual') ? value : g.compensacao.comissao_recorrente_anual) +
        (path.includes('bonus_anual') && !path.includes('renda') ? value : g.compensacao.bonus_anual)
      updateData('gerentes.matheus_scorza.compensacao.renda_total_anual', newTotal)
    }, 100)
  }

  // Recalcular salário anual quando mensal muda
  const updateSalarioMensal = (value) => {
    updateData('gerentes.matheus_scorza.compensacao.salario_base_mensal', value)
    updateData('gerentes.matheus_scorza.compensacao.salario_base_anual', value * 12)
    // Atualizar total
    setTimeout(() => {
      const newTotal = (value * 12) + g.compensacao.comissao_aquisicao_anual + g.compensacao.comissao_recorrente_anual + g.compensacao.bonus_anual
      updateData('gerentes.matheus_scorza.compensacao.renda_total_anual', newTotal)
    }, 100)
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <span className="text-2xl">💰</span>
          {data.textos.titulo_compensacao}
        </h2>
        <p className="text-slate-500 mt-2">Modelo híbrido de compensação para a área de parcerias</p>
        {editMode && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <strong>Modo de edição ativo:</strong> Clique em qualquer valor para editar. Os totais são recalculados automaticamente.
            </div>
          </div>
        )}
      </div>

      {/* Card do Matheus */}
      <div className="max-w-2xl mx-auto">
        <div className="card overflow-hidden">
          {/* Header com foto/iniciais */}
          <div className="bg-gradient-to-r from-loara-600 to-loara-700 p-8 text-white">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-3xl font-bold">
                {g.nome.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-2xl font-bold">
                  {editMode ? (
                    <EditableValue
                      value={g.nome}
                      onChange={(v) => handleUpdate('gerentes.matheus_scorza.nome', v)}
                      type="text"
                      className="text-white"
                    />
                  ) : g.nome}
                </h3>
                <p className="text-loara-200 text-lg">
                  {editMode ? (
                    <EditableValue
                      value={g.cargo}
                      onChange={(v) => handleUpdate('gerentes.matheus_scorza.cargo', v)}
                      type="text"
                      className="text-loara-200"
                    />
                  ) : g.cargo}
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="px-4 py-2 bg-white/10 rounded-xl">
                <span className="text-sm text-loara-200">Carteira 2025</span>
                <span className="ml-2 font-bold">
                  {editMode ? (
                    <EditableValue
                      value={g.carteira_2025}
                      onChange={(v) => handleUpdate('gerentes.matheus_scorza.carteira_2025', v)}
                      className="text-white"
                    />
                  ) : g.carteira_2025}
                </span>
              </div>
              <div className="px-4 py-2 bg-emerald-500/30 rounded-xl">
                <span className="text-sm text-emerald-200">Meta 2026</span>
                <span className="ml-2 font-bold">
                  {editMode ? (
                    <EditableValue
                      value={g.carteira_2026_meta}
                      onChange={(v) => handleUpdate('gerentes.matheus_scorza.carteira_2026_meta', v)}
                      className="text-white"
                    />
                  ) : g.carteira_2026_meta}
                </span>
              </div>
              <div className="px-4 py-2 bg-white/10 rounded-xl">
                <span className="text-sm text-loara-200">Proporção</span>
                <span className="ml-2 font-bold">100%</span>
              </div>
            </div>
          </div>

          {/* Metas */}
          <div className="p-8">
            <h4 className="font-semibold text-slate-700 mb-5 flex items-center gap-2 text-lg">
              <Target className="w-5 h-5 text-loara-500" />
              Metas 2026
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <div className="p-5 bg-slate-50 rounded-xl text-center">
                <div className="text-3xl font-bold text-slate-900">
                  {editMode ? (
                    <EditableValue
                      value={g.carteira_2026_meta}
                      onChange={(v) => handleUpdate('gerentes.matheus_scorza.carteira_2026_meta', v)}
                    />
                  ) : g.carteira_2026_meta}
                </div>
                <div className="text-sm text-slate-500 mt-1">Carteira Meta</div>
              </div>
              <div className="p-5 bg-slate-50 rounded-xl text-center">
                <div className="text-3xl font-bold text-slate-900">
                  {editMode ? (
                    <EditableValue
                      value={g.metas_2026.novos_parceiros}
                      onChange={(v) => handleUpdate('gerentes.matheus_scorza.metas_2026.novos_parceiros', v)}
                    />
                  ) : g.metas_2026.novos_parceiros}
                </div>
                <div className="text-sm text-slate-500 mt-1">Novos Parceiros</div>
              </div>
              <div className="p-5 bg-slate-50 rounded-xl text-center">
                <div className="text-3xl font-bold text-slate-900">
                  {editMode ? (
                    <EditableValue
                      value={g.metas_2026.indicacoes}
                      onChange={(v) => handleUpdate('gerentes.matheus_scorza.metas_2026.indicacoes', v)}
                    />
                  ) : g.metas_2026.indicacoes}
                </div>
                <div className="text-sm text-slate-500 mt-1">Indicações</div>
              </div>
              <div className="p-5 bg-slate-50 rounded-xl text-center">
                <div className="text-3xl font-bold text-slate-900">
                  {editMode ? (
                    <EditableValue
                      value={g.metas_2026.contratos}
                      onChange={(v) => handleUpdate('gerentes.matheus_scorza.metas_2026.contratos', v)}
                    />
                  ) : g.metas_2026.contratos}
                </div>
                <div className="text-sm text-slate-500 mt-1">Contratos</div>
              </div>
              <div className="p-5 bg-sky-50 rounded-xl text-center">
                <div className="text-2xl font-bold text-sky-700">
                  {editMode ? (
                    <EditableValue
                      value={g.metas_2026.captacao}
                      onChange={(v) => handleUpdate('gerentes.matheus_scorza.metas_2026.captacao', v)}
                      formatter={formatCurrency}
                    />
                  ) : formatCurrency(g.metas_2026.captacao)}
                </div>
                <div className="text-sm text-sky-600 mt-1">Captação Meta</div>
              </div>
              <div className="p-5 bg-emerald-50 rounded-xl text-center">
                <div className="text-2xl font-bold text-emerald-700">
                  {editMode ? (
                    <EditableValue
                      value={g.metas_2026.receita_corporativa}
                      onChange={(v) => handleUpdate('gerentes.matheus_scorza.metas_2026.receita_corporativa', v)}
                      formatter={formatCurrency}
                    />
                  ) : formatCurrency(g.metas_2026.receita_corporativa)}
                </div>
                <div className="text-sm text-emerald-600 mt-1">Receita Meta</div>
              </div>
            </div>

            {/* Compensação */}
            <h4 className="font-semibold text-slate-700 mb-5 flex items-center gap-2 text-lg">
              <DollarSign className="w-5 h-5 text-emerald-500" />
              Compensação Anual
              {editMode && (
                <span className="text-xs font-normal text-slate-400 ml-2 flex items-center gap-1">
                  <Calculator className="w-3 h-3" />
                  Total recalculado automaticamente
                </span>
              )}
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-4 bg-loara-50 rounded-xl">
                <div>
                  <span className="text-slate-600 font-medium">Salário Base</span>
                  {editMode && (
                    <span className="text-xs text-slate-400 ml-2">
                      (
                      <EditableValue
                        value={g.compensacao.salario_base_mensal}
                        onChange={updateSalarioMensal}
                        formatter={formatCurrency}
                      />
                      /mês)
                    </span>
                  )}
                </div>
                <span className="text-xl font-bold">
                  {editMode ? (
                    <EditableValue
                      value={g.compensacao.salario_base_anual}
                      onChange={(v) => updateComponentAndTotal('gerentes.matheus_scorza.compensacao.salario_base_anual', v)}
                      formatter={formatCurrency}
                    />
                  ) : formatCurrency(g.compensacao.salario_base_anual)}
                </span>
              </div>
              <div className="flex justify-between items-center p-4">
                <span className="text-slate-600">Comissão Recorrente</span>
                <span className="text-lg font-bold">
                  {editMode ? (
                    <EditableValue
                      value={g.compensacao.comissao_recorrente_anual}
                      onChange={(v) => updateComponentAndTotal('gerentes.matheus_scorza.compensacao.comissao_recorrente_anual', v)}
                      formatter={formatCurrency}
                    />
                  ) : formatCurrency(g.compensacao.comissao_recorrente_anual)}
                </span>
              </div>
              <div className="flex justify-between items-center p-4">
                <span className="text-slate-600">Comissão Aquisição</span>
                <span className="text-lg font-bold">
                  {editMode ? (
                    <EditableValue
                      value={g.compensacao.comissao_aquisicao_anual}
                      onChange={(v) => updateComponentAndTotal('gerentes.matheus_scorza.compensacao.comissao_aquisicao_anual', v)}
                      formatter={formatCurrency}
                    />
                  ) : formatCurrency(g.compensacao.comissao_aquisicao_anual)}
                </span>
              </div>
              <div className="flex justify-between items-center p-4">
                <span className="text-slate-600">Bônus Anual</span>
                <span className="text-lg font-bold">
                  {editMode ? (
                    <EditableValue
                      value={g.compensacao.bonus_anual}
                      onChange={(v) => updateComponentAndTotal('gerentes.matheus_scorza.compensacao.bonus_anual', v)}
                      formatter={formatCurrency}
                    />
                  ) : formatCurrency(g.compensacao.bonus_anual)}
                </span>
              </div>
              <div className="flex justify-between items-center p-5 bg-emerald-100 rounded-xl border-2 border-emerald-200">
                <span className="font-bold text-emerald-800 text-lg">Total Anual</span>
                <span className="text-2xl font-bold text-emerald-700">
                  {formatCurrency(totalCompensacao)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estrutura de Comissões */}
      <div className="card p-6">
        <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Award className="w-5 h-5 text-loara-500" />
          {data.textos.titulo_compensacao_det}
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Salário Base */}
          <div className="p-5 bg-loara-50 rounded-xl">
            <h4 className="font-bold text-loara-800 mb-4">Salário Base</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Gerente Sênior</span>
                {editMode ? (
                  <EditableValue
                    value={g.compensacao.salario_base_mensal}
                    onChange={updateSalarioMensal}
                    formatter={formatCurrency}
                    suffix="/mês"
                    className="font-semibold"
                  />
                ) : (
                  <span className="font-semibold">{formatCurrency(g.compensacao.salario_base_mensal)}/mês</span>
                )}
              </div>
            </div>
          </div>

          {/* Comissão Aquisição */}
          <div className="p-5 bg-emerald-50 rounded-xl">
            <h4 className="font-bold text-emerald-800 mb-4">Comissão Aquisição</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Parceiro Qualificado</span>
                {editMode ? (
                  <EditableValue
                    value={comissaoAquisicao.parceiroQualificado}
                    onChange={(v) => setComissaoAquisicao(prev => ({ ...prev, parceiroQualificado: v }))}
                    formatter={formatCurrency}
                    className="font-semibold"
                  />
                ) : (
                  <span className="font-semibold">{formatCurrency(comissaoAquisicao.parceiroQualificado)}</span>
                )}
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Primeiro Contrato</span>
                {editMode ? (
                  <EditableValue
                    value={comissaoAquisicao.primeiroContrato}
                    onChange={(v) => setComissaoAquisicao(prev => ({ ...prev, primeiroContrato: v }))}
                    formatter={formatCurrency}
                    className="font-semibold"
                  />
                ) : (
                  <span className="font-semibold">{formatCurrency(comissaoAquisicao.primeiroContrato)}</span>
                )}
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Primeiro Crédito</span>
                {editMode ? (
                  <EditableValue
                    value={comissaoAquisicao.primeiroCredito}
                    onChange={(v) => setComissaoAquisicao(prev => ({ ...prev, primeiroCredito: v }))}
                    formatter={formatCurrency}
                    className="font-semibold"
                  />
                ) : (
                  <span className="font-semibold">{formatCurrency(comissaoAquisicao.primeiroCredito)}</span>
                )}
              </div>
            </div>
          </div>

          {/* Comissão Recorrente */}
          <div className="p-5 bg-amber-50 rounded-xl">
            <h4 className="font-bold text-amber-800 mb-4">Comissão Recorrente</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Parceiro OURO</span>
                {editMode ? (
                  <EditableValue
                    value={comissaoRecorrente.ouro}
                    onChange={(v) => setComissaoRecorrente(prev => ({ ...prev, ouro: v }))}
                    formatter={formatCurrency}
                    suffix="/mês"
                    className="font-semibold"
                  />
                ) : (
                  <span className="font-semibold">{formatCurrency(comissaoRecorrente.ouro)}/mês</span>
                )}
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Parceiro PRATA</span>
                {editMode ? (
                  <EditableValue
                    value={comissaoRecorrente.prata}
                    onChange={(v) => setComissaoRecorrente(prev => ({ ...prev, prata: v }))}
                    formatter={formatCurrency}
                    suffix="/mês"
                    className="font-semibold"
                  />
                ) : (
                  <span className="font-semibold">{formatCurrency(comissaoRecorrente.prata)}/mês</span>
                )}
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Parceiro BRONZE</span>
                {editMode ? (
                  <EditableValue
                    value={comissaoRecorrente.bronze}
                    onChange={(v) => setComissaoRecorrente(prev => ({ ...prev, bronze: v }))}
                    formatter={formatCurrency}
                    suffix="/mês"
                    className="font-semibold"
                  />
                ) : (
                  <span className="font-semibold">{formatCurrency(comissaoRecorrente.bronze)}/mês</span>
                )}
              </div>
            </div>
          </div>

          {/* Bônus Trimestral */}
          <div className="p-5 bg-violet-50 rounded-xl">
            <h4 className="font-bold text-violet-800 mb-4">Bônus Trimestral</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">80-89% meta</span>
                {editMode ? (
                  <EditableValue
                    value={bonusTrimestral.faixa80}
                    onChange={(v) => setBonusTrimestral(prev => ({ ...prev, faixa80: v }))}
                    formatter={formatCurrency}
                    className="font-semibold"
                  />
                ) : (
                  <span className="font-semibold">{formatCurrency(bonusTrimestral.faixa80)}</span>
                )}
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">90-99% meta</span>
                {editMode ? (
                  <EditableValue
                    value={bonusTrimestral.faixa90}
                    onChange={(v) => setBonusTrimestral(prev => ({ ...prev, faixa90: v }))}
                    formatter={formatCurrency}
                    className="font-semibold"
                  />
                ) : (
                  <span className="font-semibold">{formatCurrency(bonusTrimestral.faixa90)}</span>
                )}
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">100-109% meta</span>
                {editMode ? (
                  <EditableValue
                    value={bonusTrimestral.faixa100}
                    onChange={(v) => setBonusTrimestral(prev => ({ ...prev, faixa100: v }))}
                    formatter={formatCurrency}
                    className="font-semibold"
                  />
                ) : (
                  <span className="font-semibold">{formatCurrency(bonusTrimestral.faixa100)}</span>
                )}
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">≥110% meta</span>
                {editMode ? (
                  <EditableValue
                    value={bonusTrimestral.faixa110}
                    onChange={(v) => setBonusTrimestral(prev => ({ ...prev, faixa110: v }))}
                    formatter={formatCurrency}
                    className="font-semibold text-violet-700"
                  />
                ) : (
                  <span className="font-semibold text-violet-700">{formatCurrency(bonusTrimestral.faixa110)}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
