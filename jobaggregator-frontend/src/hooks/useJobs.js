import { useState, useEffect } from 'react'
import { fetchJobs } from '../api/jobsApi'

export function useJobs() {
  const [allJobs, setAllJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchJobs()
      .then(data => { setAllJobs(data); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  return { allJobs, loading, error }
}
