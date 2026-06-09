import React from 'react'

// Hash for deterministic Hindi/English mention split per symbol
function hashCode(str) {
  let hash = 0
  for (let i = 0; i < (str || '').length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

// Convert polar (deg) to cartesian, given center (cx,cy) and radius r
function polar(cx, cy, r, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

// SVG arc path between two angles in degrees (0=right, 180=left). Drawn CCW (sweep=0).
function arcPath(cx, cy, r, startDeg, endDeg) {
  const start = polar(cx, cy, r, startDeg)
  const end = polar(cx, cy, r, endDeg)
  const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0
  // We draw from start angle to end angle along the top half (negative y direction).
  // Sweep flag 0 since SVG y-axis is inverted and we want the upper arc when start>end in degree terms.
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`
}

export default function SentimentGauge({ sentiment = 0.5, sentimentLabel = 'Neutral', symbol = '' }) {
  const cx = 150
  const cy = 150
  const r = 110

  // Map sentiment 0..1 to needle angle: 0 -> 180deg (left), 1 -> 0deg (right), 0.5 -> 90deg (up)
  // In SVG with y-down, "up" means -y. Angle 180 in our polar(cos,sin) = (-r, 0) → left ✓
  // Angle 90 = (0, r) — that's DOWN. We need the top semicircle, so we draw arc by setting angles
  // and the sweep flag handles the upper half. For the NEEDLE rotation we use a CSS rotate where
  // 0% sentiment = -180deg (pointing left), 50% = -90deg (up), 100% = 0deg (right).
  const needleAngleDeg = -180 + sentiment * 180 // -180..0

  // Score 0-100
  const score = Math.round(sentiment * 100)
  const zoneColor = score < 30 ? '#EF4444' : score < 60 ? '#F59E0B' : '#22C55E'

  // Three colored zones along the top semicircle (180° to 0°)
  // 0-30%: red       → angles 180 → 126
  // 30-60%: amber    → angles 126 → 72
  // 60-100%: green   → angles 72  → 0
  const redArc = arcPath(cx, cy, r, 180, 126)
  const amberArc = arcPath(cx, cy, r, 126, 72)
  const greenArc = arcPath(cx, cy, r, 72, 0)
  const bgArc = arcPath(cx, cy, r, 180, 0)

  // Deterministic Hindi/English split
  const h = hashCode(symbol)
  const hindiPct = 25 + (h % 35) // 25-59
  const englishPct = 100 - hindiPct

  return (
    <div
      style={{
        background: '#12141C',
        border: '1px solid #252840',
        borderRadius: 12,
        padding: 24,
        textAlign: 'center'
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 600, color: '#F1F5F9', marginBottom: 4, textAlign: 'left' }}>
        Sentiment Gauge
      </div>
      <div style={{ fontSize: 11, color: '#475569', marginBottom: 8, textAlign: 'left' }}>
        Aggregated NLP score from news & social
      </div>

      <svg viewBox="0 0 300 170" width="100%" style={{ display: 'block' }}>
        {/* Background arc */}
        <path d={bgArc} stroke="#1E2235" strokeWidth="24" fill="none" strokeLinecap="butt" />

        {/* Colored zones */}
        <path d={redArc} stroke="#EF4444" strokeWidth="24" fill="none" strokeLinecap="butt" opacity="0.85" />
        <path d={amberArc} stroke="#F59E0B" strokeWidth="24" fill="none" strokeLinecap="butt" opacity="0.85" />
        <path d={greenArc} stroke="#22C55E" strokeWidth="24" fill="none" strokeLinecap="butt" opacity="0.85" />

        {/* Needle — rotate around center */}
        <g
          style={{
            transformOrigin: `${cx}px ${cy}px`,
            transform: `rotate(${needleAngleDeg}deg)`,
            transition: 'transform 0.8s ease'
          }}
        >
          <line
            x1={cx}
            y1={cy}
            x2={cx + 90}
            y2={cy}
            stroke="#F1F5F9"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx={cx + 90} cy={cy} r="4" fill="#F1F5F9" />
        </g>

        {/* Center hub */}
        <circle cx={cx} cy={cy} r="10" fill="#12141C" stroke="#8B5CF6" strokeWidth="2" />

        {/* Zone labels */}
        <text x="30" y="165" fill="#EF4444" fontSize="11" fontWeight="600">Bearish</text>
        <text x="135" y="20" fill="#F59E0B" fontSize="11" fontWeight="600">Neutral</text>
        <text x="240" y="165" fill="#22C55E" fontSize="11" fontWeight="600">Bullish</text>
      </svg>

      <div style={{ marginTop: 4 }}>
        <div
          style={{
            fontSize: 40,
            fontWeight: 700,
            color: zoneColor,
            lineHeight: 1
          }}
        >
          {score}
        </div>
        <div style={{ fontSize: 15, color: '#94A3B8', marginTop: 4, fontWeight: 500 }}>
          {sentimentLabel}
        </div>
      </div>

      <div
        style={{
          marginTop: 18,
          padding: 14,
          background: '#1A1D2E',
          borderRadius: 8,
          textAlign: 'left'
        }}
      >
        <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: '#94A3B8' }}>Hindi mentions</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#60A5FA' }}>{hindiPct}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span style={{ fontSize: 12, color: '#94A3B8' }}>English mentions</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#A78BFA' }}>{englishPct}%</span>
        </div>
      </div>
    </div>
  )
}
