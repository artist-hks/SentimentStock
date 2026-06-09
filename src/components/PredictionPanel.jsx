import React from 'react'
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'

function FeatureBar({ label, value, color }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
        <span style={{ fontSize: 13, color: '#94A3B8' }}>{label}</span>
        <span style={{ fontSize: 12, color: '#F1F5F9', fontWeight: 600 }}>{value}%</span>
      </div>
      <div
        style={{
          width: '100%',
          height: 6,
          background: '#1E2035',
          borderRadius: 3,
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            width: `${value}%`,
            height: '100%',
            background: color,
            transition: 'width 0.4s ease'
          }}
        />
      </div>
    </div>
  )
}

export default function PredictionPanel({ prediction, confidence, sentiment }) {
  const predUp = prediction === 'UP'
  const dirColor = predUp ? '#22C55E' : '#EF4444'

  return (
    <div
      style={{
        background: '#12141C',
        border: '1px solid #252840',
        borderRadius: 12,
        padding: 28
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: 32
        }}
        className="prediction-grid"
      >
        {/* Left column */}
        <div>
          <div
            style={{
              fontSize: 11,
              color: '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 600,
              marginBottom: 16
            }}
          >
            LSTM Model Prediction
          </div>

          <div className="flex items-center gap-4 mb-4">
            {predUp ? (
              <TrendingUp size={64} color={dirColor} strokeWidth={2.5} />
            ) : (
              <TrendingDown size={64} color={dirColor} strokeWidth={2.5} />
            )}
            <div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: dirColor,
                  lineHeight: 1.1
                }}
              >
                PREDICTED: {prediction}
              </div>
              <span
                style={{
                  display: 'inline-block',
                  marginTop: 6,
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: 10,
                  background: 'rgba(139,92,246,0.15)',
                  color: '#A78BFA'
                }}
              >
                Next Trading Day
              </span>
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: '#94A3B8', fontWeight: 500 }}>
                Confidence
              </span>
              <span style={{ fontSize: 14, color: '#F1F5F9', fontWeight: 700 }}>
                {confidence}%
              </span>
            </div>
            <div
              style={{
                width: '100%',
                height: 8,
                background: '#1E2035',
                borderRadius: 4,
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${confidence}%`,
                  height: '100%',
                  background: '#8B5CF6',
                  transition: 'width 0.4s ease'
                }}
              />
            </div>
          </div>

          <div
            style={{
              fontSize: 12,
              color: '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              fontWeight: 600,
              marginBottom: 12
            }}
          >
            Feature Importance
          </div>
          <FeatureBar label="Sentiment Score" value={40} color="#14B8A6" />
          <FeatureBar label="Price Momentum" value={35} color="#8B5CF6" />
          <FeatureBar label="Volume Signal" value={25} color="#3B82F6" />
        </div>

        {/* Right column - Stats */}
        <div>
          {/* Model Accuracy */}
          <div
            style={{
              background: '#1A1D2E',
              borderRadius: 8,
              padding: 16,
              marginBottom: 12
            }}
          >
            <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              Model Accuracy
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#22C55E', lineHeight: 1 }}>
              58.3%
            </div>
            <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>
              vs 50% random baseline
            </div>
            <div className="flex items-center gap-2 mt-3">
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 3 }}>Model</div>
                <div style={{ height: 5, background: '#1E2035', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: '58.3%', height: '100%', background: '#22C55E' }} />
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 3 }}>Baseline</div>
                <div style={{ height: 5, background: '#1E2035', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: '50%', height: '100%', background: '#475569' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Training Data */}
          <div
            style={{
              background: '#1A1D2E',
              borderRadius: 8,
              padding: 16,
              marginBottom: 12
            }}
          >
            <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              Training Data
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#A78BFA', lineHeight: 1 }}>
              6 months
            </div>
            <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>
              NSE data | Backtested
            </div>
            <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>
              Hinglish labeled corpus: 847 samples
            </div>
          </div>

          {/* Disclaimer */}
          <div
            style={{
              background: '#1A1D2E',
              borderRadius: 8,
              padding: 16,
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start'
            }}
          >
            <AlertTriangle size={14} color="#F59E0B" style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ fontSize: 12, color: '#475569', fontStyle: 'italic', lineHeight: 1.5 }}>
              Research project only. Not financial advice. Past performance does not guarantee future results.
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .prediction-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
