import { useState, useEffect, useRef } from 'react'
import { companies as initialCompanies } from '../data/companies'
import { generateHistoricalData, generateLagData, generateSparkline } from '../data/generateData'
import { sentimentToShortLabel, sentimentToColor } from '../utils/sentimentCalc'

const TICK_MS = 5000

export function useRealTimeData(selectedSymbol) {
  // Maintain a live copy of all companies
  const [allCompanies, setAllCompanies] = useState(() =>
    initialCompanies.map(c => ({ ...c }))
  )
  const [historicalData, setHistoricalData] = useState([])
  const [lagData, setLagData] = useState([])
  const [sparkline, setSparkline] = useState([])
  const [flashState, setFlashState] = useState(null) // "up" | "down" | null
  const [lastUpdated, setLastUpdated] = useState(Date.now())

  const lastPriceRef = useRef({})
  const flashTimerRef = useRef(null)

  // Find the currently selected company from live state
  const currentData = allCompanies.find(c => c.symbol === selectedSymbol) || allCompanies[0]

  // Regenerate historical + lag + sparkline whenever selection changes
  useEffect(() => {
    if (!currentData) return
    const company = initialCompanies.find(c => c.symbol === selectedSymbol)
    if (!company) return
    setHistoricalData(generateHistoricalData(company.symbol, company.basePrice, company.sentiment))
    setLagData(generateLagData(company.symbol))
    setSparkline(generateSparkline(company.basePrice))
    lastPriceRef.current[selectedSymbol] = currentData.price
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSymbol])

  // Live tick — every 5 seconds, simulate price + sentiment changes for ALL companies
  useEffect(() => {
    const interval = setInterval(() => {
      setAllCompanies(prev => {
        const next = prev.map(c => {
          // Price ± 0.12%
          const pctChange = (Math.random() - 0.5) * 0.0024 // ±0.12%
          const newPrice = parseFloat((c.price * (1 + pctChange)).toFixed(2))

          // Recalculate change vs basePrice
          const changeAmount = parseFloat((newPrice - c.basePrice).toFixed(2))
          const changePct = parseFloat(((changeAmount / c.basePrice) * 100).toFixed(2))

          // Sentiment ± 0.015
          let newSentiment = c.sentiment + (Math.random() - 0.5) * 0.03
          if (newSentiment < 0.05) newSentiment = 0.05
          if (newSentiment > 0.95) newSentiment = 0.95
          newSentiment = parseFloat(newSentiment.toFixed(3))

          return {
            ...c,
            price: newPrice,
            changeAmount,
            change: changePct,
            sentiment: newSentiment,
            sentimentLabel: sentimentToShortLabel(newSentiment),
            sentimentColor: sentimentToColor(newSentiment)
          }
        })

        // Determine flash on the selected company
        const selectedNew = next.find(c => c.symbol === selectedSymbol)
        const selectedOld = prev.find(c => c.symbol === selectedSymbol)
        if (selectedNew && selectedOld) {
          if (selectedNew.price > selectedOld.price) {
            setFlashState('up')
          } else if (selectedNew.price < selectedOld.price) {
            setFlashState('down')
          }
        }

        return next
      })

      setLastUpdated(Date.now())

      // Clear flash after 800ms
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current)
      flashTimerRef.current = setTimeout(() => setFlashState(null), 800)
    }, TICK_MS)

    return () => {
      clearInterval(interval)
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current)
    }
  }, [selectedSymbol])

  return {
    currentData,
    historicalData,
    lagData,
    sparkline,
    allCompanies,
    flashState,
    lastUpdated
  }
}
