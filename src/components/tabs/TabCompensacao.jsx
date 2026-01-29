import { useData } from '../../context/DataContext'
import { formatCurrency } from '../../utils/format'
import EditableField from '../EditableField'
import { User, Target, DollarSign, Award, TrendingUp } from 'lucide-react'

export default function TabCompensacao() {
  const { data } = useData()
  const g = data.gerentes.matheus_scorza

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <span className="text-2xl">💰</span>
          {data.textos.titulo_compensacao}
        </h2>
        <p className="text-slate-500 mt-2">Modelo híbrido de compensação para a área de parcerias</p>
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
                  <EditableField
                    path="gerentes.matheus_scorza.nome"
                    value={g.nome}
                    className="text-white"
                  />
                </h3>
                <p className="text-loara-200 text-lg">
                  <EditableField
                    path="gerentes.matheus_scorza.cargo"
                    value={g.cargo}
                    className="text-loara-200"
                  />
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="px-4 py-2 bg-white/10 rounded-xl">
                <span className="text-sm text-loara-200">Carteira 2025</span>
                <span className="ml-2 font-bold">{g.carteira_2025}</span>
              </div>
              <div className="px-4 py-2 bg-emerald-500/30 rounded-xl">
                <span className="text-sm text-emerald-200">Meta 2026</span>
                <span className="ml-2 font-bold">{g.carteira_2026_meta}</span>
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
                  <EditableField
                    path="gerentes.matheus_scorza.carteira_2026_meta"
                    value={g.carteira_2026_meta}
                    type="number"
                    parser={parseInt}
                  />
                </div>
                <div className="text-sm text-slate-500 mt-1">Carteira Meta</div>
              </div>
              <div className="p-5 bg-slate-50 rounded-xl text-center">
                <div className="text-3xl font-bold text-slate-900">
                  <EditableField
                    path="gerentes.matheus_scorza.metas_2026.novos_parceiros"
                    value={g.metas_2026.novos_parceiros}
                    type="number"
                    parser={parseInt}
                  />
                </div>
                <div className="text-sm text-slate-500 mt-1">Novos Parceiros</div>
              </div>
              <div className="p-5 bg-slate-50 rounded-xl text-center">
                <div className="text-3xl font-bold text-slate-900">
                  <EditableField
                    path="gerentes.matheus_scorza.metas_2026.indicacoes"
                    value={g.metas_2026.indicacoes}
                    type="number"
                    parser={parseInt}
                  />
                </div>
                <div className="text-sm text-slate-500 mt-1">Indicações</div>
              </div>
              <div className="p-5 bg-slate-50 rounded-xl text-center">
                <div className="text-3xl font-bold text-slate-900">
                  <EditableField
                    path="gerentes.matheus_scorza.metas_2026.contratos"
                    value={g.metas_2026.contratos}
                    type="number"
                    parser={parseInt}
                  />
                </div>
                <div className="text-sm text-slate-500 mt-1">Contratos</div>
              </div>
              <div className="p-5 bg-sky-50 rounded-xl text-center">
                <div className="text-2xl font-bold text-sky-700">
                  <EditableField
                    path="gerentes.matheus_scorza.metas_2026.captacao"
                    value={g.metas_2026.captacao}
                    formatter={formatCurrency}
                    type="number"
                    parser={parseFloat}
                  />
                </div>
                <div className="text-sm text-sky-600 mt-1">Captação Meta</div>
              </div>
              <div className="p-5 bg-emerald-50 rounded-xl text-center">
                <div className="text-2xl font-bold text-emerald-700">
                  <EditableField
                    path="gerentes.matheus_scorza.metas_2026.receita_corporativa"
                    value={g.metas_2026.receita_corporativa}
                    formatter={formatCurrency}
                    type="number"
                    parser={parseFloat}
                  />
                </div>
                <div className="text-sm text-emerald-600 mt-1">Receita Meta</div>
              </div>
            </div>

            {/* Compensação */}
            <h4 className="font-semibold text-slate-700 mb-5 flex items-center gap-2 text-lg">
              <DollarSign className="w-5 h-5 text-emerald-500" />
              Compensação Anual
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-4 bg-loara-50 rounded-xl">
                <span className="text-slate-600 font-medium">Salário Base</span>
                <span className="text-xl font-bold">
                  <EditableField
                    path="gerentes.matheus_scorza.compensacao.salario_base_anual"
                    value={g.compensacao.salario_base_anual}
                    formatter={formatCurrency}
                    type="number"
                    parser={parseFloat}
                  />
                </span>
              </div>
              <div className="flex justify-between items-center p-4">
                <span className="text-slate-600">Comissão Recorrente</span>
                <span className="text-lg font-bold">
                  <EditableField
                    path="gerentes.matheus_scorza.compensacao.comissao_recorrente_anual"
                    value={g.compensacao.comissao_recorrente_anual}
                    formatter={formatCurrency}
                    type="number"
                    parser={parseFloat}
                  />
                </span>
              </div>
              <div className="flex justify-between items-center p-4">
                <span className="text-slate-600">Comissão Aquisição</span>
                <span className="text-lg font-bold">
                  <EditableField
                    path="gerentes.matheus_scorza.compensacao.comissao_aquisicao_anual"
                    value={g.compensacao.comissao_aquisicao_anual}
                    formatter={formatCurrency}
                    type="number"
                    parser={parseFloat}
                  />
                </span>
              </div>
              <div className="flex justify-between items-center p-4">
                <span className="text-slate-600">Bônus Anual</span>
                <span className="text-lg font-bold">
                  <EditableField
                    path="gerentes.matheus_scorza.compensacao.bonus_anual"
                    value={g.compensacao.bonus_anual}
                    formatter={formatCurrency}
                    type="number"
                    parser={parseFloat}
                  />
                </span>
              </div>
              <div className="flex justify-between items-center p-5 bg-emerald-100 rounded-xl border-2 border-emerald-200">
                <span className="font-bold text-emerald-800 text-lg">Total Anual</span>
                <span className="text-2xl font-bold text-emerald-700">
                  <EditableField
                    path="gerentes.matheus_scorza.compensacao.renda_total_anual"
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
