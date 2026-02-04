import { useState, useRef, useEffect } from 'react'
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
  Building2,
  PieChart,
  Activity,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const tabs = [
  { id: 'sumario', label: 'Sumário', icon: LayoutDashboard },
  { id: 'status', label: 'Status Comercial', icon: Activity },
  { id: 'cenarios', label: 'Cenários', icon: Target },
  { id: 'metas', label: 'Metas', icon: TrendingUp },
  { id: 'diagnostico', label: 'Diagnóstico', icon: Search },
  { id: 'compensacao', label: 'Compensação', icon: Users },
  { id: 'processos', label: 'Processos', icon: Settings },
  { id: 'riscos', label: 'Riscos', icon: AlertTriangle },
  { id: 'kpis', label: 'KPIs', icon: BarChart3 },
  { id: 'roadmap', label: 'Roadmap', icon: Map },
  { id: 'governanca', label: 'Governança', icon: Building2 },
  { id: 'graficos', label: 'Gráficos', icon: PieChart },
]

export default function Navigation({ activeTab, setActiveTab }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showLeftScroll, setShowLeftScroll] = useState(false)
  const [showRightScroll, setShowRightScroll] = useState(true)
  const scrollContainerRef = useRef(null)

  const activeTabData = tabs.find(t => t.id === activeTab)
  const ActiveIcon = activeTabData?.icon || LayoutDashboard

  // Verificar scroll position
  const checkScroll = () => {
    const container = scrollContainerRef.current
    if (container) {
      setShowLeftScroll(container.scrollLeft > 0)
      setShowRightScroll(container.scrollLeft < container.scrollWidth - container.clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScroll()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScroll)
      return () => container.removeEventListener('scroll', checkScroll)
    }
  }, [])

  const scroll = (direction) => {
    const container = scrollContainerRef.current
    if (container) {
      const scrollAmount = 200
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const handleTabClick = (tabId) => {
    setActiveTab(tabId)
    setMobileMenuOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Mobile: Menu hamburguer + Tab atual */}
        <div className="flex md:hidden items-center justify-between py-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center gap-2 px-3 py-2 bg-loara-50 rounded-xl text-loara-700 font-medium"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            <ActiveIcon className="w-4 h-4" />
            <span>{activeTabData?.label}</span>
          </button>
        </div>

        {/* Mobile: Menu expandido */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-slate-100 pt-3 animate-fadeIn">
            <div className="grid grid-cols-2 gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-loara-600 text-white shadow-lg'
                        : 'bg-slate-50 text-slate-600 hover:bg-loara-50 hover:text-loara-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Desktop: Tabs horizontais com scroll */}
        <div className="hidden md:flex items-center gap-1 py-3 relative">
          {/* Botão scroll esquerda */}
          {showLeftScroll && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 z-10 p-1.5 bg-white/90 hover:bg-white rounded-full shadow-md border border-slate-200 transition-all"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
          )}

          {/* Tabs container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-1 overflow-x-auto scrollbar-hide px-1"
          >
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

          {/* Botão scroll direita */}
          {showRightScroll && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 z-10 p-1.5 bg-white/90 hover:bg-white rounded-full shadow-md border border-slate-200 transition-all"
            >
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
