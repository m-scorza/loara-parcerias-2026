/**
 * Componente Badge reutilizável
 * @param {React.ReactNode} children - Conteúdo
 * @param {string} variant - Variante de cor
 * @param {string} size - Tamanho: 'sm', 'md', 'lg'
 * @param {boolean} pulse - Se deve ter animação de pulse
 * @param {string} className - Classes adicionais
 */
export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  pulse = false,
  className = ''
}) {
  const variantClasses = {
    default: 'bg-slate-100 text-slate-700',
    primary: 'bg-loara-100 text-loara-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-rose-100 text-rose-700',
    info: 'bg-sky-100 text-sky-700',
    // Com bordas
    'outline-default': 'bg-transparent border border-slate-300 text-slate-600',
    'outline-primary': 'bg-transparent border border-loara-300 text-loara-600',
    'outline-success': 'bg-transparent border border-emerald-300 text-emerald-600',
    'outline-warning': 'bg-transparent border border-amber-300 text-amber-600',
    'outline-danger': 'bg-transparent border border-rose-300 text-rose-600',
    // Categoria de parceiros
    ouro: 'bg-amber-100 text-amber-700',
    prata: 'bg-slate-200 text-slate-700',
    bronze: 'bg-orange-100 text-orange-700',
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {pulse && (
        <span className="w-2 h-2 rounded-full bg-current opacity-75 animate-pulse"></span>
      )}
      {children}
    </span>
  )
}
