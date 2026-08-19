<script setup lang="ts">
import type { CreateProjectPayload } from '~/types/project'
import { getProjectCategoryLabel } from '~/constants/projectCategory'

const props = defineProps<{
  profile: any
  canPublish: boolean
  submitError: string
  isSubmitting: boolean
  tools: { id: string; name: string }[]
  contributionRoles: { id: string; name: string; slug: string; category?: string | null }[]
}>()

const form = defineModel<CreateProjectPayload>('form', { required: true })

const getToolName = (id: string) => {
  return props.tools.find((tool) => tool.id === id)?.name || id
}

const getRoleName = (role: { contribution_role_id?: string; custom_title?: string }) => {
  if (role.custom_title) return role.custom_title
  return props.contributionRoles.find((item) => item.id === role.contribution_role_id)?.name || 'Project Role'
}

const getToolNames = (ids: string[] = []) =>
  ids.map((id) => props.tools.find((tool) => tool.id === id)?.name || id)

const totalCapacity = computed(() =>
  form.value.roles?.reduce((total, role) => total + Number(role.capacity || 0), 0) || 0
)
</script>

<template>
  <OrganismCard
    variant="elevated"
    class="animate-fade-in border-0 shadow-lg shadow-neutral-200/50"
  >
    <div class="mb-6 border-b border-neutral-100 pb-5">
      <h3 class="font-title-2">Review & Simpan</h3>
      <p class="mt-1 font-paragraph-2 text-secondary">
        Periksa kembali detail project sebelum menyimpan atau mempublikasikannya
        ke komunitas Kolaboria.
      </p>
    </div>

    <div class="space-y-6">
      <!-- Receipt-style Summary -->
      <div
        class="overflow-hidden rounded-2xl border border-neutral-200 bg-white"
      >
        <div
          class="bg-neutral-50 px-5 py-4 border-b border-neutral-200 flex items-center justify-between"
        >
          <h4 class="font-label-1">Ringkasan Project</h4>
          <span
            class="rounded-full bg-primary-50 px-2.5 py-0.5 text-[11px] text-body tracking-wide text-primary-700 uppercase ring-1 ring-inset ring-primary-600/20"
          >
            {{ form.visibility === 'public' ? 'Publik' : 'Invite Only' }}
          </span>
        </div>

        <div class="p-5">
          <dl class="grid grid-cols-1 gap-y-6 sm:grid-cols-2 gap-x-8">
            <div class="sm:col-span-2">
              <dt class="font-label-1">Judul Project</dt>
              <dd class="mt-1 font-body-1">
                {{ form.title || 'Belum diisi' }}
              </dd>
              <dd class="mt-1 font-paragraph-2 text-secondary">
                {{ form.summary || 'Ringkasan belum diisi.' }}
              </dd>
            </div>

            <div>
              <dt class="font-label-1">Kategori</dt>
              <dd class="mt-1 font-body-1">
                {{ form.project_category ? getProjectCategoryLabel(form.project_category) : '—' }}
              </dd>
            </div>

            <div class="sm:col-span-2 border-t border-neutral-100 pt-4">
              <dt class="mb-2 font-label-1">Peran yang Dibutuhkan</dt>
              <dd v-if="form.roles && form.roles.length" class="space-y-3">
                <div
                  v-for="role in form.roles"
                  :key="role.id || role.custom_title"
                  class="rounded-xl bg-neutral-50 p-3 ring-1 ring-inset ring-neutral-200"
                >
                  <div class="flex items-center justify-between gap-3">
                    <span class="font-body-2">{{ getRoleName(role) }}</span>
                    <span class="text-xs text-secondary">{{ role.capacity }} posisi</span>
                  </div>
                  <p v-if="role.description" class="mt-1 text-xs text-secondary">
                    {{ role.description }}
                  </p>
                  <p v-if="role.tool_ids?.length" class="mt-1 text-xs text-secondary">
                    Tools: {{ getToolNames(role.tool_ids).join(', ') }}
                  </p>
                </div>
              </dd>
              <span v-else class="font-body-2 italic">Belum ada role</span>
            </div>

            <div>
              <dt class="font-label-1">Total Kebutuhan Kontributor</dt>
              <dd class="mt-1 font-body-2">{{ totalCapacity }} Orang</dd>
            </div>

            <div>
              <dt class="font-label-1">Timeline</dt>
              <dd class="mt-1 font-body-2">
                {{
                  form.start_date
                    ? new Date(form.start_date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })
                    : 'Belum ditentukan'
                }}
                <span class="text-neutral-400 mx-1">-</span>
                {{
                  form.deadline
                    ? new Date(form.deadline).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })
                    : 'Tidak ada'
                }}
              </dd>
            </div>

            <div>
              <dt class="font-label-1">Tech Stack / Tools</dt>
              <dd class="mt-1.5 flex flex-wrap gap-1.5">
                <span
                  v-for="toolId in form.tool_ids"
                  :key="toolId"
                  class="inline-flex items-center rounded-lg bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700 ring-1 ring-inset ring-neutral-200"
                >
                  {{ getToolName(toolId) }}
                </span>
                <span
                  v-if="!form.tool_ids || form.tool_ids.length === 0"
                  class="font-body-2 italic"
                >
                  Tidak ada
                </span>
              </dd>
            </div>

          </dl>
        </div>
      </div>

      <!-- Publish warning -->
      <MoleculeTicker
        v-if="!canPublish"
        class="mt-6"
        variant="warning"
        title="Profil Belum Lengkap"
        :message="`Completion score-mu ${profile?.completion_score ?? 0}%. Kamu perlu minimal 50% untuk publish project ke publik. Jangan khawatir, kamu tetap bisa menyimpan project ini sebagai Draft.`"
        :closable="false"
        action-label="Lengkapi Profil"
        :action-click="() => navigateTo('/profile/me/edit')"
      />

      <!-- Submit error -->
      <MoleculeTicker
        v-if="submitError"
        class="mt-4"
        variant="danger"
        :message="submitError"
        :closable="false"
      />
    </div>
  </OrganismCard>
</template>
