import { useState, useRef, useEffect } from 'react'
import { useData } from '../context/DataContext'
import { Pencil, Check, X } from 'lucide-react'

// Helper function to get nested value from object using path like "foo.bar[0].baz"
function getNestedValue(obj, path) {
  if (!obj || !path) return undefined
  const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.')
  let current = obj
  for (const key of keys) {
    if (current === null || current === undefined) return undefined
    current = current[key]
  }
  return current
}

export default function EditableField({
  path,
  value: propValue,
  defaultValue = '',
  type = 'text',
  formatter = (v) => v,
  parser = (v) => v,
  className = '',
  inputClassName = '',
  multiline = false,
  placeholder = ''
}) {
  const { data, editMode, updateData } = useData()

  // Get value from data using path, or use propValue, or defaultValue
  const value = propValue !== undefined
    ? propValue
    : (path ? getNestedValue(data, path) : undefined) ?? defaultValue

  const [isEditing, setIsEditing] = useState(false)
  const [tempValue, setTempValue] = useState(value)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      if (inputRef.current.select) {
        inputRef.current.select()
      }
    }
  }, [isEditing])

  useEffect(() => {
    setTempValue(value)
  }, [value])

  const handleSave = () => {
    let parsedValue = tempValue
    if (type === 'number' || type === 'currency') {
      parsedValue = parseFloat(tempValue) || 0
    } else if (type === 'percent') {
      parsedValue = parseFloat(tempValue) || 0
    } else {
      parsedValue = parser(tempValue)
    }
    updateData(path, parsedValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTempValue(value)
    setIsEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !multiline) {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  // Format displayed value
  const displayValue = formatter(value)

  if (!editMode) {
    return <span className={className}>{displayValue}</span>
  }

  if (isEditing) {
    const inputType = (type === 'currency' || type === 'number' || type === 'percent') ? 'number' : 'text'
    const step = type === 'currency' ? '0.01' : type === 'percent' ? '0.1' : type === 'number' ? '1' : undefined

    return (
      <span className="inline-flex items-center gap-1">
        {multiline ? (
          <textarea
            ref={inputRef}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`edit-input min-w-32 min-h-16 ${inputClassName}`}
            placeholder={placeholder}
          />
        ) : (
          <input
            ref={inputRef}
            type={inputType}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`edit-input w-auto min-w-16 ${inputClassName}`}
            step={step}
            placeholder={placeholder}
          />
        )}
        <button
          onClick={handleSave}
          className="p-1 hover:bg-emerald-100 rounded text-emerald-600"
          title="Salvar (Enter)"
        >
          <Check className="w-4 h-4" />
        </button>
        <button
          onClick={handleCancel}
          className="p-1 hover:bg-rose-100 rounded text-rose-600"
          title="Cancelar (Esc)"
        >
          <X className="w-4 h-4" />
        </button>
      </span>
    )
  }

  return (
    <span
      className={`editable-field cursor-pointer group inline-flex items-center ${className}`}
      onClick={() => setIsEditing(true)}
      title="Clique para editar"
    >
      {displayValue || <span className="text-slate-400 italic">{placeholder || 'Clique para editar'}</span>}
      <Pencil className="w-3 h-3 ml-1 inline opacity-0 group-hover:opacity-70 transition-opacity text-loara-500" />
    </span>
  )
}
