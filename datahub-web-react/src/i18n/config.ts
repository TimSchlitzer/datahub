import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import de from '@src/i18n/locales/de.json';
import en from '@src/i18n/locales/en.json';
import ptBr from '@src/i18n/locales/pt-br.json';

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        supportedLngs: ['en', 'de', 'pt-BR'],
        resources: {
            en: { translation: en },
            de: { translation: de },
            'pt-BR': { translation: ptBr },
        },
        interpolation: {
            // React already escapes values
            escapeValue: false,
        },
        detection: {
            // Prefer localStorage so the server-synced value can override browser language
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
            lookupLocalStorage: 'datahub-locale',
        },
    });

export default i18n;
