import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Lock, Mail, Eye, EyeOff, AlertCircle, ArrowRight, Shield } from 'lucide-react'

export default function LoginScreen() {
  const { login, error, clearError, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rememberEmail, setRememberEmail] = useState(false)

  // Carregar email salvo
  useEffect(() => {
    const savedEmail = localStorage.getItem('loara-remembered-email')
    if (savedEmail) {
      setEmail(savedEmail)
      setRememberEmail(true)
    }
  }, [])

  // Limpar erro quando usuário digita
  useEffect(() => {
    if (error) {
      clearError()
    }
  }, [email, password])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Salvar email se "lembrar" estiver marcado
    if (rememberEmail) {
      localStorage.setItem('loara-remembered-email', email)
    } else {
      localStorage.removeItem('loara-remembered-email')
    }

    // Simular delay para UX
    await new Promise(resolve => setTimeout(resolve, 500))

    const success = login(email, password)
    setIsSubmitting(false)

    if (!success) {
      // Shake animation no form
      const form = document.getElementById('login-form')
      form?.classList.add('animate-shake')
      setTimeout(() => form?.classList.remove('animate-shake'), 500)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-loara-600 to-loara-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-loara-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-loara-500/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-loara-600/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-loara-500 to-loara-600 rounded-2xl shadow-2xl shadow-loara-500/30 mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">LOARA 2026</h1>
          <p className="text-loara-200">Planejamento Estratégico de Parcerias</p>
        </div>

        {/* Card de Login */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-white">Acesso Restrito</h2>
              <p className="text-slate-300 text-sm mt-1">
                Entre com suas credenciais para acessar o dashboard
              </p>
            </div>

            <form id="login-form" onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Email corporativo
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.nome@loara.com.br"
                    className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-loara-500 focus:border-transparent transition-all"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Senha */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-loara-500 focus:border-transparent transition-all"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Lembrar email */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberEmail}
                  onChange={(e) => setRememberEmail(e.target.checked)}
                  className="w-4 h-4 rounded border-white/30 bg-white/10 text-loara-500 focus:ring-loara-500 focus:ring-offset-0"
                />
                <label htmlFor="remember" className="text-sm text-slate-300 cursor-pointer">
                  Lembrar meu email
                </label>
              </div>

              {/* Erro */}
              {error && (
                <div className="flex items-center gap-3 p-4 bg-rose-500/20 border border-rose-500/30 rounded-xl text-rose-200 animate-fadeIn">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Botão de Login */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-loara-500 to-loara-600 hover:from-loara-600 hover:to-loara-700 text-white font-semibold rounded-xl shadow-lg shadow-loara-500/30 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Entrando...</span>
                  </>
                ) : (
                  <>
                    <span>Entrar no Dashboard</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer do card */}
          <div className="px-8 py-4 bg-white/5 border-t border-white/10">
            <p className="text-center text-sm text-slate-400">
              Acesso restrito a colaboradores da LOARA.
              <br />
              Dúvidas? Contate o administrador.
            </p>
          </div>
        </div>

        {/* Info de segurança */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" />
            Conexão segura · Sessão de 24 horas
          </p>
        </div>
      </div>
    </div>
  )
}
