<template>
  <div>
    <p class="text-title text-primary-500 mb-2 uppercase tracking-wide">
      Akses Platform
    </p>
    <h2 class="text-heading font-black text-secondary-500 mb-2 tracking-tight">
      Selamat Datang Kembali
    </h2>
    <p class="text-body text-secondary-300 mb-8">
      Masuk ke ekosistem kolaboratif Anda untuk melanjutkan.
    </p>

    <AuthLoginForm />

    <div class="mt-6 text-center text-body text-gray-600">
      Belum punya akun?
      <NuxtLink
        to="/register"
        class="font-semibold text-primary-600 hover:text-primary-700"
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
        <span class="px-4 font-label-sm bg-white text-secondary-300"
          >Atau masuk pakai</span
        >
      </div>
    </div>

    <!-- <AuthSocialLogin /> -->
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
