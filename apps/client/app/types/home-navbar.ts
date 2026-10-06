export interface HomeNavbarConfig {
  variant: 'back-path'
  title: string
  mainHorizontalPadding?: 'default' | 'none'
}

declare module 'vue-router' {
  interface RouteMeta {
    homeNavbar?: HomeNavbarConfig
  }
}

export {}
