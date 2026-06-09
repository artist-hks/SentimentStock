import React, { useState, useEffect } from 'react'
import CompanySearch from './CompanySearch'

function isNseOpen(d) {
  // Indian Standard Time hours/minutes
  const dow = d.getDay() // 0 = Sun, 6 = Sat
  if (dow === 0 || dow === 6) return false
  const h = d.getHours()
  const m = d.getMinutes()
  const minutes = h * 60 + m
  return minutes >= (9 * 60 + 15) && minutes <= (15 * 60 + 30)
}

function nowIst() {
  // Get a Date object representing current IST as local components
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour12: false,
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
  const parts = formatter.formatToParts(new Date()).reduce((acc, p) => {
    acc[p.type] = p.value
    return acc
  }, {})
  return {
    timeStr: `${parts.hour}:${parts.minute}:${parts.second} IST`,
    // Reconstruct a Date in local zone using the IST parts to check open/closed
    pseudoDate: new Date(
      parseInt(parts.year),
      parseInt(parts.month) - 1,
      parseInt(parts.day),
      parseInt(parts.hour),
      parseInt(parts.minute),
      parseInt(parts.second)
    )
  }
}

export default function Header({ companies, selectedSymbol, onSelect }) {
  const [tick, setTick] = useState(() => nowIst())

  useEffect(() => {
    const id = setInterval(() => setTick(nowIst()), 1000)
    return () => clearInterval(id)
  }, [])

  const open = isNseOpen(tick.pseudoDate)

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6"
      style={{
        height: 64,
        background: '#12141C',
        borderBottom: '1px solid #252840'
      }}
    >
      {/* Left: Logo + brand */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center"
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #14B8A6 100%)',
            color: 'white',
            fontWeight: 700,
            fontSize: 14
          }}
        >
          SS
        </div>
        <div className="flex flex-col leading-tight">
          <span style={{ fontSize: 18, fontWeight: 700, color: '#F1F5F9' }}>
            SentimentStock
          </span>
          <span style={{ fontSize: 11, color: '#475569' }}>
            NSE/BSE • Hinglish NLP Engine
          </span>
        </div>
      </div>

      {/* Center: Search */}
      <div style={{ width: '100%', maxWidth: 400 }} className="mx-6">
        <CompanySearch
          companies={companies}
          selectedSymbol={selectedSymbol}
          onSelect={onSelect}
        />
      </div>

      {/* Right: Live/clock/status */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <span
            className="live-dot"
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#22C55E',
              display: 'inline-block'
            }}
          />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#22C55E' }}>
            LIVE
          </span>
        </div>
        <div style={{ fontSize: 13, color: '#94A3B8', fontVariantNumeric: 'tabular-nums' }}>
          {tick.timeStr}
        </div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            padding: '4px 10px',
            borderRadius: 20,
            background: open ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)',
            color: open ? '#22C55E' : '#F59E0B',
            border: `1px solid ${open ? 'rgba(34,197,94,0.25)' : 'rgba(245,158,11,0.25)'}`
          }}
        >
          {open ? 'NSE: OPEN' : 'NSE: CLOSED'}
        </div>
      </div>
    </header>
  )
}
