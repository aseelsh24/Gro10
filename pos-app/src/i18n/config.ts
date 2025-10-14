import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import arTranslations from './ar';
import enTranslations from './en';

i18n
  .use(initReactI18next as any)
  .init({
    resources: {
      ar: {
        translation: arTranslations
      },
      en: {
        translation: enTranslations
      }
    },
    lng: 'ar', // اللغة الافتراضية
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;