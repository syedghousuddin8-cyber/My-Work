/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_WS_URL: string
  readonly VITE_ENV: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_DEBUG: string
  readonly VITE_GOOGLE_MAPS_KEY: string
  readonly VITE_STRIPE_PUBLIC_KEY: string
  readonly VITE_SOCKET_RECONNECTION_ATTEMPTS: string
  readonly VITE_SOCKET_RECONNECTION_DELAY: string
  readonly VITE_MAX_FILE_SIZE: string
  readonly VITE_ALLOWED_FILE_TYPES: string
  readonly VITE_DEFAULT_PAGE_SIZE: string
  readonly VITE_MAX_PAGE_SIZE: string
  readonly VITE_SESSION_TIMEOUT: string
  readonly VITE_IDLE_TIMEOUT: string
  readonly VITE_ENABLE_PWA: string
  readonly VITE_ENABLE_SERVICE_WORKER: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
