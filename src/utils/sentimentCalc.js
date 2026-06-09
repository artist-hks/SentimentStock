export function sentimentToColor(score) {
  if (score > 0.55) return 'green'
  if (score < 0.45) return 'red'
  return 'amber'
}

export function sentimentToLabel(score) {
  if (score > 0.75) return 'Very Bullish'
  if (score > 0.6) return 'Bullish'
  if (score >= 0.55) return 'Slightly Bullish'
  if (score >= 0.45) return 'Neutral'
  if (score >= 0.3) return 'Slightly Bearish'
  if (score >= 0.25) return 'Bearish'
  return 'Very Bearish'
}

// Short label used by the real-time hook
export function sentimentToShortLabel(score) {
  if (score < 0.3) return 'Bearish'
  if (score < 0.45) return 'Slightly Bearish'
  if (score < 0.55) return 'Neutral'
  if (score < 0.7) return 'Slightly Bullish'
  return 'Bullish'
}

export function formatPrice(num) {
  if (num === null || num === undefined || isNaN(num)) return '₹0.00'
  return '₹' + Number(num).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

export function formatChange(num) {
  if (num === null || num === undefined || isNaN(num)) return '0.00%'
  const sign = num >= 0 ? '+' : ''
  return `${sign}${Number(num).toFixed(2)}%`
}

export function formatChangeAmount(num) {
  if (num === null || num === undefined || isNaN(num)) return '₹0.00'
  const sign = num >= 0 ? '+' : '-'
  const abs = Math.abs(Number(num))
  return `${sign}₹${abs.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
}

export function formatVolume(num) {
  if (typeof num === 'string') return num
  if (num === null || num === undefined || isNaN(num)) return '0'
  if (num >= 10000000) return (num / 10000000).toFixed(1) + ' Cr'
  if (num >= 100000) return (num / 100000).toFixed(1) + ' L'
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return String(num)
}

// Sector color mapping for badges
export function sectorColor(sector) {
  const map = {
    'IT': { bg: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA' },
    'Energy': { bg: 'rgba(245, 158, 11, 0.15)', color: '#FCD34D' },
    'Banking': { bg: 'rgba(20, 184, 166, 0.15)', color: '#2DD4BF' },
    'Auto': { bg: 'rgba(139, 92, 246, 0.15)', color: '#A78BFA' },
    'FMCG': { bg: 'rgba(34, 197, 94, 0.15)', color: '#4ADE80' },
    'NBFC': { bg: 'rgba(236, 72, 153, 0.15)', color: '#F472B6' },
    'Conglomerate': { bg: 'rgba(168, 85, 247, 0.15)', color: '#C084FC' },
    'Mining': { bg: 'rgba(120, 113, 108, 0.2)', color: '#A8A29E' },
    'Utilities': { bg: 'rgba(14, 165, 233, 0.15)', color: '#38BDF8' },
    'Power': { bg: 'rgba(234, 179, 8, 0.15)', color: '#FACC15' }
  }
  return map[sector] || { bg: 'rgba(148, 163, 184, 0.15)', color: '#94A3B8' }
}

export function languageColor(lang) {
  const map = {
    'hindi': { bg: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA' },
    'english': { bg: 'rgba(148, 163, 184, 0.15)', color: '#94A3B8' },
    'hinglish': { bg: 'rgba(139, 92, 246, 0.15)', color: '#A78BFA' }
  }
  return map[lang] || map['english']
}

export function sentimentBadgeColor(label) {
  const map = {
    'Very Positive': { bg: 'rgba(34,197,94,0.15)', color: '#4ADE80' },
    'Positive': { bg: 'rgba(34,197,94,0.1)', color: '#22C55E' },
    'Neutral': { bg: 'rgba(245,158,11,0.1)', color: '#FCD34D' },
    'Negative': { bg: 'rgba(239,68,68,0.1)', color: '#F87171' },
    'Very Negative': { bg: 'rgba(239,68,68,0.15)', color: '#EF4444' }
  }
  return map[label] || map['Neutral']
}

export function colorHex(name) {
  const map = {
    green: '#22C55E',
    red: '#EF4444',
    amber: '#F59E0B',
    purple: '#8B5CF6',
    teal: '#14B8A6',
    blue: '#3B82F6'
  }
  return map[name] || '#94A3B8'
}
