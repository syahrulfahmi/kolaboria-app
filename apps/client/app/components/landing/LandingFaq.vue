<template>
  <section id="faq" class="py-24 bg-white">
    <div class="k-container max-w-3xl mx-auto">
      <div class="text-center mb-14">
        <p
          :ref="(el) => revealItems(el, 0)"
          class="reveal k-eyebrow text-primary-500"
        >
          FAQ
        </p>
        <h2
          :ref="(el) => revealItems(el, 1)"
          class="reveal k-section-title text-secondary-500 mt-3"
          style="--delay: 100ms"
        >
          Pertanyaan Umum
        </h2>
      </div>

      <div
        :ref="(el) => revealItems(el, 2)"
        class="reveal"
        style="--delay: 200ms"
      >
        <MoleculeAccordion :items="accordionItems" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useScrollReveal } from '~/composables/useScrollReveal'

const { revealItems } = useScrollReveal()

const accordionItems = [
  {
    title: 'Apakah Kolaboria gratis untuk digunakan?',
    content:
      'Ya! Mendaftar dan berpartisipasi dalam proyek sepenuhnya gratis untuk kontributor dan talenta. Inisiator proyek juga bisa memposting proyek secara gratis dengan fitur dasar.'
  },
  {
    title: 'Apa bedanya Kolaboria dengan platform freelance biasa?',
    content:
      'Kolaboria bukan marketplace transaksional. Kami membangun ruang kolaborasi jangka panjang di mana kontributor ikut membangun produk bersama — bukan sekadar mengerjakan task dan menerima bayaran.'
  },
  {
    title: 'Bagaimana cara memulai sebagai inisiator proyek?',
    content:
      'Daftar, lengkapi profil, lalu klik "Post Proyek". Kamu akan dipandu mengisi detail proyek, kebutuhan tim, dan role yang dibutuhkan. Setelah disetujui, profil kandidat yang relevan langsung muncul.'
  },
  {
    title: 'Apakah ada jaminan kualitas dari kontributor?',
    content:
      'Setiap profil kontributor dilengkapi dengan riwayat proyek yang sudah dikerjakan di Kolaboria, skill yang terverifikasi, dan review dari inisiator sebelumnya. Kamu juga bisa request rekomendasi mentor.'
  },
  {
    title: 'Bisakah saya bergabung ke proyek yang sedang berjalan?',
    content:
      'Tergantung ketersediaan slot. Setiap proyek menampilkan jumlah slot yang masih tersedia. Kamu bisa melamar dan inisiator akan meninjau profilmu sebelum menyetujui.'
  }
]
</script>
