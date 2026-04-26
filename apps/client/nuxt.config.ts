import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
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
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY
    }
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
