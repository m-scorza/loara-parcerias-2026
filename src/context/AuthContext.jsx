import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

// Configuração de autenticação
const AUTH_CONFIG = {
  // Senha padrão inicial - pode ser alterada pelo admin depois
  defaultPassword: 'loara2026',
  // Lista de emails autorizados (pode ser expandida)
  authorizedEmails: [
    'admin@loara.com.br',
    'matheus@loara.com.br',
    'eric@loara.com.br',
    'marcos@loara.com.br',
    'thales@loara.com.br',
    'celso@loara.com.br',
    'vanessa@loara.com.br',
    'claudine@loara.com.br',
    'luciano@loara.com.br',
    'bruno@loara.com.br',
    'beccari@loara.com.br',
  ],
  // Permitir qualquer email com domínio @loara.com.br
  allowLoaraDomain: true,
  // Chave para storage
  storageKey: 'loara-auth-session',
  // Tempo de expiração da sessão (24 horas em ms)
  sessionDuration: 24 * 60 * 60 * 1000
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Verificar sessão existente ao carregar
  useEffect(() => {
    checkExistingSession()
  }, [])

  const checkExistingSession = () => {
    try {
      const sessionData = localStorage.getItem(AUTH_CONFIG.storageKey)
      if (sessionData) {
        const session = JSON.parse(sessionData)
        const now = new Date().getTime()

        // Verifica se a sessão não expirou
        if (session.expiresAt && session.expiresAt > now) {
          setUser(session.user)
          setIsAuthenticated(true)
        } else {
          // Sessão expirada - limpar
          localStorage.removeItem(AUTH_CONFIG.storageKey)
        }
      }
    } catch (err) {
      console.error('Erro ao verificar sessão:', err)
      localStorage.removeItem(AUTH_CONFIG.storageKey)
    } finally {
      setLoading(false)
    }
  }

  const validateEmail = (email) => {
    const emailLower = email.toLowerCase().trim()

    // Verifica se está na lista de autorizados
    if (AUTH_CONFIG.authorizedEmails.includes(emailLower)) {
      return true
    }

    // Verifica se é do domínio @loara.com.br
    if (AUTH_CONFIG.allowLoaraDomain && emailLower.endsWith('@loara.com.br')) {
      return true
    }

    return false
  }

  const login = (email, password) => {
    setError(null)

    // Validações
    if (!email || !email.includes('@')) {
      setError('Por favor, insira um email válido')
      return false
    }

    if (!password) {
      setError('Por favor, insira a senha')
      return false
    }

    const emailLower = email.toLowerCase().trim()

    // Verifica email autorizado
    if (!validateEmail(emailLower)) {
      setError('Este email não está autorizado a acessar o sistema')
      return false
    }

    // Verifica senha
    if (password !== AUTH_CONFIG.defaultPassword) {
      setError('Senha incorreta')
      return false
    }

    // Login bem-sucedido
    const userData = {
      email: emailLower,
      name: emailLower.split('@')[0].split('.').map(
        part => part.charAt(0).toUpperCase() + part.slice(1)
      ).join(' '),
      loginTime: new Date().toISOString()
    }

    const sessionData = {
      user: userData,
      expiresAt: new Date().getTime() + AUTH_CONFIG.sessionDuration
    }

    localStorage.setItem(AUTH_CONFIG.storageKey, JSON.stringify(sessionData))
    setUser(userData)
    setIsAuthenticated(true)

    return true
  }

  const logout = () => {
    localStorage.removeItem(AUTH_CONFIG.storageKey)
    setUser(null)
    setIsAuthenticated(false)
    setError(null)
  }

  const clearError = () => {
    setError(null)
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      loading,
      error,
      login,
      logout,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
