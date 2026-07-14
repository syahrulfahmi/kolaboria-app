<template>
  <div>
    <h2 class="font-title-2 mb-2 tracking-tight">Selamat Datang Kembali</h2>
    <p class="font-body-1 text-secondary mb-8">
      Masuk ke ekosistem kolaboratif Anda untuk melanjutkan.
    </p>

    <AuthLoginForm />

    <div class="mt-6 text-center font-body-1">
      Belum punya akun?
      <NuxtLink
        to="/register"
        class="font-body-1 text-primary-600 hover:text-primary-700"
      >
        Daftar sekarang
      </NuxtLink>
    </div>

    <!-- Divider -->
    <div class="relative my-8">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-secondary-100"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-4 font-label-2 bg-white text-secondary"
          >Atau masuk pakai</span
        >
      </div>
    </div>

    <AuthSocialLogin />
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'auth'
})

useHead({
  title: 'Masuk - Kolaboria',
  meta: [
    {
      name: 'description',
      content: 'Masuk ke Kolaboria buat mulai berkolaborasi.'
    }
  ]
})
</script>
