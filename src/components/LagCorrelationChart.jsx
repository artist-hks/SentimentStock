import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Cell,
  ResponsiveContainer
} from 'recharts'

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null
  const item = payload[0].payload
  return (
    <div
      style={{
        background: '#1A1D2E',
        border: '1px solid #252840',
        borderRadius: 8,
        padding: 12
      }}
    >
      <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 4 }}>
        Lag: {item.lag}h
      </div>
      <div style={{ fontSize: 13, color: '#A78BFA', fontWeight: 600 }}>
        Correlation: {Number(item.corr).toFixed(3)}
      </div>
    </div>
  )
}

export default function LagCorrelationChart({ lagData, symbol }) {
  const data = lagData || []
  const peak = data.reduce(
    (best, d) => (Math.abs(d.corr) > Math.abs(best.corr) ? d : best),
    { lag: 0, corr: 0 }
  )

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
          Sentiment → Price Lag Analysis
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
          {symbol}
        </span>
      </div>
      <div style={{ fontSize: 12, color: '#475569', marginBottom: 16 }}>
        Correlation between negative sentiment and price drop after N hours
      </div>

      <div style={{ width: '100%', height: 220 }}>
        {data.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 8, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2035" />
              <XAxis
                dataKey="lag"
                tick={{ fill: '#475569', fontSize: 11 }}
                axisLine={{ stroke: '#252840' }}
                tickLine={{ stroke: '#252840' }}
                tickFormatter={v => `${v}h`}
              />
              <YAxis
                domain={[-0.2, 0.8]}
                tick={{ fill: '#475569', fontSize: 11 }}
                axisLine={{ stroke: '#252840' }}
                tickLine={{ stroke: '#252840' }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139,92,246,0.05)' }} />
              <ReferenceLine y={0} stroke="#252840" strokeWidth={1} />
              <Bar dataKey="corr" radius={[4, 4, 0, 0]} isAnimationActive={false}>
                {data.map((entry, idx) => (
                  <Cell key={idx} fill={entry.corr > 0 ? '#8B5CF6' : '#EF4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div
        style={{
          marginTop: 16,
          padding: 12,
          background: '#1A1D2E',
          borderLeft: '2px solid #8B5CF6',
          borderRadius: '0 8px 8px 0'
        }}
      >
        <div style={{ fontSize: 13, color: '#94A3B8', fontStyle: 'italic', lineHeight: 1.5 }}>
          📊 Peak correlation at {peak.lag}h lag — negative news precedes price movement by ~{peak.lag} hours on average
        </div>
      </div>
    </div>
  )
}
