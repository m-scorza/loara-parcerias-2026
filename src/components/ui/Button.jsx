import { forwardRef } from 'react'

/**
 * Componente Button reutilizável
 * @param {React.ReactNode} children - Conteúdo do botão
 * @param {string} variant - Variante: 'primary', 'secondary', 'ghost', 'danger'
 * @param {string} size - Tamanho: 'sm', 'md', 'lg'
 * @param {boolean} disabled - Se está desabilitado
 * @param {boolean} loading - Se está carregando
 * @param {string} className - Classes adicionais
 * @param {React.ReactNode} leftIcon - Ícone à esquerda
 * @param {React.ReactNode} rightIcon - Ícone à direita
 */
const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  leftIcon,
  rightIcon,
  ...props
}, ref) => {
  const variantClasses = {
    primary: 'bg-loara-600 hover:bg-loara-700 text-white shadow-sm',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-600',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm',
    outline: 'bg-transparent border-2 border-loara-500 text-loara-600 hover:bg-loara-50',
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  const isDisabled = disabled || loading

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center font-medium rounded-xl
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-loara-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className={`animate-spin ${iconSizes[size]}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Carregando...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className={iconSizes[size]}>{leftIcon}</span>}
          {children}
          {rightIcon && <span className={iconSizes[size]}>{rightIcon}</span>}
        </>
      )}
    </button>
  )
})

Button.displayName = 'Button'

export default Button
