import { useState, useEffect } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

const emptyFilters = {
  query: '',
  location: '',
  category: '',
  dateFrom: '',
  dateTo: '',
  source: '',
}

const filtersFromSearchParams = (searchParams) => ({
  query: searchParams.get('query') || '',
  location: searchParams.get('location') || '',
  category: searchParams.get('category') || '',
  dateFrom: searchParams.get('activeFrom') || '',
  dateTo: searchParams.get('activeTo') || '',
  source: searchParams.get('source') || '',
})

const filtersToSearchParams = (filters) => {
  const searchParams = new URLSearchParams()

  if (filters.query) searchParams.set('query', filters.query)
  if (filters.location) searchParams.set('location', filters.location)
  if (filters.category) searchParams.set('category', filters.category)
  if (filters.dateFrom) searchParams.set('activeFrom', filters.dateFrom)
  if (filters.dateTo) searchParams.set('activeTo', filters.dateTo)
  if (filters.source) searchParams.set('source', filters.source)

  return searchParams
}

export function useJobFilters() {
  const locationState = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isJobsRoute = locationState.pathname === '/jobs'
  const isJobListRoute = locationState.pathname === '/' || isJobsRoute
  const initialFilters = isJobListRoute ? filtersFromSearchParams(searchParams) : emptyFilters

  const [query, setQuery] = useState(initialFilters.query)
  const [location, setLocation] = useState(initialFilters.location)
  const [category, setCategory] = useState(initialFilters.category)
  const [dateFrom, setDateFrom] = useState(initialFilters.dateFrom)
  const [dateTo, setDateTo] = useState(initialFilters.dateTo)
  const [source, setSource] = useState(initialFilters.source)
  const [applied, setApplied] = useState(isJobListRoute ? initialFilters : null)
  const [searched, setSearched] = useState(isJobListRoute)

  useEffect(() => {
    if (isJobListRoute) {
      const nextFilters = filtersFromSearchParams(searchParams)
      setQuery(nextFilters.query)
      setLocation(nextFilters.location)
      setCategory(nextFilters.category)
      setDateFrom(nextFilters.dateFrom)
      setDateTo(nextFilters.dateTo)
      setSource(nextFilters.source)
      setSearched(true)
      setApplied(nextFilters)
    } else {
      setSearched(false)
      setApplied(null)
    }
  }, [isJobListRoute, searchParams])

  const handleSearch = () => {
    const nextFilters = { query, location, category, dateFrom, dateTo, source }
    const nextSearchParams = filtersToSearchParams(nextFilters)

    setApplied(nextFilters)
    setSearched(true)
    navigate({
      pathname: '/jobs',
      search: nextSearchParams.toString(),
    })
  }

  const handleReset = () => {
    setQuery(''); setLocation(''); setCategory('')
    setDateFrom(''); setDateTo(''); setSource('')
    setApplied(emptyFilters); setSearched(true)
    navigate('/')
  }

  return {
    query, setQuery,
    location, setLocation,
    category, setCategory,
    dateFrom, setDateFrom,
    dateTo, setDateTo,
    source, setSource,
    appliedFilters: applied || emptyFilters,
    searched,
    handleSearch, handleReset,
  }
}
