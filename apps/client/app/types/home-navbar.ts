export interface HomeNavbarConfig {
  variant?: 'back-path'
  title?: string
  mainHorizontalPadding?: 'default' | 'none'
  mainWidth?: 'default' | 'wide'
}

declare module 'vue-router' {
  interface RouteMeta {
    homeNavbar?: HomeNavbarConfig
  }
}

export {}
