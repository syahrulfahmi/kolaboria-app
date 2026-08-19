import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  // The application shell and authenticated product areas are client-rendered
  // by default. Public routes opt back into SSR below.
  ssr: false,
  devtools: { enabled: true },
  devServer: {
    host: '127.0.0.1'
  },
  modules: ['@nuxtjs/supabase'],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()]
  },
  components: [
    {
      path: '~/components/ui/atoms',
      prefix: 'Atomic',
      global: true
    },
    {
      path: '~/components/ui/molecules',
      prefix: 'Molecule',
      global: true
    },
    {
      path: '~/components/ui/organisms',
      prefix: 'Organism',
      global: true
    },
    {
      path: '~/components/ui/icon',
      prefix: 'Icon',
      global: true
    },
    '~/components'
  ],
  supabase: {
    url:
      process.env.NUXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    key: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
    redirect: false
  },
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY,
      apiBaseUrl:
        process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1',
      googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID
    }
  },
  routeRules: {
    // Public acquisition and discovery surfaces.
    '/': { ssr: true, prerender: true },
    '/projects': { ssr: true, swr: 300 },
    '/projects/*': { ssr: true },
    '/profile/*': { ssr: true },
    '/@/**': { ssr: true },

    // Reserved/private routes must remain client-rendered even though they
    // share a prefix with public project/profile routes above.
    '/projects/my-projects': { ssr: false },
    '/projects/my-applications': { ssr: false },
    '/projects/create': { ssr: false },
    '/projects/*/edit': { ssr: false },
    '/projects/*/applicants': { ssr: false },
    '/projects/*/workspace': { ssr: false },
    '/profile/me': { ssr: false },
    '/profile/me/**': { ssr: false }
  },
  app: {
    head: {
      title: 'Kolaboria - Connect. Collaborate. Create.',
      meta: [
        {
          name: 'description',
          content:
            'The ultimate platform connecting mentors, talents, and companies to collaborate on amazing projects.'
        }
      ]
    }
  }
})
