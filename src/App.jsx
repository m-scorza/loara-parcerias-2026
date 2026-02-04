import { useState, useEffect, useCallback } from 'react'
import { DataProvider, useData } from './context/DataContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import Header from './components/Header'
import Navigation from './components/Navigation'
import Loading from './components/Loading'
import LoginScreen from './components/LoginScreen'
import TabSumario from './components/tabs/TabSumario'
import TabGraficos from './components/tabs/TabGraficos'
import TabCenarios from './components/tabs/TabCenarios'
import TabMetas from './components/tabs/TabMetas'
import TabDiagnostico from './components/tabs/TabDiagnostico'
import TabCompensacao from './components/tabs/TabCompensacao'
import TabProcessos from './components/tabs/TabProcessos'
import TabRiscos from './components/tabs/TabRiscos'
import TabKPIs from './components/tabs/TabKPIs'
import TabRoadmap from './components/tabs/TabRoadmap'
import TabGovernanca from './components/tabs/TabGovernanca'
import TabStatusComercial from './components/tabs/TabStatusComercial'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

// Componente de Notificação Toast
function Toast({ notification, onClose }) {
  if (!notification) return null

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500" />,
    info: <Info className="w-5 h-5 text-sky-500" />
  }

  const bgColors = {
    success: 'bg-emerald-50 border-emerald-200',
    error: 'bg-rose-50 border-rose-200',
    info: 'bg-sky-50 border-sky-200'
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg ${bgColors[notification.type]} animate-slideIn`}>
      {icons[notification.type]}
      <span className="text-sm font-medium text-slate-700">{notification.message}</span>
      <button onClick={onClose} className="p-1 hover:bg-white/50 rounded-lg transition-colors">
        <X className="w-4 h-4 text-slate-400" />
      </button>
    </div>
  )
}

function Dashboard() {
  const { data, loading, notification, setEditMode, editMode } = useData()
  const [activeTab, setActiveTab] = useState('sumario')

  // Atalhos de teclado
  const handleKeyDown = useCallback((e) => {
    // Ctrl/Cmd + E para toggle modo edição
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
      e.preventDefault()
      setEditMode(prev => !prev)
    }
    // Escape para sair do modo edição
    if (e.key === 'Escape' && editMode) {
      setEditMode(false)
    }
  }, [setEditMode, editMode])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  if (loading || !data) {
    return <Loading />
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'sumario':
        return <TabSumario />
      case 'graficos':
        return <TabGraficos />
      case 'cenarios':
        return <TabCenarios />
      case 'metas':
        return <TabMetas />
      case 'diagnostico':
        return <TabDiagnostico />
      case 'compensacao':
        return <TabCompensacao />
      case 'processos':
        return <TabProcessos />
      case 'riscos':
        return <TabRiscos />
      case 'kpis':
        return <TabKPIs />
      case 'roadmap':
        return <TabRoadmap />
      case 'governanca':
        return <TabGovernanca />
      case 'status':
        return <TabStatusComercial />
      default:
        return <TabSumario />
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {renderTab()}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-slate-500">{data.textos.footer_linha1}</p>
          <p className="text-xs text-slate-400 mt-1">{data.textos.footer_linha2}</p>
          <p className="text-xs text-slate-300 mt-3">
            Atalhos: <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500">Ctrl+E</kbd> Editar · <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500">Esc</kbd> Sair do modo edição
          </p>
        </div>
      </footer>

      {/* Toast Notification */}
      <Toast notification={notification} onClose={() => {}} />
    </div>
  )
}

// Componente que controla autenticação
function AuthenticatedApp() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <Loading />
  }

  if (!isAuthenticated) {
    return <LoginScreen />
  }

  return (
    <DataProvider>
      <Dashboard />
    </DataProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  )
}
