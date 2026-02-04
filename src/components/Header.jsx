import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { Pencil, Save, RotateCcw, Download, Upload, FileText, X, Check, LogOut, User } from 'lucide-react'
import { useState, useRef } from 'react'

export default function Header() {
  const { data, editMode, setEditMode, hasChanges, saveData, resetData, exportData, importData } = useData()
  const { user, logout } = useAuth()
  const [showImport, setShowImport] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileImport = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const success = importData(event.target.result)
        if (success) {
          setShowImport(false)
        } else {
          alert('Erro ao importar arquivo. Verifique o formato JSON.')
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <header className="gradient-header text-white py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p className="text-loara-300 text-sm tracking-wider uppercase font-medium mb-2">
              {data.textos.meta_subtitulo}
            </p>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
              {data.textos.header_titulo}
            </h1>
            <p className="text-loara-200 text-base mt-2">
              LOARA {data.textos.meta_ano_planejamento} • Versão {data.textos.meta_versao}
            </p>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-4">
            {/* User & Badge */}
            <div className="flex items-center gap-3">
              {/* Badge cenário */}
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-300 font-semibold text-sm">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                {data.textos.header_badge}
              </span>

              {/* User Menu */}
              {user && (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                  >
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {user.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium hidden sm:block">{user.name}</span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-fadeIn">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <div className="font-medium text-slate-900">{user.name}</div>
                        <div className="text-xs text-slate-500">{user.email}</div>
                      </div>
                      <button
                        onClick={() => {
                          setShowUserMenu(false)
                          logout()
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sair
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {editMode ? (
                <>
                  <button
                    onClick={() => setEditMode(false)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancelar
                  </button>
                  {hasChanges && (
                    <button
                      onClick={saveData}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-sm font-medium transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Salvar
                    </button>
                  )}
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowImport(!showImport)}
                    className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors"
                    title="Importar/Exportar"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                    Editar Valores
                  </button>
                </>
              )}
            </div>

            {/* Import/Export Menu */}
            {showImport && (
              <div className="flex items-center gap-2 bg-white/10 rounded-xl p-2">
                <button
                  onClick={exportData}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded-lg text-sm transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Exportar JSON
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded-lg text-sm transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Importar JSON
                </button>
                <button
                  onClick={() => {
                    if (confirm('Restaurar todos os dados para o original?')) {
                      resetData()
                      setShowImport(false)
                    }
                  }}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded-lg text-sm text-amber-300 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restaurar
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </div>
            )}

            {/* Edit Mode Indicator */}
            {editMode && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-300 text-sm">
                <Pencil className="w-3 h-3" />
                Modo de edição ativo - clique nos valores para editar
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
