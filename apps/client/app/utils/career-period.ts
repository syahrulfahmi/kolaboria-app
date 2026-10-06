import { formatYearMonth } from './year-month'

export const formatCareerPeriod = (
  startYear: number | string,
  startMonth: number | null | undefined,
  endYear: number | string | null,
  endMonth: number | null | undefined
): string => `${formatYearMonth(startYear, startMonth)} — ${
  endYear == null ? 'Sekarang' : formatYearMonth(endYear, endMonth)
}`
