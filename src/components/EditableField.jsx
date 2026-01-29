import { useState, useRef, useEffect } from 'react'
import { useData } from '../context/DataContext'
import { Pencil, Check, X } from 'lucide-react'

export default function EditableField({
  path,
  value,
  type = 'text',
  formatter = (v) => v,
  parser = (v) => v,
  className = '',
  inputClassName = ''
}) {
  const { editMode, updateData } = useData()
  const [isEditing, setIsEditing] = useState(false)
  const [tempValue, setTempValue] = useState(value)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  useEffect(() => {
    setTempValue(value)
  }, [value])

  const handleSave = () => {
    const parsedValue = parser(tempValue)
    updateData(path, parsedValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTempValue(value)
    setIsEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  if (!editMode) {
    return <span className={className}>{formatter(value)}</span>
  }

  if (isEditing) {
    return (
      <span className="inline-flex items-center gap-1">
        <input
          ref={inputRef}
          type={type === 'currency' || type === 'number' ? 'number' : 'text'}
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`edit-input w-24 ${inputClassName}`}
          step={type === 'currency' ? '0.01' : type === 'number' ? '1' : undefined}
        />
        <button
          onClick={handleSave}
          className="p-1 hover:bg-emerald-100 rounded text-emerald-600"
        >
          <Check className="w-4 h-4" />
        </button>
        <button
          onClick={handleCancel}
          className="p-1 hover:bg-rose-100 rounded text-rose-600"
        >
          <X className="w-4 h-4" />
        </button>
      </span>
    )
  }

  return (
    <span
      className={`editable-field cursor-pointer group ${className}`}
      onClick={() => setIsEditing(true)}
    >
      {formatter(value)}
      <Pencil className="w-3 h-3 ml-1 inline opacity-0 group-hover:opacity-50 transition-opacity" />
    </span>
  )
}
