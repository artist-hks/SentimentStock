import React, { useState, useEffect, useRef } from 'react'
import { Search } from 'lucide-react'
import { formatPrice, formatChange, sectorColor } from '../utils/sentimentCalc'

export default function CompanySearch({ companies, selectedSymbol, onSelect }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    function onDocClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const q = query.trim().toLowerCase()
  const filtered = companies.filter(c =>
    c.symbol.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
  )

  function handleSelect(symbol) {
    onSelect(symbol)
    setOpen(false)
    setQuery('')
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className="flex items-center gap-2 px-3"
        style={{
          height: 40,
          background: '#1A1D2E',
          border: '1px solid #252840',
          borderRadius: 8
        }}
      >
        <Search size={16} color="#94A3B8" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="Search company or symbol..."
          className="flex-1 bg-transparent outline-none border-none"
          style={{ color: '#F1F5F9', fontSize: 14 }}
        />
        {selectedSymbol && !open && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: '#A78BFA',
              padding: '2px 8px',
              borderRadius: 10,
              background: 'rgba(139,92,246,0.15)'
            }}
          >
            {selectedSymbol}
          </span>
        )}
      </div>

      {open && (
        <div
          className="absolute left-0 right-0 mt-1 overflow-y-auto"
          style={{
            top: 44,
            maxHeight: 280,
            background: '#12141C',
            border: '1px solid #252840',
            borderRadius: 12,
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            zIndex: 100
          }}
        >
          {filtered.length === 0 && (
            <div style={{ padding: 16, color: '#475569', fontSize: 13, textAlign: 'center' }}>
              No companies found
            </div>
          )}
          {filtered.map(c => {
            const isSelected = c.symbol === selectedSymbol
            const sc = sectorColor(c.sector)
            const positive = c.change >= 0
            return (
              <div
                key={c.symbol}
                onClick={() => handleSelect(c.symbol)}
                className="flex items-center gap-3 cursor-pointer"
                style={{
                  padding: '10px 14px',
                  background: isSelected ? '#1E2235' : 'transparent',
                  borderLeft: isSelected ? '2px solid #8B5CF6' : '2px solid transparent',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={e => {
                  if (!isSelected) e.currentTarget.style.background = '#1A1D2E'
                }}
                onMouseLeave={e => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent'
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: '#A78BFA', minWidth: 90 }}>
                  {c.symbol}
                </span>
                <span style={{ fontSize: 13, color: '#94A3B8', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {c.name}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    padding: '2px 8px',
                    borderRadius: 10,
                    background: sc.bg,
                    color: sc.color,
                    fontWeight: 500
                  }}
                >
                  {c.sector}
                </span>
                <span style={{ fontSize: 13, color: '#F1F5F9', minWidth: 80, textAlign: 'right' }}>
                  {formatPrice(c.price)}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: positive ? '#22C55E' : '#EF4444',
                    minWidth: 56,
                    textAlign: 'right',
                    fontWeight: 500
                  }}
                >
                  {formatChange(c.change)}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
