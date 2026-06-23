export const uniq = (arr) => [...new Set(arr.filter(Boolean))].sort()

export const buildSelectOptions = (values, placeholder) => [
  { key: '', value: '', label: placeholder },
  ...values.map(v => ({ key: v, value: v, label: v }))
]

export const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (isNaN(date)) return dateStr
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}

export const parseJobDate = (str) => {
  if (!str) return null
  const date = new Date(str)
  return isNaN(date) ? null : date
}
