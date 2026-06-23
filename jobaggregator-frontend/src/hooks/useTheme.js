import { useState, useEffect } from 'react'
import { LIGHT, DARK } from '../lib/theme'

export function useTheme() {
  const [dark, setDark] = useState(() => {
    // Respect system preference on first load
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  // Apply CSS variables to :root whenever theme changes
  useEffect(() => {
    const vars = dark ? DARK : LIGHT
    const root = document.documentElement
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v))
    document.body.style.background = vars['--bg']
    document.body.style.color = vars['--text']
  }, [dark])

  const toggleTheme = () => setDark(d => !d)

  return { dark, toggleTheme }
}
