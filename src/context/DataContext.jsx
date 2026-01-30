import { createContext, useContext, useState, useEffect } from 'react'

const DataContext = createContext()

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
      // Try to load from localStorage first
      const savedData = localStorage.getItem('loara-planejamento-2026')
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        // Check if data has parceiros_lista, if not, reload from data.json
        if (parsedData.parceiros_lista && parsedData.parceiros_lista.length > 0) {
          setData(parsedData)
          setLoading(false)
          return
        }
      }

      // Otherwise load from data.json
      const response = await fetch('./data.json')
      const jsonData = await response.json()
      setData(jsonData)
      localStorage.setItem('loara-planejamento-2026', JSON.stringify(jsonData))
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
    localStorage.setItem('loara-planejamento-2026', JSON.stringify(data))
    setHasChanges(false)
  }

  const resetData = async () => {
    localStorage.removeItem('loara-planejamento-2026')
    setLoading(true)
    try {
      const response = await fetch('./data.json')
      const jsonData = await response.json()
      setData(jsonData)
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
      localStorage.setItem('loara-planejamento-2026', JSON.stringify(importedData))
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
