<script setup lang="ts">
import type { CreateProjectPayload } from '~/types/project'

const props = defineProps<{
  profile: any
  canPublish: boolean
  submitError: string
  isSubmitting: boolean
}>()

const form = defineModel<CreateProjectPayload>('form', { required: true })

const emit = defineEmits<{
  'save-draft': []
  'save-and-publish': []
}>()
</script>

<template>
  <OrganismCard variant="elevated" class="animate-fade-in border-0 shadow-lg shadow-neutral-200/50">
    <div class="mb-6 border-b border-neutral-100 pb-5">
      <h3 class="text-title text-secondary-900">4. Review & Simpan</h3>
      <p class="mt-1.5 text-body text-neutral-500">Periksa kembali detail project sebelum menyimpan atau mempublikasikannya ke komunitas Kolaboria.</p>
    </div>

    <div class="space-y-6">
      <!-- Receipt-style Summary -->
      <div class="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <div class="bg-neutral-50 px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
          <h4 class="text-sm font-bold text-secondary-900 uppercase tracking-wide">Ringkasan Project</h4>
          <span class="rounded-full bg-primary-50 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-primary-700 uppercase ring-1 ring-inset ring-primary-600/20">
            {{ form.visibility === 'public' ? 'Publik' : 'Invite Only' }}
          </span>
        </div>
        
        <div class="p-5">
          <dl class="grid grid-cols-1 gap-y-6 sm:grid-cols-2 gap-x-8">
            <div class="sm:col-span-2">
              <dt class="text-xs font-semibold tracking-wide uppercase text-neutral-500">Judul Project</dt>
              <dd class="mt-1.5 text-base font-semibold text-secondary-900">{{ form.title || 'Belum diisi' }}</dd>
              <dd class="mt-1 text-sm text-neutral-600 line-clamp-2">{{ form.summary || 'Ringkasan belum diisi.' }}</dd>
            </div>

            <div>
              <dt class="text-xs font-semibold tracking-wide uppercase text-neutral-500">Kategori</dt>
              <dd class="mt-1.5 text-sm font-medium text-secondary-900 capitalize">{{ form.type ? form.type.replace('_', ' ') : '—' }}</dd>
            </div>

            <div>
              <dt class="text-xs font-semibold tracking-wide uppercase text-neutral-500">Kebutuhan Slot</dt>
              <dd class="mt-1.5 text-sm font-medium text-secondary-900">{{ form.max_slots }} Kontributor</dd>
            </div>

            <div>
              <dt class="text-xs font-semibold tracking-wide uppercase text-neutral-500">Timeline</dt>
              <dd class="mt-1.5 text-sm font-medium text-secondary-900">
                {{ form.start_date ? new Date(form.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Belum ditentukan' }}
                <span class="text-neutral-400 mx-1">→</span>
                {{ form.deadline ? new Date(form.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Tidak ada' }}
              </dd>
            </div>

            <div class="sm:col-span-2 pt-4 border-t border-neutral-100">
              <dt class="text-xs font-semibold tracking-wide uppercase text-neutral-500 mb-2">Skill Utama yang Dicari</dt>
              <dd>
                <div v-if="form.skill_tag_ids && form.skill_tag_ids.length > 0" class="flex flex-wrap gap-2">
                  <span v-for="skillId in form.skill_tag_ids" :key="skillId" class="inline-flex items-center rounded-md bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700 ring-1 ring-inset ring-neutral-200">
                    Skill ID: {{ skillId }} <!-- Idealnya di map ke nama skill jika ada contextnya, atau cukup hitungan -->
                  </span>
                  <!-- Jika nama skill tidak tersedia di form, tampilkan jumlahnya saja: -->
                  <span class="inline-flex items-center rounded-md bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700 ring-1 ring-inset ring-primary-600/20">
                    {{ form.skill_tag_ids.length }} skill terpilih
                  </span>
                </div>
                <span v-else class="text-sm text-neutral-400 italic">Belum ada skill yang dipilih</span>
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
        :action-click="() => navigateTo(`/profile/${profile?.username}/edit`)"
      />

      <!-- Submit error -->
      <MoleculeTicker
        v-if="submitError"
        class="mt-4"
        variant="danger"
        :message="submitError"
        :closable="false"
      />

      <!-- Actions -->
      <div class="mt-8 flex flex-col gap-3 sm:flex-row pt-2">
        <AtomicButton
          variant="outline"
          class="flex-1 py-3 text-sm font-semibold"
          :disabled="isSubmitting"
          @click="emit('save-draft')"
        >
          Simpan sebagai Draft
        </AtomicButton>
        <AtomicButton
          variant="primary"
          class="flex-1 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5 shadow-md shadow-primary-500/20"
          :disabled="isSubmitting || !canPublish"
          @click="emit('save-and-publish')"
        >
          <span class="flex items-center justify-center gap-2">
            <svg v-if="!isSubmitting" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
            {{ isSubmitting ? 'Memproses...' : 'Publish Project Sekarang' }}
          </span>
        </AtomicButton>
      </div>
    </div>
  </OrganismCard>
</template>
