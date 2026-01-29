import { useState } from 'react'
import { DataProvider, useData } from './context/DataContext'
import Header from './components/Header'
import Navigation from './components/Navigation'
import Loading from './components/Loading'
import TabSumario from './components/tabs/TabSumario'
import TabCenarios from './components/tabs/TabCenarios'
import TabMetas from './components/tabs/TabMetas'
import TabDiagnostico from './components/tabs/TabDiagnostico'
import TabCompensacao from './components/tabs/TabCompensacao'
import TabProcessos from './components/tabs/TabProcessos'
import TabRiscos from './components/tabs/TabRiscos'
import TabKPIs from './components/tabs/TabKPIs'
import TabRoadmap from './components/tabs/TabRoadmap'
import TabGovernanca from './components/tabs/TabGovernanca'

function Dashboard() {
  const { data, loading } = useData()
  const [activeTab, setActiveTab] = useState('sumario')

  if (loading || !data) {
    return <Loading />
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'sumario':
        return <TabSumario />
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
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <DataProvider>
      <Dashboard />
    </DataProvider>
  )
}
