import React, { useState } from 'react'
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

const RANGES = [
  { label: '1W', count: 7 },
  { label: '1M', count: 30 },
  { label: '3M', count: 90 }
]

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null
  const priceItem = payload.find(p => p.dataKey === 'price')
  const sentItem = payload.find(p => p.dataKey === 'sentiment')
  return (
    <div
      style={{
        background: '#1A1D2E',
        border: '1px solid #252840',
        borderRadius: 8,
        padding: 12,
        boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
      }}
    >
      <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 6, fontWeight: 600 }}>
        {label}
      </div>
      {priceItem && (
        <div style={{ fontSize: 13, color: '#A78BFA', fontWeight: 500 }}>
          Price: ₹{Number(priceItem.value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      )}
      {sentItem && (
        <div style={{ fontSize: 13, color: '#2DD4BF', fontWeight: 500, marginTop: 2 }}>
          Sentiment: {Math.round(Number(sentItem.value) * 100)}%
        </div>
      )}
    </div>
  )
}

export default function PriceChart({ historicalData, selectedSymbol }) {
  const [range, setRange] = useState('1M')

  const count = RANGES.find(r => r.label === range)?.count || 30
  const safeData = historicalData || []
  const data = safeData.slice(-count)

  return (
    <div
      style={{
        background: '#12141C',
        border: '1px solid #252840',
        borderRadius: 12,
        padding: 24
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span style={{ fontSize: 16, fontWeight: 600, color: '#F1F5F9' }}>
            Price & Sentiment Trend
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: '2px 10px',
              borderRadius: 10,
              background: 'rgba(139,92,246,0.15)',
              color: '#A78BFA'
            }}
          >
            {selectedSymbol}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {RANGES.map(r => {
            const active = r.label === range
            return (
              <button
                key={r.label}
                onClick={() => setRange(r.label)}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  padding: '6px 14px',
                  borderRadius: 8,
                  background: active ? '#8B5CF6' : 'transparent',
                  color: active ? '#fff' : '#94A3B8',
                  border: active ? '1px solid #8B5CF6' : '1px solid #252840',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {r.label}
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ width: '100%', height: 320 }}>
        {data.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 5, right: 8, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2235" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#475569', fontSize: 11 }}
                axisLine={{ stroke: '#252840' }}
                tickLine={{ stroke: '#252840' }}
                minTickGap={20}
              />
              <YAxis
                yAxisId="price"
                tick={{ fill: '#475569', fontSize: 11 }}
                axisLine={{ stroke: '#252840' }}
                tickLine={{ stroke: '#252840' }}
                tickFormatter={v => `₹${Math.round(v)}`}
                domain={['auto', 'auto']}
              />
              <YAxis
                yAxisId="sentiment"
                orientation="right"
                tick={{ fill: '#14B8A6', fontSize: 11 }}
                axisLine={{ stroke: '#252840' }}
                tickLine={{ stroke: '#252840' }}
                domain={[0, 1]}
                tickFormatter={v => `${Math.round(v * 100)}`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#475569', strokeWidth: 1 }} />
              <Legend
                wrapperStyle={{ paddingTop: 10, fontSize: 12 }}
                formatter={value =>
                  value === 'price' ? (
                    <span style={{ color: '#A78BFA' }}>Price (₹)</span>
                  ) : (
                    <span style={{ color: '#2DD4BF' }}>Sentiment Score</span>
                  )
                }
              />
              <Area
                yAxisId="sentiment"
                type="monotone"
                dataKey="sentiment"
                stroke="#14B8A6"
                fill="#14B8A6"
                fillOpacity={0.15}
                strokeWidth={1.5}
                dot={false}
                isAnimationActive={false}
              />
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="price"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
