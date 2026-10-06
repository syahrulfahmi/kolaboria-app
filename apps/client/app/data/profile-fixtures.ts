import type { ProfilePageData } from '../types/profile-page'

const sampleProfile = {
  profile: {
    username: 'alya-pratama',
    fullName: 'Camelia Regista',
    avatar: null,
    headline: 'Product Designer · Riset pengguna & desain layanan',
    location: 'Yogyakarta',
    bio: 'Saya senang mengubah masalah yang rumit menjadi pengalaman digital yang jelas dan ramah. Saat ini saya terbuka untuk berkolaborasi dalam produk edukasi dan dampak sosial.',
    externalLinks: { portfolio: 'https://portfolio.example.com/alya' },
    isVerified: true
  },
  talent: {
    experienceLevel: 'mid',
    collaborationGoal:
      'Mencari proyek berdampak sosial yang membutuhkan pendamping riset dan desain dari tahap awal.'
  },
  completedProjects: 4,
  skills: [
    { id: 'skill-product-design', name: 'Product Design', isPrimary: true },
    { id: 'skill-user-research', name: 'Riset Pengguna', isPrimary: false },
    { id: 'skill-prototyping', name: 'Prototyping', isPrimary: false },
    { id: 'skill-service-design', name: 'Desain Layanan', isPrimary: false }
  ],
  tools: [
    { id: 'tool-figma', name: 'Figma' },
    { id: 'tool-notion', name: 'Notion' },
    { id: 'tool-maze', name: 'Maze' }
  ],
  projects: [
    {
      id: 'project-bank-sampah',
      title: 'Aplikasi Bank Sampah Warga',
      slug: 'aplikasi-bank-sampah-warga',
      description:
        'Merancang alur setoran digital yang mudah digunakan pengurus dan warga.',
      category: 'Lingkungan'
    },
    {
      id: 'project-katalog-umkm',
      title: 'Katalog UMKM Kotagede',
      slug: 'katalog-umkm-kotagede',
      description:
        'Membantu pelaku usaha lokal menampilkan produk dan menjangkau pelanggan.',
      category: 'Ekonomi lokal'
    }
  ],
  experiences: [
    {
      id: 'experience-bank-sampah',
      slug: 'aplikasi-bank-sampah-warga',
      username: 'alya-pratama',
      project_title: 'Aplikasi Bank Sampah Warga',
      project_summary:
        'Memimpin riset lapangan dan merancang alur setoran yang bisa dipakai pengurus lansia.',
      contribution_role: 'Product Designer',
      record_status_label: 'Final',
      integrity_status: 'valid',
      visibility: 'public',
      visibility_label: 'Publik',
      metrics: {
        completed_tasks: 34,
        discussions: 12,
        deliverables: 5,
        team_size: 5
      }
    },
    {
      id: 'experience-katalog-umkm',
      slug: 'katalog-umkm-kotagede',
      username: 'alya-pratama',
      project_title: 'Katalog UMKM Kotagede',
      project_summary:
        'Menyusun katalog digital bersama pelaku UMKM dan komunitas lokal.',
      contribution_role: 'UX Researcher',
      record_status_label: 'Final',
      integrity_status: 'valid',
      visibility: 'public',
      visibility_label: 'Publik',
      metrics: {
        completed_tasks: 21,
        discussions: 9,
        deliverables: 3,
        team_size: 4
      }
    }
  ],
  careerJourneys: [
    {
      id: 'career-product-designer',
      title: 'Product Designer',
      company: 'RuangBelajar',
      startYear: '2025',
      startMonth: null,
      endYear: null,
      endMonth: null,
      description:
        'Merancang alur produk, melakukan riset pengguna, dan bekerja bersama tim engineering.'
    },
    {
      id: 'career-ui-ux-designer',
      title: 'UI/UX Designer',
      company: 'Studio Reka',
      startYear: '2023',
      startMonth: null,
      endYear: '2025',
      endMonth: null,
      description:
        'Membantu tim rintisan memvalidasi ide dan membangun prototipe produk digital.'
    }
  ],
  portfolio: [
    {
      id: 'portfolio-bank-sampah',
      title: 'Bank Sampah Warga',
      role: 'Product Design',
      year: '2026',
      summary:
        'Alur setoran digital yang sederhana untuk membantu warga mengelola sampah.',
      url: 'https://portfolio.example.com/alya/bank-sampah',
      thumbnailUrl: null
    },
    {
      id: 'portfolio-umkm-kotagede',
      title: 'Katalog UMKM Kotagede',
      role: 'UX Research',
      year: '2025',
      summary:
        'Riset dan prototipe katalog produk untuk usaha lokal di Kotagede.',
      url: 'https://portfolio.example.com/alya/umkm-kotagede',
      thumbnailUrl: null
    }
  ]
} satisfies ProfilePageData

const fixtures: Record<string, ProfilePageData> = {
  [sampleProfile.profile.username]: sampleProfile
}

export const getProfileFixture = (username: string): ProfilePageData | null =>
  fixtures[username] ?? null

export const myProfileFixture = sampleProfile
