import { useState, useMemo } from 'react'
import { uniq, parseJobDate } from '../lib/format'

export function useJobFilters(allJobs) {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [source, setSource] = useState('')
  const [applied, setApplied] = useState(null)
  const [searched, setSearched] = useState(false)

  const locations  = useMemo(() => uniq(allJobs.map(j => j.location)), [allJobs])
  const categories = useMemo(() => uniq(allJobs.map(j => j.category)), [allJobs])
  const sources    = useMemo(() => uniq(allJobs.map(j => j.source)),   [allJobs])

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

  return {
    query, setQuery,
    location, setLocation,
    category, setCategory,
    dateFrom, setDateFrom,
    dateTo, setDateTo,
    source, setSource,
    locations, categories, sources,
    filteredJobs, searched,
    handleSearch, handleReset,
  }
}
