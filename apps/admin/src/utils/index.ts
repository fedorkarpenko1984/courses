export const formatDate = (date: Date): string => {
  if (!date) return ''

  const d = date instanceof Date ? date : new Date(date)

  if (isNaN(d.getTime())) return ''

  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = String(d.getFullYear()).slice(-2)
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')

  return `${day}.${month}.${year} в ${hours}:${minutes}`
}

export const isArraysValuesEquel = <T>(arr1: T[], arr2: T[]): boolean => {
  let isEquel = true
  arr1.forEach((item, index) => {
    if (item !== arr2[index]) isEquel = false
  })
  return isEquel
}