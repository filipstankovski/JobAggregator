import { useState } from 'react'
import { S } from '../lib/styles'
import { formatDate } from '../lib/format'

export function JobCard({ job }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      style={{ ...S.card, transform: hovered ? 'translateY(-3px)' : 'none', boxShadow: hovered ? 'var(--shadow-lg)' : 'var(--shadow)' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={S.cardSource}>{job.source}</div>
      <div style={S.cardTitle}>{job.title}</div>
      {job.company && (
        <div style={S.cardCompany}>
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3m4-3v3m4-3v3"/>
          </svg>
          {job.company}
        </div>
      )}
      {job.description && <div style={{ ...S.cardDesc, color: 'var(--muted)' }}>{job.description}</div>}
      <div style={S.cardMeta}>
        {job.location && (
          <span style={S.tag}>
            <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            {job.location}
          </span>
        )}
        {job.activeUntil && <span style={{ ...S.tag, ...S.tagDeadline }}>до {formatDate(job.activeUntil)}</span>}
        {job.category && <span style={S.tag}>{job.category}</span>}
      </div>
      <div style={S.cardFooter}>
        {job.url
          ? <a href={job.url} target="_blank" rel="noopener noreferrer" style={S.applyBtn}>
              Аплицирај
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M7 17 17 7M7 7h10v10"/>
              </svg>
            </a>
          : <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Нема линк</span>
        }
      </div>
    </div>
  )
}
