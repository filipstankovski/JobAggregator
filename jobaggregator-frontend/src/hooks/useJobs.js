import { useState, useEffect, useMemo } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { fetchJobs } from '../api/jobsApi'

const PAGE_SIZE = 30

const pageFromSearchParams = (searchParams) => {
  const pageParam = Number(searchParams.get('page') || '1')

  if (!Number.isInteger(pageParam) || pageParam < 1) {
    return 0
  }

  return pageParam - 1
}

export function useJobs(filters = {}) {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [allJobs, setAllJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pageInfo, setPageInfo] = useState({
    number: 0,
    size: PAGE_SIZE,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
  })
  const filtersKey = useMemo(() => JSON.stringify(filters), [filters])
  const page = pageFromSearchParams(searchParams)

  useEffect(() => {
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

  const navigateToPage = (nextPage) => {
    const nextSearchParams = new URLSearchParams(searchParams)

    if (nextPage <= 0) {
      nextSearchParams.delete('page')
    } else {
      nextSearchParams.set('page', String(nextPage + 1))
    }

    navigate({
      pathname: location.pathname,
      search: nextSearchParams.toString(),
    })
  }

  const goToPreviousPage = () => {
    navigateToPage(Math.max(page - 1, 0))
  }

  const goToNextPage = () => {
    const nextPage = pageInfo.totalPages > 0
      ? Math.min(page + 1, pageInfo.totalPages - 1)
      : page + 1

    navigateToPage(nextPage)
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
