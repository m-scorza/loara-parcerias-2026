import { createContext, useContext, useState, useEffect } from 'react'

const DataContext = createContext()

// Versão dos dados - incrementar sempre que data.json for atualizado significativamente
const DATA_VERSION = '2026.02.02'
const STORAGE_KEY = 'loara-planejamento-2026'
const VERSION_KEY = 'loara-planejamento-version'

export function DataProvider({ children }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

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
          setData(parsedData)
          setLoading(false)
          return
        }
      }

      // Carrega dados frescos do data.json
      const response = await fetch('./data.json')
      const jsonData = await response.json()
      setData(jsonData)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(jsonData))
      localStorage.setItem(VERSION_KEY, DATA_VERSION)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateData = (path, value) => {
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
      return newData
    })
  }

  const saveData = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    localStorage.setItem(VERSION_KEY, DATA_VERSION)
    setHasChanges(false)
  }

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
      importData
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
