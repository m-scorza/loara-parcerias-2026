import {
  LayoutDashboard,
  Target,
  TrendingUp,
  Search,
  Users,
  Settings,
  AlertTriangle,
  BarChart3,
  Map,
  Building2
} from 'lucide-react'

const tabs = [
  { id: 'sumario', label: 'Sumário', icon: LayoutDashboard },
  { id: 'cenarios', label: 'Cenários', icon: Target },
  { id: 'metas', label: 'Metas', icon: TrendingUp },
  { id: 'diagnostico', label: 'Diagnóstico', icon: Search },
  { id: 'compensacao', label: 'Compensação', icon: Users },
  { id: 'processos', label: 'Processos', icon: Settings },
  { id: 'riscos', label: 'Riscos', icon: AlertTriangle },
  { id: 'kpis', label: 'KPIs', icon: BarChart3 },
  { id: 'roadmap', label: 'Roadmap', icon: Map },
  { id: 'governanca', label: 'Governança', icon: Building2 },
]

export default function Navigation({ activeTab, setActiveTab }) {
  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-button flex items-center gap-2 whitespace-nowrap ${
                  isActive ? 'tab-button-active' : 'tab-button-inactive'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
