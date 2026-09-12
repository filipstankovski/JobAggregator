export async function fetchJobs({ page = 0, size = 50, filters = {} } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
    sort: 'activeUntil,asc',
  })

  if (filters.query) params.set('query', filters.query)
  if (filters.location) params.set('location', filters.location)
  if (filters.category) params.set('category', filters.category)
  if (filters.source) params.set('source', filters.source)
  if (filters.dateFrom) params.set('activeFrom', filters.dateFrom)
  if (filters.dateTo) params.set('activeTo', filters.dateTo)

  const res = await fetch(`/api/jobs?${params}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function fetchJobFilterOptions() {
  const res = await fetch('/api/jobs/filter-options')
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}
