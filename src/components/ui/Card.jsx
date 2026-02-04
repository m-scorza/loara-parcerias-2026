/**
 * Componente Card reutilizável
 * @param {React.ReactNode} children - Conteúdo do card
 * @param {string} className - Classes adicionais
 * @param {boolean} hover - Se deve ter efeito hover
 * @param {function} onClick - Handler de clique
 * @param {string} padding - Tamanho do padding: 'none', 'sm', 'md', 'lg'
 */
export default function Card({
  children,
  className = '',
  hover = false,
  onClick,
  padding = 'md'
}) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  const baseClasses = 'bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden'
  const hoverClasses = hover ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer' : ''
  const clickClasses = onClick ? 'cursor-pointer' : ''

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${clickClasses} ${paddingClasses[padding]} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

/**
 * Header do Card
 */
export function CardHeader({ children, className = '' }) {
  return (
    <div className={`p-6 border-b border-slate-100 ${className}`}>
      {children}
    </div>
  )
}

/**
 * Body do Card
 */
export function CardBody({ children, className = '' }) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  )
}

/**
 * Footer do Card
 */
export function CardFooter({ children, className = '' }) {
  return (
    <div className={`p-4 border-t border-slate-100 bg-slate-50 ${className}`}>
      {children}
    </div>
  )
}
