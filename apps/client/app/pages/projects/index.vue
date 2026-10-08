<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import type { ProjectItem } from '~/components/project/ProjectListItem.vue'

definePageMeta({
  layout: 'home',
  middleware: ['auth', 'onboarding-guard'],
  homeNavbar: {
    mainHorizontalPadding: 'none',
    mainWidth: 'wide'
  }
})

useHead({
  title: 'Jelajahi Proyek — Kolaboria'
})

// ============================================================
// DUMMY DATA (Aligned with design screenshot & full testability)
// ============================================================
const initialDummyProjects = ref<ProjectItem[]>([
  {
    id: '1',
    title: 'Platform Portofolio untuk Talenta Digital',
    slug: 'platform-portofolio-untuk-talenta-digital',
    description:
      'Membangun platform yang membantu talent menyusun dan membagikan pengalaman proyek secara lebih terstruktur.',
    acceptsContributors: true,
    context: 'Proyek pribadi',
    type: 'Aplikasi Web',
    author: {
      name: 'Syahrul Fahmi',
      initials: 'SF',
      status: 'Pemilik terverifikasi'
    },
    skills: ['Nuxt.js', 'Vue.js', 'TypeScript', 'UI/UX Design'],
    memberCount: '2 dari 4',
    commitmentHours: 10,
    deadline: 'Sampai 30 Nov 2026',
    categoryLabel: 'Portfolio & product exploration',
    isBookmarked: false
  },
  {
    id: '2',
    title: 'Aplikasi Pengelolaan Sampah Komunitas',
    slug: 'aplikasi-pengelolaan-sampah-komunitas',
    description:
      'Eksperimen aplikasi untuk membantu komunitas mencatat dan mengelola aktivitas pengumpulan sampah.',
    acceptsContributors: true,
    context: 'Komunitas',
    type: 'Aplikasi Mobile',
    author: {
      name: 'Budi Santoso',
      initials: 'BS',
      status: 'Pemilik terverifikasi'
    },
    skills: ['React Native', 'Node.js', 'PostgreSQL', 'Mobile App'],
    memberCount: '3 dari 5',
    commitmentHours: 8,
    deadline: 'Sampai 15 Des 2026',
    categoryLabel: 'Social impact & environment',
    isBookmarked: false
  },
  {
    id: '3',
    title: 'Design System & UI Kit untuk Startup Lokal',
    slug: 'design-system-ui-kit-startup-lokal',
    description:
      'Eksplorasi pembuatan komponen modular dan token desain yang konsisten untuk akselerasi pengembangan produk digital.',
    acceptsContributors: true,
    context: 'Eksperimen',
    type: 'UI/UX',
    author: {
      name: 'Nadia Salsabila',
      initials: 'NS',
      status: 'Pemilik terverifikasi'
    },
    skills: ['Figma', 'Design Systems', 'UI/UX', 'Tailwind CSS'],
    memberCount: '1 dari 3',
    commitmentHours: 6,
    deadline: 'Sampai 10 Jan 2027',
    categoryLabel: 'Design & creative tooling',
    isBookmarked: false
  },
  {
    id: '4',
    title: 'API Gateway Terdistribusi Berkecepatan Tinggi',
    slug: 'api-gateway-terdistribusi-berkecepatan-tinggi',
    description:
      'Pengembangan backend service berskala besar dengan arsitektur microservices dan caching terdistribusi.',
    acceptsContributors: true,
    context: 'Proyek client',
    type: 'Backend',
    author: {
      name: 'Rian Hidayat',
      initials: 'RH',
      status: 'Pemilik terverifikasi'
    },
    skills: ['Go', 'Docker', 'Redis', 'Microservices'],
    memberCount: '2 dari 3',
    commitmentHours: 12,
    deadline: 'Sampai 28 Feb 2027',
    categoryLabel: 'High-performance infrastructure',
    isBookmarked: false
  },
  {
    id: '5',
    title: 'Platform Edukasi Interaktif Coding untuk Pemula',
    slug: 'platform-edukasi-interaktif-coding',
    description:
      'Sistem pembelajaran pemrograman interaktif berbasis browser dengan playground kode real-time.',
    acceptsContributors: true,
    context: 'Komunitas',
    type: 'Aplikasi Web',
    author: {
      name: 'Ahmad Fauzi',
      initials: 'AF',
      status: 'Pemilik terverifikasi'
    },
    skills: ['Vue.js', 'Node.js', 'Monaco Editor', 'WebSocket'],
    memberCount: '3 dari 4',
    commitmentHours: 8,
    deadline: 'Sampai 20 Mar 2027',
    categoryLabel: 'EdTech & developer learning',
    isBookmarked: false
  },
  {
    id: '6',
    title: 'Aplikasi Pelacak Nutrisi dan Kebugaran Harian',
    slug: 'aplikasi-pelacak-nutrisi-kebugaran',
    description:
      'Aplikasi pelacak pola makan sehat dengan integrasi scanner barcode dan grafik analitik nutrisi mingguan.',
    acceptsContributors: true,
    context: 'Proyek pribadi',
    type: 'Aplikasi Mobile',
    author: {
      name: 'Dewi Lestari',
      initials: 'DL',
      status: 'Pemilik terverifikasi'
    },
    skills: ['Flutter', 'Dart', 'Firebase', 'Mobile App'],
    memberCount: '2 dari 4',
    commitmentHours: 10,
    deadline: 'Sampai 05 Apr 2027',
    categoryLabel: 'Health & wellness tech',
    isBookmarked: false
  },
  {
    id: '7',
    title: 'Revamp UX E-Commerce UMKM Indonesia',
    slug: 'revamp-ux-ecommerce-umkm',
    description:
      'Redesain alur checkout dan onboarding pengguna untuk meningkatkan konversi pembelian produk lokal.',
    acceptsContributors: true,
    context: 'Proyek client',
    type: 'UI/UX',
    author: {
      name: 'Maya Putri',
      initials: 'MP',
      status: 'Pemilik terverifikasi'
    },
    skills: ['UI/UX Design', 'User Research', 'Wireframing', 'Figma'],
    memberCount: '1 dari 2',
    commitmentHours: 5,
    deadline: 'Sampai 12 Mei 2027',
    categoryLabel: 'E-commerce & conversion',
    isBookmarked: false
  },
  {
    id: '8',
    title: 'Microservice Event Streamer dengan Apache Kafka',
    slug: 'microservice-event-streamer-kafka',
    description:
      'Implementasi pipeline streaming data real-time berkapasitas jutaan event per hari.',
    acceptsContributors: true,
    context: 'Eksperimen',
    type: 'Backend',
    author: {
      name: 'Kevin Kurniawan',
      initials: 'KK',
      status: 'Pemilik terverifikasi'
    },
    skills: ['Kafka', 'Go', 'Kubernetes', 'gRPC'],
    memberCount: '2 dari 4',
    commitmentHours: 14,
    deadline: 'Sampai 30 Jun 2027',
    categoryLabel: 'Distributed systems',
    isBookmarked: false
  },
  {
    id: '9',
    title: 'Sistem Rekomendasi Karir Berbasis AI',
    slug: 'sistem-rekomendasi-karir-berbasis-ai',
    description:
      'Platform berbasis machine learning untuk memetakan skill talenta dengan kebutuhan industri terkini.',
    acceptsContributors: true,
    context: 'Eksperimen',
    type: 'Aplikasi Web',
    author: {
      name: 'Aditya Rahman',
      initials: 'AR',
      status: 'Pemilik terverifikasi'
    },
    skills: ['Python', 'FastAPI', 'Vue.js', 'PyTorch'],
    memberCount: '3 dari 4',
    commitmentHours: 10,
    deadline: 'Sampai 15 Jul 2027',
    categoryLabel: 'Artificial Intelligence & career tech',
    isBookmarked: false
  },
  {
    id: '10',
    title: 'Aplikasi Tabungan Bersama & Finansial Keluarga',
    slug: 'aplikasi-tabungan-bersama-finansial-keluarga',
    description:
      'Aplikasi mobile untuk pencatatan anggaran rumah tangga dan tabungan target bersama dengan visualisasi grafik.',
    acceptsContributors: true,
    context: 'Proyek pribadi',
    type: 'Aplikasi Mobile',
    author: {
      name: 'Clarissa Angela',
      initials: 'CA',
      status: 'Pemilik terverifikasi'
    },
    skills: ['React Native', 'Tailwind', 'Supabase', 'Mobile UI'],
    memberCount: '2 dari 3',
    commitmentHours: 8,
    deadline: 'Sampai 20 Agu 2027',
    categoryLabel: 'Fintech & personal finance',
    isBookmarked: false
  },
  {
    id: '11',
    title: 'Redesain Layanan Kesehatan Mental Terpadu',
    slug: 'redesain-layanan-kesehatan-mental-terpadu',
    description:
      'Eksplorasi UI/UX empati tinggi untuk konsultasi konseling online dan jurnal emosi harian.',
    acceptsContributors: true,
    context: 'Komunitas',
    type: 'UI/UX',
    author: {
      name: 'Ratu Anindya',
      initials: 'RA',
      status: 'Pemilik terverifikasi'
    },
    skills: ['Figma', 'UX Research', 'Design Systems', 'Mental Health Tech'],
    memberCount: '2 dari 2',
    commitmentHours: 6,
    deadline: 'Sampai 05 Sep 2027',
    categoryLabel: 'Healthcare & community wellness',
    isBookmarked: false
  },
  {
    id: '12',
    title: 'Engine Analitik Data Log Terpusat Skala Besar',
    slug: 'engine-analitik-data-log-terpusat-skala-besar',
    description:
      'Pengembangan mesin agregasi log kinerja server dengan integrasi ClickHouse dan Grafana.',
    acceptsContributors: true,
    context: 'Proyek client',
    type: 'Backend',
    author: {
      name: 'Farhan Alamsyah',
      initials: 'FA',
      status: 'Pemilik terverifikasi'
    },
    skills: ['Rust', 'ClickHouse', 'Docker', 'Prometheus'],
    memberCount: '1 dari 3',
    commitmentHours: 12,
    deadline: 'Sampai 30 Sep 2027',
    categoryLabel: 'Data observability & DevOps',
    isBookmarked: false
  },
  {
    id: '13',
    title: 'Dashboard Pemantauan Kualitas Udara Realtime IoT',
    slug: 'dashboard-pemantauan-kualitas-udara-realtime-iot',
    description:
      'Sistem pemantauan indeks polusi udara berbasis web yang terhubung dengan sensor sensor IoT di berbagai titik kota.',
    acceptsContributors: true,
    context: 'Komunitas',
    type: 'Aplikasi Web',
    author: {
      name: 'Hendra Nugraha',
      initials: 'HN',
      status: 'Pemilik terverifikasi'
    },
    skills: ['Nuxt.js', 'MQTT', 'Chart.js', 'Tailwind CSS'],
    memberCount: '3 dari 5',
    commitmentHours: 8,
    deadline: 'Sampai 15 Okt 2027',
    categoryLabel: 'Smart city & environment',
    isBookmarked: false
  },
  {
    id: '14',
    title: 'Aplikasi Donor Darah Komunitas & Darurat Medis',
    slug: 'aplikasi-donor-darah-komunitas-darurat-medis',
    description:
      'Platform mobile penolong pencarian pendonor darah darurat berdasarkan radius geolokasi terdekat.',
    acceptsContributors: true,
    context: 'Komunitas',
    type: 'Aplikasi Mobile',
    author: {
      name: 'Siti Khadijah',
      initials: 'SK',
      status: 'Pemilik terverifikasi'
    },
    skills: ['Flutter', 'Google Maps API', 'Firebase', 'Mobile UI'],
    memberCount: '2 dari 4',
    commitmentHours: 7,
    deadline: 'Sampai 25 Okt 2027',
    categoryLabel: 'Social impact & healthcare',
    isBookmarked: false
  },
  {
    id: '15',
    title: 'Design Token & Multi-Brand Component Library',
    slug: 'design-token-multi-brand-component-library',
    description:
      'Standardisasi token desain untuk mendukung multi-theme dan dark mode fleksibel pada multi-platform.',
    acceptsContributors: true,
    context: 'Eksperimen',
    type: 'UI/UX',
    author: {
      name: 'Tommy Pratama',
      initials: 'TP',
      status: 'Pemilik terverifikasi'
    },
    skills: [
      'Design Tokens',
      'Figma Variables',
      'UI Architecture',
      'CSS Tokens'
    ],
    memberCount: '1 dari 3',
    commitmentHours: 6,
    deadline: 'Sampai 10 Nov 2027',
    categoryLabel: 'Design infrastructure',
    isBookmarked: false
  },
  {
    id: '16',
    title: 'High-Throughput Payment Orchestrator Service',
    slug: 'high-throughput-payment-orchestrator-service',
    description:
      'Layanan backend gateway pembayaran dengan mekanisme failover otomatis dan rekonsiliasi transaksi real-time.',
    acceptsContributors: true,
    context: 'Proyek client',
    type: 'Backend',
    author: {
      name: 'Muhammad Arya',
      initials: 'MA',
      status: 'Pemilik terverifikasi'
    },
    skills: ['Go', 'PostgreSQL', 'Redis', 'Kafka'],
    memberCount: '2 dari 3',
    commitmentHours: 14,
    deadline: 'Sampai 20 Nov 2027',
    categoryLabel: 'Fintech core engineering',
    isBookmarked: false
  },
  {
    id: '17',
    title: 'Platform Kolaborasi Riset Open Science Nusantara',
    slug: 'platform-kolaborasi-riset-open-science-nusantara',
    description:
      'Portal repositori dan telaah sejawat terbuka untuk riset akademik dan saintifik antar kampus Indonesia.',
    acceptsContributors: true,
    context: 'Komunitas',
    type: 'Aplikasi Web',
    author: {
      name: 'Gilang Permana',
      initials: 'GP',
      status: 'Pemilik terverifikasi'
    },
    skills: ['Vue.js', 'Node.js', 'LaTeX Support', 'GraphQL'],
    memberCount: '4 dari 5',
    commitmentHours: 9,
    deadline: 'Sampai 05 Des 2027',
    categoryLabel: 'Academic & research tech',
    isBookmarked: false
  },
  {
    id: '18',
    title: 'Aplikasi Belajar Bahasa Daerah Nusantara',
    slug: 'aplikasi-belajar-bahasa-daerah-nusantara',
    description:
      'Aplikasi gamifikasi interaktif untuk pelestarian bahasa daerah dengan modul audio dan latihan kosakata harian.',
    acceptsContributors: true,
    context: 'Proyek pribadi',
    type: 'Aplikasi Mobile',
    author: {
      name: 'Annisa Nurul',
      initials: 'AN',
      status: 'Pemilik terverifikasi'
    },
    skills: ['React Native', 'Audio Engine', 'Expo', 'Gamification'],
    memberCount: '2 dari 4',
    commitmentHours: 8,
    deadline: 'Sampai 18 Des 2027',
    categoryLabel: 'EdTech & cultural heritage',
    isBookmarked: false
  },
  {
    id: '19',
    title: 'Auditing & Redesain Aksesibilitas Web Publik',
    slug: 'auditing-redesain-aksesibilitas-web-publik',
    description:
      'Peningkatan standar WCAG 2.1 AA pada antarmuka layanan publik demi kemudahan pengguna difabel.',
    acceptsContributors: true,
    context: 'Komunitas',
    type: 'UI/UX',
    author: {
      name: 'Yoga Wibowo',
      initials: 'YW',
      status: 'Pemilik terverifikasi'
    },
    skills: ['Accessibility (a11y)', 'WCAG', 'Screen Reader Testing', 'Figma'],
    memberCount: '1 dari 2',
    commitmentHours: 5,
    deadline: 'Sampai 30 Des 2027',
    categoryLabel: 'Inclusive design',
    isBookmarked: false
  },
  {
    id: '20',
    title: 'Search & Indexing Engine dengan Vector Database',
    slug: 'search-indexing-engine-vector-database',
    description:
      'Mesin pencarian semantik teks dokumen skala jutaan baris menggunakan embedding model dan Qdrant.',
    acceptsContributors: true,
    context: 'Eksperimen',
    type: 'Backend',
    author: {
      name: 'Dimas Saputra',
      initials: 'DS',
      status: 'Pemilik terverifikasi'
    },
    skills: ['Python', 'Qdrant', 'gRPC', 'Docker'],
    memberCount: '2 dari 3',
    commitmentHours: 11,
    deadline: 'Sampai 15 Jan 2028',
    categoryLabel: 'Information retrieval & AI',
    isBookmarked: false
  },
  {
    id: '21',
    title: 'Platform Crowdfunding Kreator Seni Independen',
    slug: 'platform-crowdfunding-kreator-seni-independen',
    description:
      'Situs galeri dan dukungan dana publik bagi ilustrator, musisi, dan komikus lokal untuk merilis karya original.',
    acceptsContributors: true,
    context: 'Proyek pribadi',
    type: 'Aplikasi Web',
    author: {
      name: 'Bella Lestari',
      initials: 'BL',
      status: 'Pemilik terverifikasi'
    },
    skills: ['Nuxt.js', 'Stripe Integration', 'Tailwind CSS', 'PostgreSQL'],
    memberCount: '2 dari 4',
    commitmentHours: 9,
    deadline: 'Sampai 28 Jan 2028',
    categoryLabel: 'Creative economy & crowdfunding',
    isBookmarked: false
  },
  {
    id: '22',
    title: 'Aplikasi Peringatan Dini Bencana Alam',
    slug: 'aplikasi-peringatan-dini-bencana-alam',
    description:
      'Aplikasi notifikasi push darurat gempa, banjir, dan cuaca ekstrem berbasis integrasi data BMKG realtime.',
    acceptsContributors: true,
    context: 'Komunitas',
    type: 'Aplikasi Mobile',
    author: {
      name: 'Ilham Ramadhan',
      initials: 'IR',
      status: 'Pemilik terverifikasi'
    },
    skills: ['Flutter', 'FCM', 'Geolocation', 'Rest API'],
    memberCount: '3 dari 4',
    commitmentHours: 8,
    deadline: 'Sampai 10 Feb 2028',
    categoryLabel: 'Disaster management tech',
    isBookmarked: false
  },
  {
    id: '23',
    title: 'Eksplorasi Konsep Minimalist Interface FinTech',
    slug: 'eksplorasi-konsep-minimalist-interface-fintech',
    description:
      'Studi desain micro-interactions dan clean typography untuk pengalaman investasi saham dan reksadana.',
    acceptsContributors: true,
    context: 'Eksperimen',
    type: 'UI/UX',
    author: {
      name: 'Vanessa Novita',
      initials: 'VN',
      status: 'Pemilik terverifikasi'
    },
    skills: ['Figma', 'Prototyping', 'Micro-interactions', 'UI Design'],
    memberCount: '1 dari 2',
    commitmentHours: 6,
    deadline: 'Sampai 25 Feb 2028',
    categoryLabel: 'Product discovery & FinTech UI',
    isBookmarked: false
  },
  {
    id: '24',
    title: 'Auth & Identity Provider Service Terdesentralisasi',
    slug: 'auth-identity-provider-service-terdesentralisasi',
    description:
      'Layanan single sign-on (SSO) berskala enterprise dengan enkripsi zero-knowledge dan protokol OAuth2/OIDC.',
    acceptsContributors: true,
    context: 'Proyek client',
    type: 'Backend',
    author: {
      name: 'Evan Raditya',
      initials: 'ER',
      status: 'Pemilik terverifikasi'
    },
    skills: ['Go', 'OAuth2', 'JWT', 'Redis'],
    memberCount: '2 dari 3',
    commitmentHours: 12,
    deadline: 'Sampai 10 Mar 2028',
    categoryLabel: 'Cybersecurity & IAM',
    isBookmarked: false
  }
])

// ============================================================
// REACTIVE FILTER STATES
// ============================================================
const searchInput = ref('')
const activeSearch = ref('')

const projectTypes = ['Aplikasi Web', 'Aplikasi Mobile', 'UI/UX', 'Backend']
const selectedTypes = ref<string[]>([])

const projectContexts = [
  'Proyek pribadi',
  'Komunitas',
  'Eksperimen',
  'Proyek client'
]
const selectedContexts = ref<string[]>([])

const acceptsContributorsOnly = ref(false)

const sortBy = ref<string>('newest')

const sortOptions = [
  { label: 'Terbaru', value: 'newest' },
  { label: 'Terlama', value: 'oldest' },
  { label: 'Paling Populer', value: 'popular' }
]

const currentPage = ref(1)
const itemsPerPage = 12

// Checkbox "Semua proyek" is active when no specific types are chosen
const isAllTypesSelected = computed(() => selectedTypes.value.length === 0)

const toggleAllTypes = (checked: boolean) => {
  if (checked) {
    selectedTypes.value = []
  }
}

const toggleType = (type: string) => {
  const idx = selectedTypes.value.indexOf(type)
  if (idx > -1) {
    selectedTypes.value.splice(idx, 1)
  } else {
    selectedTypes.value.push(type)
  }
}

const toggleContext = (ctx: string) => {
  const idx = selectedContexts.value.indexOf(ctx)
  if (idx > -1) {
    selectedContexts.value.splice(idx, 1)
  } else {
    selectedContexts.value.push(ctx)
  }
}

const isAllContextsSelected = computed(() => selectedContexts.value.length === 0)

const toggleAllContexts = (checked: boolean) => {
  if (checked) {
    selectedContexts.value = []
  }
}

const handleSearchSubmit = () => {
  activeSearch.value = searchInput.value.trim()
  currentPage.value = 1
  mobileDisplayCount.value = itemsPerPage
}

const resetFilters = () => {
  searchInput.value = ''
  activeSearch.value = ''
  selectedTypes.value = []
  selectedContexts.value = []
  acceptsContributorsOnly.value = false
  sortBy.value = 'newest'
  currentPage.value = 1
  mobileDisplayCount.value = itemsPerPage
}

// Mobile Bottom Sheet states
const isMobileFilterOpen = ref(false)
const isMobileSortOpen = ref(false)
const isMobileTypeFilterOpen = ref(false)
const isMobileContextFilterOpen = ref(false)
const isMobileAvailabilityFilterOpen = ref(false)

const activeFilterCount = computed(() => {
  let count = selectedTypes.value.length + selectedContexts.value.length
  if (acceptsContributorsOnly.value) count += 1
  return count
})

const handleBookmark = (id: string, isBookmarked: boolean) => {
  const item = initialDummyProjects.value.find((p) => p.id === id)
  if (item) {
    item.isBookmarked = isBookmarked
  }
}

// Reset page and mobile count whenever any filter changes
watch(
  [selectedTypes, selectedContexts, acceptsContributorsOnly, sortBy],
  () => {
    currentPage.value = 1
    mobileDisplayCount.value = itemsPerPage
  },
  { deep: true }
)

// ============================================================
// FILTERING & PAGINATION COMPUTED
// ============================================================
const filteredProjects = computed(() => {
  const result = initialDummyProjects.value.filter((project) => {
    // 1. Search Query Filter
    if (activeSearch.value) {
      const q = activeSearch.value.toLowerCase()
      const matchTitle = project.title.toLowerCase().includes(q)
      const matchDesc = (project.description || '').toLowerCase().includes(q)
      const matchSkill = project.skills.some((s) => s.toLowerCase().includes(q))
      const matchCategory = (project.categoryLabel || '')
        .toLowerCase()
        .includes(q)
      if (!matchTitle && !matchDesc && !matchSkill && !matchCategory) {
        return false
      }
    }

    // 2. Project Type Filter
    if (selectedTypes.value.length > 0) {
      if (!project.type || !selectedTypes.value.includes(project.type)) {
        return false
      }
    }

    // 3. Project Context Filter
    if (selectedContexts.value.length > 0) {
      if (
        !project.context ||
        !selectedContexts.value.includes(project.context)
      ) {
        return false
      }
    }

    // 4. Availability Filter
    if (acceptsContributorsOnly.value && !project.acceptsContributors) {
      return false
    }

    return true
  })

  // Apply sorting
  return result.slice().sort((a, b) => {
    if (sortBy.value === 'newest') {
      return Number(a.id) - Number(b.id)
    } else if (sortBy.value === 'oldest') {
      return Number(b.id) - Number(a.id)
    } else if (sortBy.value === 'popular') {
      return Number(b.commitmentHours || 0) - Number(a.commitmentHours || 0)
    }
    return 0
  })
})

const totalPages = computed(() => {
  return Math.ceil(filteredProjects.value.length / itemsPerPage) || 1
})

// Responsive viewport detection (desktop >= 1024px)
const isDesktop = ref(false)

onMounted(() => {
  if (typeof window !== 'undefined') {
    const mq = window.matchMedia('(min-width: 1024px)')
    isDesktop.value = mq.matches
    mq.addEventListener('change', (e) => {
      isDesktop.value = e.matches
    })
  }
})

// Mobile Endless Scrolling state
const mobileDisplayCount = ref(itemsPerPage)

const hasMoreMobile = computed(() => {
  return mobileDisplayCount.value < filteredProjects.value.length
})

const loadMoreMobile = async () => {
  // Simulate network loading latency for visible user feedback
  await new Promise((resolve) => setTimeout(resolve, 600))
  mobileDisplayCount.value += itemsPerPage
}

const { sentinelRef, isLoading: isEndlessLoading } = useInfiniteScroll({
  onLoadMore: loadMoreMobile,
  hasMore: hasMoreMobile,
  disabled: isDesktop,
  distance: '200px'
})

const startItem = computed(() => {
  if (filteredProjects.value.length === 0) return 0
  return isDesktop.value ? (currentPage.value - 1) * itemsPerPage + 1 : 1
})

const endItem = computed(() => {
  if (filteredProjects.value.length === 0) return 0
  if (isDesktop.value) {
    return Math.min(
      currentPage.value * itemsPerPage,
      filteredProjects.value.length
    )
  }
  return Math.min(mobileDisplayCount.value, filteredProjects.value.length)
})

// Displayed projects: paginated for desktop, continuous list for mobile endless scroll
const paginatedProjects = computed(() => {
  if (isDesktop.value) {
    const start = (currentPage.value - 1) * itemsPerPage
    return filteredProjects.value.slice(start, start + itemsPerPage)
  }
  return filteredProjects.value.slice(0, mobileDisplayCount.value)
})
</script>

<template>
  <div class="mx-auto w-full">
    <!-- ===================================================== -->
    <!-- HERO SECTION (Typography & Search matching reference) -->
    <!-- ===================================================== -->
    <header
      class="relative w-full overflow-hidden lg:rounded-lg border border-neutral-200 p-6 sm:p-8 lg:p-10 mb-8 sm:mb-10 bg-white"
    >
      <div class="relative z-10 w-full">
        <!-- Tag / Category Header -->
        <p
          class="font-label-3 font-bold uppercase tracking-wider text-primary-600 mb-2.5"
        >
          PROJECT HUB
        </p>

        <!-- Main Headline -->
        <h1
          class="font-title-1 text-3xl sm:text-4xl lg:text-[40px] font-bold tracking-tight text-neutral-900 leading-[1.2]"
        >
          Temukan ruang untuk berkarya dan<br class="hidden sm:inline" />
          bertumbuh bersama.
        </h1>

        <!-- Subtitle Description -->
        <p
          class="mt-3.5 font-body-1 text-sm sm:text-base text-neutral-600 max-w-2xl leading-relaxed"
        >
          Jelajahi proyek nyata, temukan peran yang sesuai dengan kemampuanmu,
          dan bangun pengalaman melalui kontribusi yang bermakna.
        </p>

        <!-- Search Bar Row (Expands across full width) -->
        <div
          class="mt-8 flex w-full flex-col sm:flex-row items-stretch sm:items-center gap-3"
        >
          <div class="relative flex-1">
            <!-- Search Icon -->
            <div
              class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-4.5 w-4.5"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>

            <!-- Input Field -->
            <input
              v-model="searchInput"
              type="text"
              placeholder="Cari proyek, skill, atau teknologi..."
              class="w-full rounded-xl border border-neutral-200 bg-white py-3.5 pl-11 pr-10 font-body-2 text-neutral-800 placeholder:text-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              @keydown.enter="handleSearchSubmit"
            />

            <!-- Clear Button -->
            <button
              v-if="searchInput"
              type="button"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600 focus:outline-none"
              aria-label="Bersihkan pencarian"
              @click="
                () => {
                  searchInput = ''
                  handleSearchSubmit()
                }
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <!-- Search Action Button -->
          <AtomicButton
            variant="primary"
            class="!rounded-xl !px-6 !py-3.5 !bg-primary-600 hover:!bg-primary-700 !text-white font-label-2 font-semibold shrink-0 cursor-pointer"
            @click="handleSearchSubmit"
          >
            Cari Proyek
          </AtomicButton>
        </div>
      </div>
    </header>

    <!-- ===================================================== -->
    <!-- CONTENT LAYOUT: SIDEBAR FILTER + PROJECT LIST -->
    <!-- ===================================================== -->
    <!-- ===================================================== -->
    <!-- CONTENT LAYOUT: SIDEBAR FILTER + PROJECT LIST -->
    <!-- ===================================================== -->
    <div class="flex flex-col lg:flex-row items-start gap-8 lg:gap-8">
      <!-- ── Desktop Sticky Sidebar Filter (≥ lg) ── -->
      <aside
        class="hidden lg:block w-64 shrink-0 lg:sticky lg:top-20 self-start bg-white rounded-lg border border-neutral-200 p-5 space-y-6 max-h-[calc(100vh-6rem)] overflow-y-auto"
      >
        <!-- Filter Header & Reset -->
        <div
          class="flex items-center justify-between pb-3 border-b border-neutral-100"
        >
          <div class="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-4 w-4 text-neutral-600"
              aria-hidden="true"
            >
              <line x1="21" x2="14" y1="4" y2="4" />
              <line x1="10" x2="3" y1="4" y2="4" />
              <line x1="21" x2="12" y1="12" y2="12" />
              <line x1="8" x2="3" y1="12" y2="12" />
              <line x1="21" x2="16" y1="20" y2="20" />
              <line x1="12" x2="3" y1="20" y2="20" />
              <line x1="14" x2="14" y1="2" y2="6" />
              <line x1="8" x2="8" y1="10" y2="14" />
              <line x1="16" x2="16" y1="18" y2="22" />
            </svg>
            <span class="font-label-1 font-bold text-neutral-900">Filter</span>
            <span
              v-if="activeFilterCount > 0"
              class="rounded-full bg-primary-100 px-2 py-0.5 text-[11px] font-semibold text-primary-700"
            >
              {{ activeFilterCount }}
            </span>
          </div>

          <button
            v-if="activeFilterCount > 0"
            type="button"
            @click="resetFilters"
            class="text-xs font-medium text-neutral-500 hover:text-primary-600 transition-colors"
          >
            Reset
          </button>
        </div>

        <!-- 1. Jenis Proyek -->
        <div>
          <h3 class="font-label-2 font-bold text-neutral-900 mb-3">
            Jenis proyek
          </h3>
          <div class="flex flex-col gap-2.5">
            <AtomicCheckbox
              label="Semua proyek"
              :model-value="isAllTypesSelected"
              @update:model-value="toggleAllTypes"
            />
            <AtomicCheckbox
              v-for="item in projectTypes"
              :key="item"
              :label="item"
              :model-value="selectedTypes.includes(item)"
              @update:model-value="() => toggleType(item)"
            />
          </div>
        </div>

        <!-- Divider -->
        <div class="border-b border-neutral-100"></div>

        <!-- 2. Konteks Proyek -->
        <div>
          <h3 class="font-label-2 font-bold text-neutral-900 mb-3">
            Konteks proyek
          </h3>
          <div class="flex flex-col gap-2.5">
            <AtomicCheckbox
              v-for="item in projectContexts"
              :key="item"
              :label="item"
              :model-value="selectedContexts.includes(item)"
              @update:model-value="() => toggleContext(item)"
            />
          </div>
        </div>

        <!-- Divider -->
        <div class="border-b border-neutral-100"></div>

        <!-- 3. Ketersediaan -->
        <div>
          <h3 class="font-label-2 font-bold text-neutral-900 mb-3">
            Ketersediaan
          </h3>
          <div class="flex flex-col gap-2.5">
            <AtomicCheckbox
              label="Masih menerima kontributor"
              v-model="acceptsContributorsOnly"
            />
          </div>
        </div>
      </aside>

      <!-- ── Right Main Area ── -->
      <section class="flex-1 min-w-0 w-full px-4 lg:px-0 mb-4">
        <!-- Desktop Header Row (≥ lg) - Matches Desktop Design System Reference -->
        <div class="hidden lg:flex items-center justify-between gap-4 mb-5">
          <div>
            <p class="font-body-2 text-secondary mt-1">
              Menampilkan <strong>{{ filteredProjects.length }}</strong> proyek
              tersedia
            </p>
          </div>

          <div class="w-48 shrink-0">
            <MoleculeDropdown v-model="sortBy" :options="sortOptions" />
          </div>
        </div>

        <!-- Mobile Header & Quick Controls (< lg) -->
        <div class="block lg:hidden mb-6">
          <div class="mb-4">
            <h2
              class="font-title-2 text-xl font-bold tracking-tight text-neutral-900 leading-tight"
            >
              Proyek yang bisa kamu jelajahi
            </h2>
          </div>

          <!-- ===================================================== -->
          <!-- FILTER & SORTING AREA (Matches User's Reference)      -->
          <!-- ===================================================== -->
          <div class="relative">
            <!-- Text: Menampilkan data X - Y dari total Z pencarian -->
            <p class="font-body-2 text-sm text-neutral-600 mb-3">
              Menampilkan data {{ startItem }} - {{ endItem }} dari total
              {{ filteredProjects.length }} pencarian
            </p>

            <!-- Horizontal Filter & Sorting Controls Row -->
            <div
              class="flex items-center gap-2 overflow-x-auto pt-2 pb-2 select-none -mx-1 px-1 scrollbar-none"
            >
              <!-- 1. Circular Filter Button ([ ⏚ ]) -->
              <button
                type="button"
                @click="isMobileFilterOpen = true"
                class="relative flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-neutral-50 active:bg-neutral-100 shrink-0 cursor-pointer"
                aria-label="Buka semua filter"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="h-4.5 w-4.5 text-neutral-700"
                >
                  <polygon
                    points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"
                  />
                </svg>
                <span
                  v-if="activeFilterCount > 0"
                  class="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 px-1 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white ring-2 ring-white leading-none shadow-xs"
                >
                  {{ activeFilterCount }}
                </span>
              </button>

              <!-- 2. Circular Sort Button ([ ⇅ ]) -->
              <button
                type="button"
                @click="isMobileSortOpen = true"
                class="relative flex h-10 w-10 items-center justify-center rounded-full border transition-colors shrink-0 cursor-pointer"
                :class="[
                  sortBy !== 'newest'
                    ? 'border-primary-500 bg-primary-50 text-primary-600 ring-1 ring-primary-200'
                    : 'border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50 active:bg-neutral-100'
                ]"
                aria-label="Urutkan pencarian"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="h-4.5 w-4.5"
                >
                  <path d="m3 16 4 4 4-4" />
                  <path d="M7 20V4" />
                  <path d="m21 8-4-4-4 4" />
                  <path d="M17 4v16" />
                </svg>
              </button>

              <!-- 3. Pill Filter Chip: Jenis Proyek -->
              <button
                type="button"
                @click="isMobileTypeFilterOpen = true"
                class="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
                :class="[
                  selectedTypes.length > 0
                    ? 'border-primary-500 bg-primary-50 text-primary-700 font-semibold'
                    : 'border-neutral-300 bg-white text-neutral-800 hover:border-neutral-400 hover:bg-neutral-50'
                ]"
              >
                <span>
                  {{
                    selectedTypes.length === 0
                      ? 'Jenis Proyek'
                      : selectedTypes.length === 1
                        ? selectedTypes[0]
                        : `${selectedTypes.length} Jenis`
                  }}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="h-3.5 w-3.5 text-neutral-500"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              <!-- 4. Pill Filter Chip: Konteks -->
              <button
                type="button"
                @click="isMobileContextFilterOpen = true"
                class="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
                :class="[
                  selectedContexts.length > 0
                    ? 'border-primary-500 bg-primary-50 text-primary-700 font-semibold'
                    : 'border-neutral-300 bg-white text-neutral-800 hover:border-neutral-400 hover:bg-neutral-50'
                ]"
              >
                <span>
                  {{
                    selectedContexts.length === 0
                      ? 'Konteks'
                      : selectedContexts.length === 1
                        ? selectedContexts[0]
                        : `${selectedContexts.length} Konteks`
                  }}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="h-3.5 w-3.5 text-neutral-500"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              <!-- 5. Pill Filter Chip: Ketersediaan -->
              <button
                type="button"
                @click="isMobileAvailabilityFilterOpen = true"
                class="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
                :class="[
                  acceptsContributorsOnly
                    ? 'border-primary-500 bg-primary-50 text-primary-700 font-semibold'
                    : 'border-neutral-300 bg-white text-neutral-800 hover:border-neutral-400 hover:bg-neutral-50'
                ]"
              >
                <span>
                  {{
                    acceptsContributorsOnly
                      ? 'Menerima Kontributor'
                      : 'Ketersediaan'
                  }}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="h-3.5 w-3.5 text-neutral-500"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Project Cards List -->
        <div v-if="paginatedProjects.length > 0" class="flex flex-col gap-4">
          <ProjectListItem
            v-for="project in paginatedProjects"
            :key="project.id"
            :project="project"
            @bookmark="handleBookmark"
          />
        </div>

        <!-- Mobile Endless Scroll: Loading State & Sentinel (< lg) -->
        <div
          v-if="!isDesktop && filteredProjects.length > 0"
          class="w-full flex flex-col items-center"
        >
          <!-- Loading State Animation -->
          <div
            v-if="isEndlessLoading"
            class="py-8 flex flex-col items-center justify-center gap-2.5 transition-all duration-300"
            role="status"
            aria-live="polite"
          >
            <div class="flex items-center gap-2" aria-hidden="true">
              <div
                class="h-2.5 w-2.5 animate-bounce rounded-full bg-primary-400 shadow-xs"
                style="animation-delay: -0.3s"
              ></div>
              <div
                class="h-2.5 w-2.5 animate-bounce rounded-full bg-primary-500 shadow-xs"
                style="animation-delay: -0.15s"
              ></div>
              <div
                class="h-2.5 w-2.5 animate-bounce rounded-full bg-primary-600 shadow-xs"
              ></div>
            </div>
            <span
              class="font-body-2 text-xs font-medium text-neutral-500 animate-pulse"
            >
              Memuat lebih banyak proyek...
            </span>
          </div>

          <!-- Invisible Sentinel Element observed by IntersectionObserver -->
          <div
            v-if="hasMoreMobile"
            ref="sentinelRef"
            class="h-8 w-full pointer-events-none"
            aria-hidden="true"
          />
        </div>

        <!-- Empty State (Only appears when data is empty) -->
        <div
          v-if="filteredProjects.length === 0"
          class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white py-16 px-6 text-center"
        >
          <div
            class="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 mb-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-6 w-6"
              aria-hidden="true"
            >
              <path d="m13.5 8.5-5 5" />
              <path d="m8.5 8.5 5 5" />
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <h3 class="font-title-3 font-bold text-neutral-900 mb-1">
            Tidak ada proyek yang sesuai
          </h3>
          <p class="font-body-2 text-neutral-500 max-w-sm mb-6">
            Coba sesuaikan kata kunci pencarian atau ubah pilihan filter di
            sebelah kiri.
          </p>
          <AtomicButton
            variant="outline"
            size="sm"
            class="!rounded-lg"
            @click="resetFilters"
          >
            Reset Semua Filter
          </AtomicButton>
        </div>

        <!-- Pagination (Desktop Only: Hidden on Mobile) -->
        <div class="hidden lg:block border-t border-neutral-100 mt-5">
          <MoleculePagination
            v-if="filteredProjects.length > 0"
            v-model="currentPage"
            :total-pages="totalPages"
            :align="`end`"
            :total-items="filteredProjects.length"
            :per-page="itemsPerPage"
          />
        </div>
      </section>

      <!-- ── Mobile Sorting Bottom Sheet (< lg) ── -->
      <OrganismBottomSheet
        v-model="isMobileSortOpen"
        title="Urutkan Proyek"
        subtitle="Pilih urutan tampilan daftar proyek"
        primary-label="Terapkan"
        secondary-label="Reset"
        @primary="isMobileSortOpen = false"
        @secondary="sortBy = 'newest'"
      >
        <div class="flex flex-col gap-4 py-2">
          <AtomicRadio
            v-for="opt in sortOptions"
            :key="opt.value"
            :value="opt.value"
            :label="opt.label"
            name="mobile-sort-option"
            v-model="sortBy"
          />
        </div>
      </OrganismBottomSheet>

      <!-- ── Mobile All Filters Bottom Sheet (< lg) ── -->
      <OrganismBottomSheet
        v-model="isMobileFilterOpen"
        title="Filter Proyek"
        subtitle="Sesuaikan kriteria pencarian proyek"
        primary-label="Terapkan"
        secondary-label="Reset Semua"
        @primary="isMobileFilterOpen = false"
        @secondary="resetFilters"
      >
        <div class="space-y-6 py-2">
          <!-- 1. Jenis Proyek -->
          <div>
            <h3 class="font-label-1 font-bold text-neutral-900 mb-3">
              Jenis proyek
            </h3>
            <div class="flex flex-col gap-3">
              <AtomicCheckbox
                label="Semua proyek"
                :model-value="isAllTypesSelected"
                @update:model-value="toggleAllTypes"
              />
              <AtomicCheckbox
                v-for="item in projectTypes"
                :key="item"
                :label="item"
                :model-value="selectedTypes.includes(item)"
                @update:model-value="() => toggleType(item)"
              />
            </div>
          </div>

          <!-- Divider -->
          <div class="border-b border-neutral-100"></div>

          <!-- 2. Konteks Proyek -->
          <div>
            <h3 class="font-label-1 font-bold text-neutral-900 mb-3">
              Konteks proyek
            </h3>
            <div class="flex flex-col gap-3">
              <AtomicCheckbox
                label="Semua konteks"
                :model-value="isAllContextsSelected"
                @update:model-value="toggleAllContexts"
              />
              <AtomicCheckbox
                v-for="item in projectContexts"
                :key="item"
                :label="item"
                :model-value="selectedContexts.includes(item)"
                @update:model-value="() => toggleContext(item)"
              />
            </div>
          </div>

          <!-- Divider -->
          <div class="border-b border-neutral-100"></div>

          <!-- 3. Ketersediaan -->
          <div>
            <h3 class="font-label-1 font-bold text-neutral-900 mb-3">
              Ketersediaan
            </h3>
            <div class="flex flex-col gap-3">
              <AtomicCheckbox
                label="Masih menerima kontributor"
                v-model="acceptsContributorsOnly"
              />
            </div>
          </div>
        </div>
      </OrganismBottomSheet>

      <!-- ── Mobile Jenis Proyek Bottom Sheet (< lg) ── -->
      <OrganismBottomSheet
        v-model="isMobileTypeFilterOpen"
        title="Jenis Proyek"
        subtitle="Pilih kategori jenis proyek"
        primary-label="Terapkan"
        secondary-label="Reset"
        @primary="isMobileTypeFilterOpen = false"
        @secondary="toggleAllTypes(true)"
      >
        <div class="flex flex-col gap-3.5 py-2">
          <AtomicCheckbox
            label="Semua proyek"
            :model-value="isAllTypesSelected"
            @update:model-value="toggleAllTypes"
          />
          <AtomicCheckbox
            v-for="item in projectTypes"
            :key="item"
            :label="item"
            :model-value="selectedTypes.includes(item)"
            @update:model-value="() => toggleType(item)"
          />
        </div>
      </OrganismBottomSheet>

      <!-- ── Mobile Konteks Proyek Bottom Sheet (< lg) ── -->
      <OrganismBottomSheet
        v-model="isMobileContextFilterOpen"
        title="Konteks Proyek"
        subtitle="Pilih latar belakang atau konteks proyek"
        primary-label="Terapkan"
        secondary-label="Reset"
        @primary="isMobileContextFilterOpen = false"
        @secondary="toggleAllContexts(true)"
      >
        <div class="flex flex-col gap-3.5 py-2">
          <AtomicCheckbox
            label="Semua konteks"
            :model-value="isAllContextsSelected"
            @update:model-value="toggleAllContexts"
          />
          <AtomicCheckbox
            v-for="item in projectContexts"
            :key="item"
            :label="item"
            :model-value="selectedContexts.includes(item)"
            @update:model-value="() => toggleContext(item)"
          />
        </div>
      </OrganismBottomSheet>

      <!-- ── Mobile Ketersediaan Bottom Sheet (< lg) ── -->
      <OrganismBottomSheet
        v-model="isMobileAvailabilityFilterOpen"
        title="Ketersediaan Proyek"
        subtitle="Pilih kriteria penerimaan kontributor"
        primary-label="Terapkan"
        secondary-label="Reset"
        @primary="isMobileAvailabilityFilterOpen = false"
        @secondary="acceptsContributorsOnly = false"
      >
        <div class="flex flex-col gap-3.5 py-2">
          <AtomicCheckbox
            label="Masih menerima kontributor"
            v-model="acceptsContributorsOnly"
          />
        </div>
      </OrganismBottomSheet>
    </div>
  </div>
</template>
