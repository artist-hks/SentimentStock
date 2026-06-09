import React, { useState, useMemo } from 'react'
import { sentimentBadgeColor, languageColor } from '../utils/sentimentCalc'

const FILTERS = ['All', 'Hindi', 'English', 'Hinglish']

function NewsItem({ item }) {
  const [expanded, setExpanded] = useState(false)
  const sentColor = sentimentBadgeColor(item.sentimentLabel)
  const langColor = languageColor(item.language)
  const langLabel = item.language.charAt(0).toUpperCase() + item.language.slice(1)

  return (
    <div style={{ padding: '14px 0', borderBottom: '1px solid #1E2035' }}>
      <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: 8 }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            padding: '3px 10px',
            borderRadius: 10,
            background: sentColor.bg,
            color: sentColor.color
          }}
        >
          {item.sentimentLabel}
        </span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: 10,
            background: langColor.bg,
            color: langColor.color
          }}
        >
          {langLabel}
        </span>
        {item.type === 'social' && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 10,
              background: 'rgba(20,184,166,0.15)',
              color: '#2DD4BF'
            }}
          >
            Social
          </span>
        )}
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: '#475569' }}>{item.timeAgo}</span>
      </div>
      <div
        style={{
          fontSize: 14,
          fontWeight: 500,
          color: '#F1F5F9',
          lineHeight: 1.5,
          marginBottom: 6
        }}
      >
        {item.headline}
      </div>
      <div className="flex items-center justify-between">
        <span style={{ fontSize: 12, color: '#475569' }}>{item.source}</span>
        <button
          onClick={() => setExpanded(e => !e)}
          style={{
            fontSize: 12,
            color: '#A78BFA',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          {expanded ? '− less' : '+ more'}
        </button>
      </div>
      {expanded && (
        <div
          style={{
            fontSize: 13,
            color: '#94A3B8',
            background: '#1A1D2E',
            borderRadius: 8,
            padding: 10,
            marginTop: 8,
            lineHeight: 1.5
          }}
        >
          {item.summary}
        </div>
      )}
    </div>
  )
}

export default function NewsPanel({ newsItems, selectedSymbol }) {
  const [filter, setFilter] = useState('All')

  const companyNews = useMemo(
    () => (newsItems || []).filter(n => n.company === selectedSymbol),
    [newsItems, selectedSymbol]
  )

  const filtered = useMemo(() => {
    if (filter === 'All') return companyNews
    return companyNews.filter(n => n.language === filter.toLowerCase())
  }, [companyNews, filter])

  return (
    <div
      style={{
        background: '#12141C',
        border: '1px solid #252840',
        borderRadius: 12,
        padding: 0,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{ padding: 20, borderBottom: '1px solid #1E2035' }}>
        <div className="flex items-center justify-between mb-3">
          <span style={{ fontSize: 16, fontWeight: 600, color: '#F1F5F9' }}>
            News & Social Mentions
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: '3px 10px',
              borderRadius: 10,
              background: 'rgba(139,92,246,0.15)',
              color: '#A78BFA'
            }}
          >
            {filtered.length} items
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {FILTERS.map(f => {
            const active = f === filter
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  padding: '5px 12px',
                  borderRadius: 20,
                  background: active ? '#8B5CF6' : 'transparent',
                  color: active ? '#fff' : '#94A3B8',
                  border: active ? '1px solid #8B5CF6' : '1px solid #252840',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {f}
              </button>
            )
          })}
        </div>
      </div>

      <div
        className="news-scroll"
        style={{ height: 360, overflowY: 'auto', padding: '0 16px' }}
      >
        {filtered.length === 0 && (
          <div
            style={{
              padding: 40,
              textAlign: 'center',
              color: '#475569',
              fontSize: 13
            }}
          >
            No news available for {selectedSymbol} with current filter
          </div>
        )}
        {filtered.map(item => (
          <NewsItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
