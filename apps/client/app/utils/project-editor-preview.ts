export const isProjectEditorPreview = (
  isDevelopment: boolean,
  previewQuery: unknown
) => isDevelopment && previewQuery === '1'
