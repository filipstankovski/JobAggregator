import { S } from '../lib/styles'
import { JobCard } from './JobCard'

export function JobGrid({ jobs, pageInfo, onPreviousPage, onNextPage }) {
  const pageNumber = pageInfo.number + 1
  const totalPages = Math.max(pageInfo.totalPages, 1)

  return (
    <>
      <div style={S.resultsTop}>
        <div style={S.resultsMeta}>
          {jobs.length} {jobs.length === 1 ? 'оглас' : 'огласи'} на оваа страна
          {pageInfo.totalElements > 0 && ` од ${pageInfo.totalElements} вкупно`}
        </div>
        <div style={S.pagination}>
          <button
            style={{ ...S.pageBtn, ...(pageInfo.first ? S.pageBtnDisabled : {}) }}
            onClick={onPreviousPage}
            disabled={pageInfo.first}
          >
            Претходна
          </button>
          <span style={S.pageText}>{pageNumber} / {totalPages}</span>
          <button
            style={{ ...S.pageBtn, ...(pageInfo.last ? S.pageBtnDisabled : {}) }}
            onClick={onNextPage}
            disabled={pageInfo.last}
          >
            Следна
          </button>
        </div>
      </div>
      <div className="job-grid" style={S.grid}>
        {jobs.map((job, i) => (
          <div key={job.id} style={{ ...S.cardWrap, animation: 'fadeUp 0.3s ease both', animationDelay: `${Math.min(i * 25, 400)}ms` }}>
            <JobCard job={job} />
          </div>
        ))}
      </div>
    </>
  )
}
