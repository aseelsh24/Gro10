declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: typeof import('../i18n/en').default;
    };
  }

  export function useTranslation(ns?: string | string[]): {
    t: (key: string, options?: any) => string;
    i18n: {
      changeLanguage: (lng: string) => Promise<any>;
      language: string;
    };
  };

  export const initReactI18next: {
    type: string;
  };
}