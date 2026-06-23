import { S } from '../lib/styles'
import { useTheme } from '../hooks/useTheme'
import { useJobs } from '../hooks/useJobs'
import { useJobFilters } from '../hooks/useJobFilters'
import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { FilterPanel } from '../components/FilterPanel'
import { JobGrid } from '../components/JobGrid'
import { StateMessage } from '../components/StateMessage'
import { GlobalStyles } from '../components/GlobalStyles'

export function HomePage() {
  const { dark, toggleTheme } = useTheme()
  const { allJobs, loading, error } = useJobs()
  const filters = useJobFilters(allJobs)
  const { filteredJobs, searched } = filters

  return (
    <div style={S.page}>
      <Header dark={dark} toggleTheme={toggleTheme} jobCount={allJobs.length} loading={loading} />

      <Hero dark={dark} />

      <FilterPanel {...filters} />

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
        {!loading && !error && searched && filteredJobs.length === 0 && (
          <StateMessage icon="😕" text="Нема огласи кои одговараат на пребарувањето." />
        )}
        {!loading && !error && searched && filteredJobs.length > 0 && (
          <JobGrid jobs={filteredJobs} />
        )}
      </main>

      <GlobalStyles dark={dark} />
    </div>
  )
}
