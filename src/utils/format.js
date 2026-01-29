export const formatCurrency = (value) => {
  if (value >= 1000000) {
    return `R$ ${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `R$ ${(value / 1000).toFixed(0)}K`
  }
  return `R$ ${value.toFixed(0)}`
}

export const formatCurrencyFull = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

export const formatNumber = (value) => {
  return new Intl.NumberFormat('pt-BR').format(value)
}

export const formatPercent = (value) => {
  return `${value.toFixed(1)}%`
}

export const parseNumber = (str) => {
  if (typeof str === 'number') return str
  return parseFloat(str.replace(/[^\d.-]/g, '')) || 0
}
