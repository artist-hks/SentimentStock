// Simple string hash for deterministic per-symbol variation
function hashCode(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  return Math.abs(hash)
}

// Seeded random based on a number — gives consistent variation per symbol
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatDate(d) {
  const day = String(d.getDate()).padStart(2, '0')
  return `${day} ${MONTHS[d.getMonth()]}`
}

/**
 * Generates 90 days of historical price + sentiment data (skipping weekends).
 * Random walk that trends back toward basePrice and sentiment.
 */
export function generateHistoricalData(symbol, basePrice, sentiment) {
  const data = []
  const today = new Date()
  const seedBase = hashCode(symbol)

  // Build list of last 90 weekdays going backward
  const dates = []
  const cursor = new Date(today)
  while (dates.length < 90) {
    const day = cursor.getDay()
    if (day !== 0 && day !== 6) {
      dates.unshift(new Date(cursor))
    }
    cursor.setDate(cursor.getDate() - 1)
  }

  let price = basePrice * 0.88
  let sent = Math.max(0.05, Math.min(0.95, sentiment - 0.15))

  for (let i = 0; i < dates.length; i++) {
    const d = dates[i]
    const progress = i / (dates.length - 1) // 0 → 1

    // Mean-reverting random walk toward basePrice
    const target = basePrice * (0.88 + 0.12 * progress)
    const pull = (target - price) * 0.05
    const noise = (seededRandom(seedBase + i * 7) - 0.5) * price * 0.016 // ±0.8%
    price = price + pull + noise
    // Clamp to reasonable range
    if (price < basePrice * 0.75) price = basePrice * 0.75
    if (price > basePrice * 1.12) price = basePrice * 1.12

    // Sentiment trends back to target sentiment
    const sentTarget = sentiment
    const sentPull = (sentTarget - sent) * 0.06
    const sentNoise = (seededRandom(seedBase + i * 13 + 1000) - 0.5) * 0.1
    sent = sent + sentPull + sentNoise
    if (sent < 0.05) sent = 0.05
    if (sent > 0.95) sent = 0.95

    // Volume: 1M - 8M with spikes
    const baseVol = 1 + seededRandom(seedBase + i * 17 + 2000) * 4
    const spikeChance = seededRandom(seedBase + i * 19 + 3000)
    const volume = spikeChance > 0.9 ? baseVol + 3 + seededRandom(seedBase + i + 4000) * 2 : baseVol

    data.push({
      date: formatDate(d),
      price: parseFloat(price.toFixed(2)),
      sentiment: parseFloat(sent.toFixed(3)),
      volume: parseFloat(volume.toFixed(2))
    })
  }

  return data
}

/**
 * Lag correlation analysis data — how sentiment at lag N hours correlates with price movement.
 */
export function generateLagData(symbol) {
  const baseLags = [
    { lag: 0, corr: 0.15 },
    { lag: 2, corr: 0.28 },
    { lag: 4, corr: 0.42 },
    { lag: 6, corr: 0.51 },
    { lag: 8, corr: 0.63 },
    { lag: 12, corr: 0.49 },
    { lag: 24, corr: 0.31 },
    { lag: 48, corr: 0.19 }
  ]
  const seedBase = hashCode(symbol)
  return baseLags.map((item, i) => {
    const variation = (seededRandom(seedBase + i * 11) - 0.5) * 0.12
    return {
      lag: item.lag,
      corr: parseFloat((item.corr + variation).toFixed(3))
    }
  })
}

/**
 * Mini 7-point sparkline data points.
 */
export function generateSparkline(basePrice) {
  const points = []
  let price = basePrice * 0.97
  for (let i = 0; i < 7; i++) {
    const noise = (Math.random() - 0.5) * basePrice * 0.012
    const pull = (basePrice - price) * 0.1
    price = price + pull + noise
    points.push(parseFloat(price.toFixed(2)))
  }
  return points
}
