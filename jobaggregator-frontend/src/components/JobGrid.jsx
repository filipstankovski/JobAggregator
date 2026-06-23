import { S } from '../lib/styles'
import { JobCard } from './JobCard'

export function JobGrid({ jobs }) {
  return (
    <>
      <div style={S.resultsMeta}>{jobs.length} {jobs.length === 1 ? 'оглас' : 'огласи'} пронајдени</div>
      <div style={S.grid}>
        {jobs.map((job, i) => (
          <div key={job.id} style={{ ...S.cardWrap, animation: 'fadeUp 0.3s ease both', animationDelay: `${Math.min(i * 25, 400)}ms` }}>
            <JobCard job={job} />
          </div>
        ))}
      </div>
    </>
  )
}
