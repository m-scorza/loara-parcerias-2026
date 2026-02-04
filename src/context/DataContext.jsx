import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'

const DataContext = createContext()

// Versão dos dados - incrementar sempre que data.json for atualizado significativamente
const DATA_VERSION = '2026.02.03'
const STORAGE_KEY = 'loara-planejamento-2026'
const VERSION_KEY = 'loara-planejamento-version'
const AUTO_SAVE_DELAY = 2000 // 2 segundos de debounce

// Dados iniciais do status comercial (antes estavam hardcoded no componente)
const initialStatusData = {
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
      { empresa: 'Indústria Têxtil Tatuí', responsavel: 'Marcos', status: 'contrato', detalhe: 'Visita 20/01' },
      { empresa: 'Grupo Moby Dick', responsavel: 'Eric', status: 'contrato', detalhe: 'Reunião 19/01' },
      { empresa: 'Movitra e Sr. Alves', responsavel: 'Luciano Macedo', status: 'minuta', detalhe: 'Reunião 22/01' },
      { empresa: 'Albassi', responsavel: 'Beccari', status: 'minuta', detalhe: 'Reunião 23/01' },
      { empresa: 'Riopar', responsavel: 'Bruno Roquini', status: 'minuta', detalhe: 'Reunião 20/01' },
      { empresa: 'Cerâmica Strufaldi', responsavel: 'Marcos', status: 'minuta', detalhe: 'Visita 20/01' },
      { empresa: 'Thor Implementos', responsavel: 'Thales', status: 'minuta', detalhe: 'Reunião 20/01' },
      { empresa: 'GF Engenharia', responsavel: 'Celso', status: 'varredura', detalhe: 'Em análise' },
      { empresa: 'Panimundi', responsavel: 'Bruno Roquini', status: 'congelada', detalhe: 'Desenquadrou na varredura' },
      { empresa: 'Ribeiro Salgados', responsavel: 'Thales', status: 'noshow', detalhe: 'Reagendar' },
      { empresa: 'Wert', responsavel: 'Luciano Macedo', status: 'descartada', detalhe: 'Restritivos' },
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
      { empresa: 'BBB Madeiras', responsavel: 'Eric', status: 'minuta', detalhe: 'Reunião realizada 26/01' },
      { empresa: 'Casa de Carnes Califórnia', responsavel: 'Celso Miguel', status: 'agendar', detalhe: 'Marcar reunião' },
      { empresa: 'Ezlan Empreendimentos', responsavel: 'Vanessa', status: 'agendar', detalhe: 'Marcar reunião' },
      { empresa: 'Estilo 360 Vestuário', responsavel: 'Claudine', status: 'agendar', detalhe: 'Marcar reunião' },
      { empresa: 'Hyde Alimentos', responsavel: 'Eric', status: 'agendar', detalhe: 'Marcar reunião' },
      { empresa: 'Amaral e Passos', responsavel: 'Claudine', status: 'descartada', detalhe: 'Restritivos' },
      { empresa: 'Império Imports', responsavel: 'Claudine', status: 'descartada', detalhe: 'Restritivos' },
    ],
    followups: [
      { empresa: 'Lead Renato', responsavel: '-', status: 'minuta', observacao: 'Aguardando resposta' },
      { empresa: 'Marcelo e Nelson', responsavel: '-', status: 'followup', observacao: 'Estratégia: Provocação com posts de comissão' },
    ]
  }
}

export function DataProvider({ children }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [notification, setNotification] = useState(null)
  const autoSaveTimerRef = useRef(null)
  const lastSavedDataRef = useRef(null)

  // Mostrar notificação
  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }, [])

  // Auto-save com debounce
  const scheduleAutoSave = useCallback((newData) => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current)
    }
    autoSaveTimerRef.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
      localStorage.setItem(VERSION_KEY, DATA_VERSION)
      lastSavedDataRef.current = JSON.stringify(newData)
      showNotification('Alterações salvas automaticamente', 'success')
    }, AUTO_SAVE_DELAY)
  }, [showNotification])

  useEffect(() => {
    loadData()

    // Cleanup auto-save timer on unmount
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [])

  // Aviso ao sair com alterações não salvas
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasChanges) {
        e.preventDefault()
        e.returnValue = 'Você tem alterações não salvas. Deseja sair?'
        return e.returnValue
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasChanges])

  const loadData = async () => {
    try {
      // Verifica se a versão dos dados no localStorage está atualizada
      const savedVersion = localStorage.getItem(VERSION_KEY)
      const savedData = localStorage.getItem(STORAGE_KEY)

      // Se a versão é diferente ou não existe, força recarregar do servidor
      const needsRefresh = savedVersion !== DATA_VERSION

      if (!needsRefresh && savedData) {
        const parsedData = JSON.parse(savedData)
        // Verificação adicional: os dados precisam ter os campos corretos
        if (parsedData.parceiros_lista &&
            parsedData.parceiros_lista.length > 0 &&
            parsedData.parceiros_lista[0].hasOwnProperty('empresasCIC')) {
          // Garantir que status_comercial existe
          if (!parsedData.status_comercial) {
            parsedData.status_comercial = initialStatusData
          }
          setData(parsedData)
          lastSavedDataRef.current = JSON.stringify(parsedData)
          setLoading(false)
          return
        }
      }

      // Carrega dados frescos do data.json
      const response = await fetch('./data.json')
      const jsonData = await response.json()

      // Garantir que status_comercial existe
      if (!jsonData.status_comercial) {
        jsonData.status_comercial = initialStatusData
      }

      setData(jsonData)
      lastSavedDataRef.current = JSON.stringify(jsonData)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(jsonData))
      localStorage.setItem(VERSION_KEY, DATA_VERSION)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateData = useCallback((path, value) => {
    setData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData))
      const keys = path.split('.')
      let current = newData

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i]
        if (key.includes('[')) {
          const [arrKey, index] = key.replace(']', '').split('[')
          current = current[arrKey][parseInt(index)]
        } else {
          // Criar objeto se não existir
          if (!current[key]) {
            current[key] = {}
          }
          current = current[key]
        }
      }

      const lastKey = keys[keys.length - 1]
      if (lastKey.includes('[')) {
        const [arrKey, index] = lastKey.replace(']', '').split('[')
        current[arrKey][parseInt(index)] = value
      } else {
        current[lastKey] = value
      }

      setHasChanges(true)
      // Auto-save com debounce
      scheduleAutoSave(newData)
      return newData
    })
  }, [scheduleAutoSave])

  const saveData = useCallback(() => {
    // Cancelar auto-save pendente
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    localStorage.setItem(VERSION_KEY, DATA_VERSION)
    lastSavedDataRef.current = JSON.stringify(data)
    setHasChanges(false)
    showNotification('Dados salvos com sucesso!', 'success')
  }, [data, showNotification])

  const resetData = async () => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(VERSION_KEY)
    setLoading(true)
    try {
      const response = await fetch('./data.json')
      const jsonData = await response.json()
      setData(jsonData)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(jsonData))
      localStorage.setItem(VERSION_KEY, DATA_VERSION)
      setHasChanges(false)
    } catch (error) {
      console.error('Error resetting data:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'loara-planejamento-2026.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = (jsonString) => {
    try {
      const importedData = JSON.parse(jsonString)
      setData(importedData)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(importedData))
      localStorage.setItem(VERSION_KEY, DATA_VERSION)
      setHasChanges(false)
      return true
    } catch (error) {
      console.error('Error importing data:', error)
      return false
    }
  }

  return (
    <DataContext.Provider value={{
      data,
      loading,
      editMode,
      setEditMode,
      hasChanges,
      updateData,
      saveData,
      resetData,
      exportData,
      importData,
      notification,
      showNotification
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
