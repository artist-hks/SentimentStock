import React, { useState } from 'react'
import Header from './components/Header'
import MetricCards from './components/MetricCards'
import PriceChart from './components/PriceChart'
import SentimentGauge from './components/SentimentGauge'
import NewsPanel from './components/NewsPanel'
import LagCorrelationChart from './components/LagCorrelationChart'
import PredictionPanel from './components/PredictionPanel'
import MarketOverview from './components/MarketOverview'
import { useRealTimeData } from './hooks/useRealTimeData'
import { newsItems } from './data/mockNews'

export default function App() {
  const [selectedSymbol, setSelectedSymbol] = useState('RELIANCE')

  const {
    currentData,
    historicalData,
    lagData,
    sparkline,
    allCompanies,
    flashState
  } = useRealTimeData(selectedSymbol)

  return (
    <div style={{ minHeight: '100vh', background: '#0A0B10' }}>
      <Header
        companies={allCompanies}
        selectedSymbol={selectedSymbol}
        onSelect={setSelectedSymbol}
      />

      <main
        style={{
          paddingTop: 80,
          paddingLeft: 24,
          paddingRight: 24,
          paddingBottom: 32,
          maxWidth: 1600,
          margin: '0 auto'
        }}
      >
        <MetricCards
          currentData={currentData}
          sparkline={sparkline}
          flashState={flashState}
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '3fr 2fr',
            gap: 16,
            marginTop: 16
          }}
          className="row-chart-gauge"
        >
          <PriceChart
            historicalData={historicalData}
            selectedSymbol={selectedSymbol}
            sentiment={currentData?.sentiment || 0.5}
          />
          <SentimentGauge
            sentiment={currentData?.sentiment || 0.5}
            sentimentLabel={currentData?.sentimentLabel || 'Neutral'}
            symbol={selectedSymbol}
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
            marginTop: 16
          }}
          className="row-news-lag"
        >
          <NewsPanel newsItems={newsItems} selectedSymbol={selectedSymbol} />
          <LagCorrelationChart lagData={lagData} symbol={selectedSymbol} />
        </div>

        <div style={{ marginTop: 16 }}>
          <PredictionPanel
            prediction={currentData?.prediction || 'UP'}
            confidence={currentData?.confidence || 60}
            sentiment={currentData?.sentiment || 0.5}
            historicalData={historicalData}
          />
        </div>

        <div style={{ marginTop: 16 }}>
          <MarketOverview
            allCompanies={allCompanies}
            selectedSymbol={selectedSymbol}
            onSelect={setSelectedSymbol}
          />
        </div>
      </main>

      <style>{`
        @media (max-width: 1100px) {
          .row-chart-gauge { grid-template-columns: 1fr !important; }
          .row-news-lag { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
