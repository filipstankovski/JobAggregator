import { S } from '../lib/styles'
import { buildSelectOptions } from '../lib/format'

const focusInput = (e) => { e.target.style.borderColor = 'var(--accent)' }
const blurInput  = (e) => { e.target.style.borderColor = 'var(--border)' }

function Select({ value, onChange, options }) {
  return (
    <select style={S.input} value={value} onChange={onChange} onFocus={focusInput} onBlur={blurInput}>
      {options.map(o => <option key={o.key} value={o.value}>{o.label}</option>)}
    </select>
  )
}

export function FilterPanel({
  query, setQuery,
  location, setLocation,
  category, setCategory,
  dateFrom, setDateFrom,
  dateTo, setDateTo,
  source, setSource,
  locations, categories, sources,
  handleSearch, handleReset,
}) {
  return (
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
            <Select
              value={location}
              onChange={e => setLocation(e.target.value)}
              options={buildSelectOptions(locations, 'Сите локации')}
            />
          </div>

          <div style={S.filterGroup}>
            <label style={S.label}>Категорија</label>
            <Select
              value={category}
              onChange={e => setCategory(e.target.value)}
              options={buildSelectOptions(categories, 'Сите категории')}
            />
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
  )
}
