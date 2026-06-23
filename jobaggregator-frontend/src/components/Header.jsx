import { S } from '../lib/styles'
import { SunIcon } from './icons/SunIcon'
import { MoonIcon } from './icons/MoonIcon'

export function Header({ dark, toggleTheme, jobCount, loading }) {
  const headerBg = dark
    ? 'rgba(15,15,20,0.88)'
    : 'rgba(250,248,244,0.92)'

  return (
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
          {!loading && <span style={S.headerBadge}>{jobCount} огласи</span>}
          <button
            style={S.themeBtn}
            onClick={toggleTheme}
            title={dark ? 'Светла тема' : 'Темна тема'}
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>
    </header>
  )
}
