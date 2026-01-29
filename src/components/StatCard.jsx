import { TrendingUp, TrendingDown } from 'lucide-react'
import EditableField from './EditableField'

const colorVariants = {
  loara: 'from-loara-500 to-loara-600',
  emerald: 'from-emerald-500 to-emerald-600',
  amber: 'from-amber-500 to-amber-600',
  sky: 'from-sky-500 to-sky-600',
  rose: 'from-rose-500 to-rose-600',
  violet: 'from-violet-500 to-violet-600',
}

const trendColors = {
  up: 'bg-emerald-100 text-emerald-700',
  down: 'bg-rose-100 text-rose-700',
  neutral: 'bg-slate-100 text-slate-700',
}

export default function StatCard({
  title,
  value,
  subtitle,
  trend,
  trendDirection = 'up',
  color = 'loara',
  icon: Icon,
  path,
  formatter,
  parser,
  editable = false
}) {
  const TrendIcon = trendDirection === 'up' ? TrendingUp : TrendingDown

  return (
    <div className="stat-card">
      <div className="flex justify-between items-start mb-4">
        {Icon && (
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorVariants[color]} flex items-center justify-center text-white shadow-lg`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
        {trend && (
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${trendColors[trendDirection]}`}>
            <TrendIcon className="w-3 h-3" />
            {trend}
          </span>
        )}
      </div>
      <div className="text-3xl font-bold text-slate-900 tabular-nums">
        {editable && path ? (
          <EditableField
            path={path}
            value={value}
            formatter={formatter}
            parser={parser}
            type="number"
          />
        ) : (
          formatter ? formatter(value) : value
        )}
      </div>
      <div className="text-sm text-slate-500 mt-1">{title}</div>
      {subtitle && <div className="text-xs text-slate-400 mt-0.5">{subtitle}</div>}
    </div>
  )
}
