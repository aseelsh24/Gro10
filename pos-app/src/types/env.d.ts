/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_DEFAULT_LOCALE: string;
  readonly VITE_DEFAULT_CURRENCY: string;
  readonly VITE_DEFAULT_TAX_RATE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}