import React from 'react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown } from 'lucide-react'
import {
  formatPrice,
  formatChange,
  formatChangeAmount,
  colorHex
} from '../utils/sentimentCalc'

function Card({ children, flashClass }) {
  return (
    <div
      className={flashClass || ''}
      style={{
        background: '#12141C',
        border: '0.5px solid #252840',
        borderRadius: 12,
        padding: 20,
        minHeight: 160
      }}
    >
      {children}
    </div>
  )
}

function Label({ children }) {
  return (
    <div
      style={{
        fontSize: 10,
        color: '#475569',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        fontWeight: 600
      }}
    >
      {children}
    </div>
  )
}

export default function MetricCards({ currentData, sparkline, flashState }) {
  if (!currentData) return null

  const positive = currentData.change >= 0
  const sentScore = Math.round(currentData.sentiment * 100)
  const sentColor = sentScore > 55 ? '#22C55E' : sentScore < 45 ? '#EF4444' : '#F59E0B'

  // Sparkline trend color
  const sparkData = (sparkline && sparkline.length > 1
    ? sparkline.map((v, i) => ({ x: i, v }))
    : [])
  const sparkTrend = sparkData.length > 1
    ? sparkData[sparkData.length - 1].v >= sparkData[0].v
    : true
  const sparkColor = sparkTrend ? '#22C55E' : '#EF4444'

  const flashClass = flashState === 'up' ? 'flash-up' : flashState === 'down' ? 'flash-down' : ''

  // News mentions split
  const totalMentions = currentData.mentions24h
  const newsCount = Math.round(totalMentions * 0.53)
  const socialCount = totalMentions - newsCount

  const predUp = currentData.prediction === 'UP'

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Live Price */}
      <Card key={`price-${flashState}-${currentData.price}`} flashClass={flashClass}>
        <div className="flex items-center justify-between mb-3">
          <Label>Current Price</Label>
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
            {currentData.symbol}
          </span>
        </div>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#F1F5F9', lineHeight: 1.1 }}>
          {formatPrice(currentData.price)}
        </div>
        <div
          className="flex items-center gap-2 mt-2"
          style={{ fontSize: 13, fontWeight: 500, color: positive ? '#22C55E' : '#EF4444' }}
        >
          <span>{positive ? '▲' : '▼'}</span>
          <span>{formatChangeAmount(currentData.changeAmount)}</span>
          <span>({formatChange(currentData.change)})</span>
        </div>
        <div style={{ width: '100%', height: 40, marginTop: 8 }}>
          {sparkData.length > 1 && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparkData}>
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke={sparkColor}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* Card 2: Sentiment Score */}
      <Card>
        <Label>Sentiment Score</Label>
        <div className="flex items-baseline gap-1 mt-3">
          <span style={{ fontSize: 36, fontWeight: 700, color: sentColor, lineHeight: 1 }}>
            {sentScore}
          </span>
          <span style={{ fontSize: 18, color: '#475569' }}>/100</span>
        </div>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 10,
              background: `${sentColor}22`,
              color: sentColor
            }}
          >
            {currentData.sentimentLabel}
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 10,
              background: 'rgba(139,92,246,0.15)',
              color: '#A78BFA'
            }}
          >
            Hinglish NLP
          </span>
        </div>
        <div
          style={{
            width: '100%',
            height: 4,
            background: '#1E2035',
            borderRadius: 2,
            marginTop: 14,
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              width: `${sentScore}%`,
              height: '100%',
              background: sentColor,
              transition: 'width 0.4s ease'
            }}
          />
        </div>
      </Card>

      {/* Card 3: LSTM Prediction */}
      <Card>
        <Label>Next Day Prediction</Label>
        <div className="flex items-center gap-3 mt-3">
          {predUp ? (
            <TrendingUp size={48} color="#22C55E" strokeWidth={2.5} />
          ) : (
            <TrendingDown size={48} color="#EF4444" strokeWidth={2.5} />
          )}
          <div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: predUp ? '#22C55E' : '#EF4444',
                lineHeight: 1
              }}
            >
              {currentData.prediction}
            </div>
            <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>
              {currentData.confidence}% confidence
            </div>
          </div>
        </div>
        <div style={{ fontSize: 11, color: '#475569', marginTop: 16 }}>
          LSTM + Sentiment Features
        </div>
      </Card>

      {/* Card 4: News Mentions */}
      <Card>
        <Label>24h Mentions</Label>
        <div style={{ fontSize: 36, fontWeight: 700, color: '#F1F5F9', marginTop: 8, lineHeight: 1 }}>
          {totalMentions}
        </div>
        <div
          style={{
            fontSize: 13,
            color: currentData.mentionsChange >= 0 ? '#22C55E' : '#EF4444',
            marginTop: 4,
            fontWeight: 500
          }}
        >
          {currentData.mentionsChange >= 0 ? '+' : ''}
          {currentData.mentionsChange} vs yesterday
        </div>
        <div className="flex items-center gap-2 mt-3">
          <span
            style={{
              fontSize: 11,
              padding: '3px 10px',
              borderRadius: 10,
              background: 'rgba(59,130,246,0.15)',
              color: '#60A5FA',
              fontWeight: 500
            }}
          >
            News: {newsCount}
          </span>
          <span
            style={{
              fontSize: 11,
              padding: '3px 10px',
              borderRadius: 10,
              background: 'rgba(139,92,246,0.15)',
              color: '#A78BFA',
              fontWeight: 500
            }}
          >
            Social: {socialCount}
          </span>
        </div>
      </Card>
    </div>
  )
}
