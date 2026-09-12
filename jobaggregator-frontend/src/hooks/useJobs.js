import { useState, useEffect, useMemo, useRef } from 'react'
import { fetchJobs } from '../api/jobsApi'

const PAGE_SIZE = 30

export function useJobs(filters = {}) {
  const [allJobs, setAllJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [pageInfo, setPageInfo] = useState({
    number: 0,
    size: PAGE_SIZE,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
  })
  const filtersKey = useMemo(() => JSON.stringify(filters), [filters])
  const previousFiltersKey = useRef(filtersKey)

  useEffect(() => {
    if (previousFiltersKey.current !== filtersKey) {
      previousFiltersKey.current = filtersKey
      if (page !== 0) {
        setPage(0)
        return
      }
    }

    setLoading(true)
    setError(null)

    fetchJobs({ page, size: PAGE_SIZE, filters })
      .then(data => {
        const jobs = Array.isArray(data) ? data : data.content || []
        setAllJobs(jobs)
        setPageInfo({
          number: data.number ?? page,
          size: data.size ?? PAGE_SIZE,
          totalElements: data.totalElements ?? jobs.length,
          totalPages: data.totalPages ?? 1,
          first: data.first ?? page === 0,
          last: data.last ?? true,
        })
      })
      .catch(e => { setError(e.message) })
      .finally(() => { setLoading(false) })
  }, [page, filtersKey])

  const goToPreviousPage = () => {
    setPage(currentPage => Math.max(currentPage - 1, 0))
  }

  const goToNextPage = () => {
    setPage(currentPage => (
      pageInfo.totalPages > 0
        ? Math.min(currentPage + 1, pageInfo.totalPages - 1)
        : currentPage + 1
    ))
  }

  return {
    allJobs,
    loading,
    error,
    pageInfo,
    goToPreviousPage,
    goToNextPage,
  }
}
