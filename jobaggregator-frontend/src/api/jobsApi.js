export async function fetchJobs() {
  const res = await fetch('/api/jobs')
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}
