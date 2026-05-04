<template>
  <div>
    <h2 class="text-3xl font-black text-secondary-500 mb-2 tracking-tight">
      Buat Akun Baru
    </h2>
    <p class="text-body text-secondary-300 mb-8">
      Gabung bersama ribuan inovator dan wujudkan idemu.
    </p>

    <AuthRegisterForm />

    <div class="mt-6 text-center text-body text-gray-600">
      Sudah punya akun?
      <NuxtLink
        to="/login"
        class="text-body text-primary-600 hover:text-primary-700"
      >
        Masuk di sini
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

    <AuthSocialLogin />
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'auth'
})

useHead({
  title: 'Daftar - Kolaboria',
  meta: [
    {
      name: 'description',
      content: 'Buat akun Kolaboria baru untuk bergabung dengan komunitas.'
    }
  ]
})
</script>
