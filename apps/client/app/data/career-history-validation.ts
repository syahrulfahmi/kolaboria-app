import { z } from 'zod'

export const careerHistoryFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, 'Posisi/jabatan harus diisi.')
      .max(150, 'Posisi/jabatan maksimal 150 karakter.'),
    company: z
      .string()
      .trim()
      .min(2, 'Nama perusahaan harus diisi.')
      .max(150, 'Nama perusahaan maksimal 150 karakter.'),
    start_year: z.coerce
      .number()
      .int('Tahun mulai harus berupa tahun yang valid.')
      .min(1950, 'Pilih bulan dan tahun mulai yang valid.'),
    start_month: z.number().int().min(1).max(12).nullable(),
    end_year: z.union([
      z.literal(null),
      z.coerce
        .number()
        .int('Tahun selesai harus berupa tahun yang valid.')
        .min(1950, 'Pilih bulan dan tahun selesai yang valid.')
    ]),
    end_month: z.number().int().min(1).max(12).nullable(),
    description: z.string().trim().max(2000, 'Deskripsi maksimal 2.000 karakter.'),
    is_current: z.boolean()
  })
  .superRefine((data, context) => {
    if (data.start_month === null) {
      context.addIssue({ code: 'custom', message: 'Pilih bulan dan tahun mulai.', path: ['start_month'] })
    }
    if (!data.is_current && data.end_year === null) {
      context.addIssue({
        code: 'custom',
        message: 'Pilih bulan dan tahun selesai jika pengalaman sudah berakhir.',
        path: ['end_year']
      })
    }

    if (!data.is_current && data.end_month === null) {
      context.addIssue({ code: 'custom', message: 'Pilih bulan dan tahun selesai.', path: ['end_month'] })
    }

    const now = new Date()
    const currentPeriod = now.getFullYear() * 12 + now.getMonth()
    const startPeriod = data.start_month === null ? null : data.start_year * 12 + data.start_month - 1
    const endPeriod = data.is_current || data.end_year === null || data.end_month === null
      ? null : data.end_year * 12 + data.end_month - 1
    if (startPeriod !== null && startPeriod > currentPeriod) {
      context.addIssue({ code: 'custom', message: 'Periode mulai tidak boleh melebihi bulan ini.', path: ['start_month'] })
    }
    if (endPeriod !== null && endPeriod > currentPeriod) {
      context.addIssue({ code: 'custom', message: 'Periode selesai tidak boleh melebihi bulan ini.', path: ['end_month'] })
    }
    if (startPeriod !== null && endPeriod !== null && endPeriod < startPeriod) {
      context.addIssue({ code: 'custom', message: 'Periode selesai tidak boleh sebelum periode mulai.', path: ['end_month'] })
    }

    if (!data.is_current && data.end_year !== null && data.end_year < data.start_year) {
      context.addIssue({
        code: 'custom',
        message: 'Tahun selesai tidak boleh kurang dari tahun mulai.',
        path: ['end_year']
      })
    }
  })

export type CareerHistoryFormValues = z.infer<typeof careerHistoryFormSchema>
