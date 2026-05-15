<script setup lang="ts">
import { watch } from 'vue'

const user = useSupabaseUser()
const client = useSupabaseClient()
const router = useRouter()

// Wait for the user to be populated by the Supabase module
watch(
  user,
  async (currentUser) => {
    if (currentUser) {
      // Check if user is already onboarded by checking account_type in profiles
      const { data, error } = await client
        .from('profiles')
        .select('account_type')
        .eq('id', currentUser.id)
        .single()

      if (!error && data?.account_type) {
        // User already has account type, go to home
        return router.push('/home')
      } else {
        // User is new or hasn't finished onboarding
        return router.push('/after-register')
      }
    }
  },
  { immediate: true }
)

definePageMeta({
  layout: 'auth'
})

useHead({
  title: 'Memproses Sesi... - Kolaboria'
})
</script>

<template>
  <div class="flex flex-col items-center justify-center py-24 text-center">
    <MoleculeLoading type="section" label="Memproses Sesi Anda..." />
    <p class="text-sm text-neutral-500 mt-4">Sedang memverifikasi data Anda.</p>
  </div>
</template>
