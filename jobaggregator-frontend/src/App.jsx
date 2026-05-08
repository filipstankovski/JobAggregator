import { useState, useEffect, useMemo } from 'react'

// ── THEME ─────────────────────────────────────────────────────────────────────
const LIGHT = {
  '--bg':         '#FAF8F4',
  '--surface':    '#FFFFFF',
  '--border':     '#E8E4DC',
  '--text':       '#0F0F1A',
  '--muted':      '#7A7570',
  '--accent':     '#C8372D',
  '--shadow':     '0 2px 16px rgba(15,15,26,0.08)',
  '--shadow-lg':  '0 8px 40px rgba(15,15,26,0.14)',
}
const DARK = {
  '--bg':         '#0F0F14',
  '--surface':    '#18181F',
  '--border':     'rgba(255,255,255,0.08)',
  '--text':       '#EDECE8',
  '--muted':      '#7A7888',
  '--accent':     '#E0453A',
  '--shadow':     '0 2px 16px rgba(0,0,0,0.4)',
  '--shadow-lg':  '0 8px 40px rgba(0,0,0,0.6)',
}

const S = {
  page: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  header: { borderBottom: '1px solid var(--border)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100, padding: '0 clamp(1rem, 4vw, 3rem)' },
  headerInner: { maxWidth: 1200, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  logo: { fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: '1.35rem', color: 'var(--text)' },
  logoAccent: { color: 'var(--accent)' },
  headerBadge: { fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)', background: 'var(--border)', padding: '3px 12px', borderRadius: 99 },
  themeBtn: { width: 38, height: 38, borderRadius: 99, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0 },
  hero: { maxWidth: 1200, margin: '0 auto', padding: 'clamp(2.5rem,6vh,5rem) clamp(1rem,4vw,3rem) 0' },
  heroTitle: { fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: 'clamp(2.25rem,5vw,3.75rem)', lineHeight: 1.08, maxWidth: 680 },
  heroSub: { marginTop: '0.75rem', color: 'var(--muted)', fontWeight: 400, maxWidth: 520 },
  filterPanel: { maxWidth: 1200, margin: '0 auto', padding: 'clamp(1.5rem,3vw,2rem) clamp(1rem,4vw,3rem)' },
  filterCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.5rem', boxShadow: 'var(--shadow)' },
  filterGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' },
  filterGroup: { display: 'flex', flexDirection: 'column', gap: '0.35rem' },
  filterGroupWide: { display: 'flex', flexDirection: 'column', gap: '0.35rem', gridColumn: 'span 2' },
  label: { fontFamily: 'var(--font-mono)', fontSize: '0.66rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' },
  input: { background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontFamily: 'var(--font-ui)', fontSize: '0.92rem', fontWeight: 500, padding: '0.6rem 0.9rem', outline: 'none', transition: 'border-color 0.15s', width: '100%', appearance: 'none', WebkitAppearance: 'none' },
  dateRow: { display: 'flex', gap: '0.5rem', alignItems: 'center' },
  dateSep: { color: 'var(--muted)', fontSize: '0.85rem', whiteSpace: 'nowrap' },
  filterBottom: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' },
  sourceRow: { display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' },
  sourceLabel: { fontFamily: 'var(--font-mono)', fontSize: '0.66rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' },
  pill: { fontSize: '0.78rem', fontWeight: 600, padding: '4px 14px', borderRadius: 99, border: '1px solid var(--border)', cursor: 'pointer', background: 'transparent', color: 'var(--muted)', fontFamily: 'var(--font-ui)', transition: 'all 0.15s' },
  pillActive: { background: 'rgba(200,55,45,0.12)', borderColor: 'var(--accent)', color: 'var(--accent)', fontWeight: 500 },
  searchBtn: { background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, fontFamily: 'var(--font-ui)', fontSize: '0.9rem', fontWeight: 700, padding: '0.65rem 1.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'opacity 0.15s' },
  resetBtn: { background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 8, fontFamily: 'var(--font-ui)', fontSize: '0.9rem', fontWeight: 600, padding: '0.65rem 1.2rem', cursor: 'pointer', transition: 'all 0.15s' },
  results: { maxWidth: 1200, margin: '0 auto', padding: '0 clamp(1rem,4vw,3rem) 4rem' },
  resultsMeta: { fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '1.25rem', fontFamily: 'var(--font-mono)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gridAutoRows: '1fr', alignItems: 'stretch', gap: '1rem' },
  cardWrap: { height: '100%' },
  card: { height: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', boxShadow: 'var(--shadow)', transition: 'transform 0.15s, box-shadow 0.15s' },
  cardSource: { fontFamily: 'var(--font-mono)', fontSize: '0.66rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 600 },
  cardTitle: { fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '1.05rem', lineHeight: 1.35, color: 'var(--text)' },
  cardCompany: { fontSize: '0.86rem', fontWeight: 500, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' },
  cardDesc: { fontSize: '0.86rem', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  cardMeta: { display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.25rem' },
  tag: { fontSize: '0.74rem', fontWeight: 600, padding: '3px 10px', borderRadius: 99, border: '1px solid var(--border)', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'var(--bg)' },
  tagDeadline: { color: '#C87010', borderColor: 'rgba(200,130,0,0.35)', background: 'rgba(200,130,0,0.08)' },
  cardFooter: { marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' },
  applyBtn: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--text)', color: 'var(--bg)', padding: '0.55rem 1.1rem', borderRadius: 8, fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none', transition: 'opacity 0.15s' },
  stateBox: { textAlign: 'center', padding: '5rem 2rem', color: 'var(--muted)' },
  stateBig: { fontSize: '3rem', marginBottom: '0.75rem' },
  stateText: { fontSize: '1rem', fontWeight: 500 },
}

const uniq = (arr) => [...new Set(arr.filter(Boolean))].sort()
const buildSelectOptions = (values, placeholder) => [
  <option key="" value="">{placeholder}</option>,
  ...values.map(v => <option key={v} value={v}>{v}</option>)
]

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (isNaN(date)) return dateStr
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}

function SunIcon() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="5"/>
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}

function JobCard({ job }) {
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

export default function App() {
  const [allJobs, setAllJobs]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [searched, setSearched] = useState(false)
  const [dark, setDark]         = useState(() => {
    // Respect system preference on first load
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  const [query, setQuery]       = useState('')
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo]     = useState('')
  const [source, setSource]     = useState('')
  const [applied, setApplied]   = useState(null)

  // Apply CSS variables to :root whenever theme changes
  useEffect(() => {
    const vars = dark ? DARK : LIGHT
    const root = document.documentElement
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v))
    document.body.style.background = vars['--bg']
    document.body.style.color      = vars['--text']
  }, [dark])

  useEffect(() => {
    fetch('/api/jobs')
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then(data => { setAllJobs(data); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  const locations  = useMemo(() => uniq(allJobs.map(j => j.location)), [allJobs])
  const categories = useMemo(() => uniq(allJobs.map(j => j.category)), [allJobs])
  const sources    = useMemo(() => uniq(allJobs.map(j => j.source)),   [allJobs])

  const parseJobDate = (str) => {
    if (!str) return null
    const date = new Date(str)
    return isNaN(date) ? null : date
  }

  const filteredJobs = useMemo(() => {
    if (!applied) return []
    return allJobs.filter(j => {
      if (applied.source   && j.source   !== applied.source)   return false
      if (applied.location && j.location !== applied.location) return false
      if (applied.category && j.category !== applied.category) return false
      if (applied.dateFrom || applied.dateTo) {
        const jobDate = parseJobDate(j.activeUntil)
        if (jobDate) {
          if (applied.dateFrom && jobDate < new Date(applied.dateFrom)) return false
          if (applied.dateTo   && jobDate > new Date(applied.dateTo))   return false
        }
      }
      if (applied.query) {
        const q = applied.query.toLowerCase()
        if (!(j.title   || '').toLowerCase().includes(q) &&
            !(j.company || '').toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [allJobs, applied])

  const handleSearch = () => {
    setApplied({ query, location, category, dateFrom, dateTo, source })
    setSearched(true)
  }

  const handleReset = () => {
    setQuery(''); setLocation(''); setCategory('')
    setDateFrom(''); setDateTo(''); setSource('')
    setApplied(null); setSearched(false)
  }

  const focusInput = (e) => { e.target.style.borderColor = 'var(--accent)' }
  const blurInput  = (e) => { e.target.style.borderColor = 'var(--border)' }

  const headerBg = dark
    ? 'rgba(15,15,20,0.88)'
    : 'rgba(250,248,244,0.92)'

  return (
    <div style={S.page}>

      {/* HEADER */}
      <header style={{ ...S.header, background: headerBg }}>
        <div style={S.headerInner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img
              src={dark ? '/logo-dark.png' : '/logo-light.png'}
              alt="RabotekaMK"
              style={{ height: 42, width: 'auto', objectFit: 'contain' }}
            />
            <div style={S.logo}>Работека<span style={S.logoAccent}>МК</span></div>
          </div>
          <div style={S.headerRight}>
            {!loading && <span style={S.headerBadge}>{allJobs.length} огласи</span>}
            <button
              style={S.themeBtn}
              onClick={() => setDark(d => !d)}
              title={dark ? 'Светла тема' : 'Темна тема'}
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section style={S.hero}>
        <img
          src={dark ? '/logo-dark.png' : '/logo-light.png'}
          alt="RabotekaMK"
          style={{ height: 90, width: 'auto', objectFit: 'contain', marginBottom: '1rem' }}
        />
        <h1 style={S.heroTitle}>Најди ја<br/>твојата следна работа.</h1>
        <p style={S.heroSub}>
          РаботекаМК агрегира огласи од kariera.mk, vrabotuvanje.com.mk и najdirabota.com.mk — на едно место.
        </p>
      </section>

      {/* FILTER PANEL */}
      <section style={S.filterPanel}>
        <div style={S.filterCard}>
          <div style={S.filterGrid}>

            <div style={S.filterGroupWide}>
              <label style={S.label}>Пребарај по наслов или компанија</label>
              <input
                style={S.input}
                placeholder="пр. Junior Developer, Скопје..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={focusInput}
                onBlur={blurInput}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
              />
            </div>

            <div style={S.filterGroup}>
              <label style={S.label}>Локација</label>
              <select style={S.input} value={location} onChange={e => setLocation(e.target.value)} onFocus={focusInput} onBlur={blurInput}>
                {buildSelectOptions(locations, 'Сите локации')}
              </select>
            </div>

            <div style={S.filterGroup}>
              <label style={S.label}>Категорија</label>
              <select style={S.input} value={category} onChange={e => setCategory(e.target.value)} onFocus={focusInput} onBlur={blurInput}>
                {buildSelectOptions(categories, 'Сите категории')}
              </select>
            </div>

            <div style={S.filterGroupWide}>
              <label style={S.label}>Активен до — период</label>
              <div style={S.dateRow}>
                <input style={S.input} type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} onFocus={focusInput} onBlur={blurInput} />
                <span style={S.dateSep}>—</span>
                <input style={S.input} type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} onFocus={focusInput} onBlur={blurInput} />
              </div>
            </div>

          </div>

          <div style={S.filterBottom}>
            <div style={S.sourceRow}>
              <span style={S.sourceLabel}>Извор:</span>
              {['', ...sources].map(s => (
                <button key={s} style={{ ...S.pill, ...(source === s ? S.pillActive : {}) }} onClick={() => setSource(s)}>
                  {s || 'Сите'}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button style={S.resetBtn} onClick={handleReset}>Ресетирај</button>
              <button style={S.searchBtn} onClick={handleSearch} onMouseEnter={e => e.currentTarget.style.opacity='0.88'} onMouseLeave={e => e.currentTarget.style.opacity='1'}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                Пребарај
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <main style={S.results}>
        {loading && <div style={S.stateBox}><div style={S.stateBig}>⏳</div><div style={S.stateText}>Вчитување огласи…</div></div>}
        {error && <div style={S.stateBox}><div style={S.stateBig}>⚠️</div><div style={S.stateText}>Не може да се поврзе со API.<br/><small>Проверете дали Spring Boot работи на localhost:8080</small></div></div>}
        {!loading && !error && !searched && <div style={S.stateBox}><div style={S.stateBig}>🔍</div><div style={S.stateText}>Одберете филтри и притиснете <strong>Пребарај</strong></div></div>}
        {!loading && !error && searched && filteredJobs.length === 0 && <div style={S.stateBox}><div style={S.stateBig}>😕</div><div style={S.stateText}>Нема огласи кои одговараат на пребарувањето.</div></div>}
        {!loading && !error && searched && filteredJobs.length > 0 && (
          <>
            <div style={S.resultsMeta}>{filteredJobs.length} {filteredJobs.length === 1 ? 'оглас' : 'огласи'} пронајдени</div>
            <div style={S.grid}>
              {filteredJobs.map((job, i) => (
                <div key={job.id} style={{ ...S.cardWrap, animation: 'fadeUp 0.3s ease both', animationDelay: `${Math.min(i * 25, 400)}ms` }}>
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: ${dark ? 'invert(1)' : 'none'};
          opacity: 0.5;
          cursor: pointer;
        }
        select option {
          background: ${dark ? '#18181F' : '#FFFFFF'};
          color: ${dark ? '#EDECE8' : '#0F0F1A'};
        }
      `}</style>
    </div>
  )
}
