import type { FeaturedProject, PortfolioItem } from '../types/profile-page'

export const FEATURED_PROJECT_FIXTURES = [
  {
    id: 'featured-project-community-learning',
    title: 'Ruang Belajar Komunitas',
    slug: 'ruang-belajar-komunitas',
    description:
      'Merancang pengalaman belajar digital yang mudah diakses oleh komunitas lokal.',
    category: 'Pendidikan',
    role: 'Product Design',
    year: '2026',
    skills: ['Riset pengguna', 'Product design', 'Prototyping']
  },
  {
    id: 'featured-project-local-market',
    title: 'Katalog Produk Lokal',
    slug: 'katalog-produk-lokal',
    description:
      'Membantu pelaku usaha kecil memperkenalkan produk dan cerita di baliknya.',
    category: 'Ekonomi lokal',
    role: 'UX Research',
    year: '2025',
    skills: ['UX research', 'Information architecture', 'Usability testing']
  }
] satisfies FeaturedProject[]

export const PORTFOLIO_ITEM_FIXTURES = [
  {
    id: 'portfolio-community-learning',
    title: 'Ruang Belajar Komunitas',
    role: 'Product Design',
    year: '2026',
    summary:
      'Alur belajar yang dirancang bersama komunitas agar materi lebih mudah ditemukan.',
    url: 'https://portfolio.example.com/ruang-belajar-komunitas',
    thumbnailUrl: null
  },
  {
    id: 'portfolio-local-market',
    title: 'Katalog Produk Lokal',
    role: 'UX Research',
    year: '2025',
    summary:
      'Riset dan prototipe katalog digital untuk usaha kecil di sekitar Yogyakarta.',
    url: 'https://portfolio.example.com/katalog-produk-lokal',
    thumbnailUrl: null
  }
] satisfies PortfolioItem[]
