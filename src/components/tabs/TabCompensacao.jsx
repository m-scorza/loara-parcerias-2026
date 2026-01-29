import { useData } from '../../context/DataContext'
import { formatCurrency } from '../../utils/format'
import EditableField from '../EditableField'
import { User, Target, DollarSign, Award, TrendingUp } from 'lucide-react'

export default function TabCompensacao() {
  const { data } = useData()

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <span className="text-2xl">💰</span>
          {data.textos.titulo_compensacao}
        </h2>
        <p className="text-slate-500 mt-2">Modelo híbrido de compensação para a equipe de parcerias</p>
      </div>

      {/* Cards por Gerente */}
      <div className="grid lg:grid-cols-2 gap-6">
        {Object.entries(data.gerentes).map(([key, g]) => (
          <div key={key} className="card overflow-hidden">
            {/* Header com foto/iniciais */}
            <div className="bg-gradient-to-r from-loara-600 to-loara-700 p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-bold">
                  {g.nome.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-xl font-bold">
                    <EditableField
                      path={`gerentes.${key}.nome`}
                      value={g.nome}
                      className="text-white"
                    />
                  </h3>
                  <p className="text-loara-200">
                    <EditableField
                      path={`gerentes.${key}.cargo`}
                      value={g.cargo}
                      className="text-loara-200"
                    />
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-4 text-sm">
                <div className="px-3 py-1 bg-white/10 rounded-full">
                  Carteira 2025: {g.carteira_2025}
                </div>
                <div className="px-3 py-1 bg-emerald-500/30 rounded-full">
                  Meta 2026: {g.carteira_2026_meta}
                </div>
              </div>
            </div>

            {/* Metas */}
            <div className="p-6">
              <h4 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 text-loara-500" />
                Metas 2026
              </h4>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-4 bg-slate-50 rounded-xl text-center">
                  <div className="text-2xl font-bold text-slate-900">
                    <EditableField
                      path={`gerentes.${key}.carteira_2026_meta`}
                      value={g.carteira_2026_meta}
                      type="number"
                      parser={parseInt}
                    />
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Carteira Meta</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl text-center">
                  <div className="text-2xl font-bold text-slate-900">
                    <EditableField
                      path={`gerentes.${key}.metas_2026.novos_parceiros`}
                      value={g.metas_2026.novos_parceiros}
                      type="number"
                      parser={parseInt}
                    />
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Novos Parceiros</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl text-center">
                  <div className="text-2xl font-bold text-slate-900">
                    <EditableField
                      path={`gerentes.${key}.metas_2026.indicacoes`}
                      value={g.metas_2026.indicacoes}
                      type="number"
                      parser={parseInt}
                    />
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Indicações</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl text-center">
                  <div className="text-2xl font-bold text-slate-900">
                    <EditableField
                      path={`gerentes.${key}.metas_2026.contratos`}
                      value={g.metas_2026.contratos}
                      type="number"
                      parser={parseInt}
                    />
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Contratos</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-4 bg-sky-50 rounded-xl text-center">
                  <div className="text-xl font-bold text-sky-700">
                    <EditableField
                      path={`gerentes.${key}.metas_2026.captacao`}
                      value={g.metas_2026.captacao}
                      formatter={formatCurrency}
                      type="number"
                      parser={parseFloat}
                    />
                  </div>
                  <div className="text-xs text-sky-600 mt-1">Captação Meta</div>
                </div>
                <div className="p-4 bg-emerald-50 rounded-xl text-center">
                  <div className="text-xl font-bold text-emerald-700">
                    <EditableField
                      path={`gerentes.${key}.metas_2026.receita_corporativa`}
                      value={g.metas_2026.receita_corporativa}
                      formatter={formatCurrency}
                      type="number"
                      parser={parseFloat}
                    />
                  </div>
                  <div className="text-xs text-emerald-600 mt-1">Receita Meta</div>
                </div>
              </div>

              {/* Compensação */}
              <h4 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                Compensação Anual
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between p-3 bg-loara-50 rounded-lg">
                  <span className="text-slate-600">Salário Base</span>
                  <span className="font-bold">
                    <EditableField
                      path={`gerentes.${key}.compensacao.salario_base_anual`}
                      value={g.compensacao.salario_base_anual}
                      formatter={formatCurrency}
                      type="number"
                      parser={parseFloat}
                    />
                  </span>
                </div>
                <div className="flex justify-between p-3">
                  <span className="text-slate-600">Comissão Recorrente</span>
                  <span className="font-bold">
                    <EditableField
                      path={`gerentes.${key}.compensacao.comissao_recorrente_anual`}
                      value={g.compensacao.comissao_recorrente_anual}
                      formatter={formatCurrency}
                      type="number"
                      parser={parseFloat}
                    />
                  </span>
                </div>
                <div className="flex justify-between p-3">
                  <span className="text-slate-600">Comissão Aquisição</span>
                  <span className="font-bold">
                    <EditableField
                      path={`gerentes.${key}.compensacao.comissao_aquisicao_anual`}
                      value={g.compensacao.comissao_aquisicao_anual}
                      formatter={formatCurrency}
                      type="number"
                      parser={parseFloat}
                    />
                  </span>
                </div>
                <div className="flex justify-between p-3">
                  <span className="text-slate-600">Bônus Anual</span>
                  <span className="font-bold">
                    <EditableField
                      path={`gerentes.${key}.compensacao.bonus_anual`}
                      value={g.compensacao.bonus_anual}
                      formatter={formatCurrency}
                      type="number"
                      parser={parseFloat}
                    />
                  </span>
                </div>
                <div className="flex justify-between p-4 bg-emerald-100 rounded-lg border border-emerald-200">
                  <span className="font-semibold text-emerald-800">Total Anual</span>
                  <span className="text-xl font-bold text-emerald-700">
                    <EditableField
                      path={`gerentes.${key}.compensacao.renda_total_anual`}
                      value={g.compensacao.renda_total_anual}
                      formatter={formatCurrency}
                      type="number"
                      parser={parseFloat}
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
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
                <span className="font-semibold">R$ 8.000/mês</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Gerente</span>
                <span className="font-semibold">R$ 6.500/mês</span>
              </div>
            </div>
          </div>

          {/* Comissão Aquisição */}
          <div className="p-5 bg-emerald-50 rounded-xl">
            <h4 className="font-bold text-emerald-800 mb-4">Comissão Aquisição</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Parceiro Qualificado</span>
                <span className="font-semibold">R$ 500</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Primeiro Contrato</span>
                <span className="font-semibold">R$ 1.000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Primeiro Crédito</span>
                <span className="font-semibold">R$ 500</span>
              </div>
            </div>
          </div>

          {/* Comissão Recorrente */}
          <div className="p-5 bg-amber-50 rounded-xl">
            <h4 className="font-bold text-amber-800 mb-4">Comissão Recorrente</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Parceiro OURO</span>
                <span className="font-semibold">R$ 200/mês</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Parceiro PRATA</span>
                <span className="font-semibold">R$ 100/mês</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Parceiro BRONZE</span>
                <span className="font-semibold">R$ 50/mês</span>
              </div>
            </div>
          </div>

          {/* Bônus Trimestral */}
          <div className="p-5 bg-violet-50 rounded-xl">
            <h4 className="font-bold text-violet-800 mb-4">Bônus Trimestral</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">80-89% meta</span>
                <span className="font-semibold">R$ 1.500</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">90-99% meta</span>
                <span className="font-semibold">R$ 2.500</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">100-109% meta</span>
                <span className="font-semibold">R$ 4.000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">≥110% meta</span>
                <span className="font-semibold text-violet-700">R$ 5.000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
