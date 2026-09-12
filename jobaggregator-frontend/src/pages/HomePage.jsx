import { useEffect, useState } from 'react'
import { S } from '../lib/styles'
import { useTheme } from '../hooks/useTheme'
import { useJobs } from '../hooks/useJobs'
import { useJobFilters } from '../hooks/useJobFilters'
import { fetchJobFilterOptions } from '../api/jobsApi'
import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { FilterPanel } from '../components/FilterPanel'
import { JobGrid } from '../components/JobGrid'
import { StateMessage } from '../components/StateMessage'
import { GlobalStyles } from '../components/GlobalStyles'

export function HomePage() {
  const { dark, toggleTheme } = useTheme()
  const filters = useJobFilters()
  const { allJobs, loading, error, pageInfo, goToPreviousPage, goToNextPage } = useJobs(filters.appliedFilters)
  const searched = filters.searched
  const [filterOptions, setFilterOptions] = useState({
    locations: [],
    categories: [],
    sources: [],
  })

  useEffect(() => {
    fetchJobFilterOptions()
      .then(options => {
        setFilterOptions({
          locations: options.locations || [],
          categories: options.categories || [],
          sources: options.sources || [],
        })
      })
      .catch(() => {
        setFilterOptions({
          locations: [],
          categories: [],
          sources: [],
        })
      })
  }, [])

  return (
    <div style={S.page}>
      <Header dark={dark} toggleTheme={toggleTheme} jobCount={pageInfo.totalElements} loading={loading} />

      <Hero dark={dark} />

      <FilterPanel
        {...filters}
        locations={filterOptions.locations}
        categories={filterOptions.categories}
        sources={filterOptions.sources}
      />

      <main style={S.results}>
        {loading && (
          <StateMessage icon="⏳" text="Вчитување огласи…" />
        )}
        {error && (
          <StateMessage icon="⚠️" text="Не може да се поврзе со API." hint="Проверете дали Spring Boot работи на localhost:8080" />
        )}
        {!loading && !error && !searched && (
          <StateMessage icon="🔍" text={<>Одберете филтри и притиснете <strong>Пребарај</strong></>} />
        )}
        {!loading && !error && searched && allJobs.length === 0 && (
          <StateMessage icon="😕" text="Нема огласи кои одговараат на пребарувањето." />
        )}
        {!loading && !error && searched && allJobs.length > 0 && (
          <JobGrid
            jobs={allJobs}
            pageInfo={pageInfo}
            onPreviousPage={goToPreviousPage}
            onNextPage={goToNextPage}
          />
        )}
      </main>

      <GlobalStyles dark={dark} />
    </div>
  )
}
