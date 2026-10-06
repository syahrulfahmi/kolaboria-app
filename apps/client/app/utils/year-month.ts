export const monthNames = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember'
] as const

export const monthIndex = (date: Date): number =>
  date.getFullYear() * 12 + date.getMonth()

// Unknown legacy months must remain empty, rather than defaulting to January.
export const toMonthDate = (
  year: number | null | undefined,
  month: number | null | undefined
): Date | null => {
  if (
    year == null || month == null ||
    !Number.isInteger(year) || !Number.isInteger(month) ||
    month < 1 || month > 12
  ) return null
  return new Date(year, month - 1, 1)
}

export const formatYearMonth = (
  year: number | string,
  month: number | null | undefined
): string => {
  const name = month == null ? undefined : monthNames[month - 1]
  return name ? `${name} ${year}` : String(year)
}
