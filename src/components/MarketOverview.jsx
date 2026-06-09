import React from 'react'
import { formatPrice, formatChange, sectorColor } from '../utils/sentimentCalc'

function CompanyCard({ company, isSelected, onSelect }) {
  const sc = sectorColor(company.sector)
  const positive = company.change >= 0
  const sentPct = Math.round(company.sentiment * 100)
  const sentColor = sentPct > 55 ? '#22C55E' : sentPct < 45 ? '#EF4444' : '#F59E0B'
  const predUp = company.prediction === 'UP'

  return (
    <div
      onClick={() => onSelect(company.symbol)}
      style={{
        background: isSelected ? '#1E2235' : '#1A1D2E',
        border: isSelected ? '2px solid #8B5CF6' : '1px solid #252840',
        borderRadius: 10,
        padding: 14,
        cursor: 'pointer',
        transition: 'all 0.15s'
      }}
      onMouseEnter={e => {
        if (!isSelected) e.currentTarget.style.background = '#1E2235'
      }}
      onMouseLeave={e => {
        if (!isSelected) e.currentTarget.style.background = '#1A1D2E'
      }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#F1F5F9' }}>
          {company.symbol}
        </span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 500,
            padding: '2px 7px',
            borderRadius: 10,
            background: sc.bg,
            color: sc.color
          }}
        >
          {company.sector}
        </span>
      </div>
      <div
        style={{
          fontSize: 11,
          color: '#475569',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          marginBottom: 10
        }}
      >
        {company.name}
      </div>
      <div className="flex items-center justify-between">
        <span style={{ fontSize: 15, fontWeight: 600, color: '#F1F5F9' }}>
          {formatPrice(company.price)}
        </span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: positive ? '#22C55E' : '#EF4444'
          }}
        >
          {formatChange(company.change)}
        </span>
      </div>

      <div
        style={{
          width: '100%',
          height: 5,
          background: '#252840',
          borderRadius: 3,
          marginTop: 10,
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            width: `${sentPct}%`,
            height: '100%',
            background: sentColor,
            transition: 'width 0.4s ease'
          }}
        />
      </div>

      <div className="flex items-center justify-between" style={{ marginTop: 6 }}>
        <span style={{ fontSize: 10, color: '#475569' }}>
          Sentiment {sentPct}
        </span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            padding: '2px 7px',
            borderRadius: 10,
            background: predUp ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
            color: predUp ? '#4ADE80' : '#F87171'
          }}
        >
          {predUp ? '↑ UP' : '↓ DOWN'}
        </span>
      </div>
    </div>
  )
}

export default function MarketOverview({ allCompanies, selectedSymbol, onSelect }) {
  return (
    <div
      style={{
        background: '#12141C',
        border: '1px solid #252840',
        borderRadius: 12,
        padding: 24
      }}
    >
      <div className="flex items-center justify-between mb-1">
        <span style={{ fontSize: 16, fontWeight: 600, color: '#F1F5F9' }}>
          Market Sentiment Overview — NSE Top 15
        </span>
        <span style={{ fontSize: 11, color: '#475569' }}>
          Click any card to drill down
        </span>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 12,
          marginTop: 20
        }}
      >
        {(allCompanies || []).map(c => (
          <CompanyCard
            key={c.symbol}
            company={c}
            isSelected={c.symbol === selectedSymbol}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  )
}
