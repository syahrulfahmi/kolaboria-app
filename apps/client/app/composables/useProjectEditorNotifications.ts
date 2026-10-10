import { watch, type Ref } from 'vue'
import { useToast } from './useToast'

type ProjectEditorSaveResult = {
  kind: 'draft' | 'published' | 'updated'
  message: string
}

type ProjectEditorNotificationState = {
  submitError: Ref<string>
  saveResult: Ref<ProjectEditorSaveResult | null>
}

type ProjectEditorToast = Pick<ReturnType<typeof useToast>, 'error' | 'success'>

export const useProjectEditorNotifications = (
  editor: ProjectEditorNotificationState,
  options: { toast?: ProjectEditorToast } = {}
) => {
  const toast = options.toast ?? useToast()

  watch(editor.submitError, (message) => {
    if (message) toast.error(message, 'Proyek belum tersimpan')
  })

  watch(editor.saveResult, (result) => {
    if (!result) return

    const title = {
      draft: 'Draft tersimpan',
      published: 'Proyek dipublikasikan',
      updated: 'Perubahan tersimpan'
    }[result.kind]

    toast.success(result.message, title, 6000)
  })
}
