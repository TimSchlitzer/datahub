import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useUserContext } from '@app/context/useUserContext';

/**
 * Syncs the i18n language to the locale stored in the user's settings.
 * Must be called inside a component that is a child of UserContextProvider.
 *
 * Priority order:
 *  1. Locale from the user's server-side settings (most authoritative)
 *  2. Browser language detection via i18next-browser-languagedetector (fallback on first visit)
 */
export function useLocale(): void {
    const { user } = useUserContext();
    const { i18n } = useTranslation();

    const savedLocale = user?.settings?.appearance?.locale;

    useEffect(() => {
        if (savedLocale && savedLocale !== i18n.language) {
            i18n.changeLanguage(savedLocale);
        }
    }, [savedLocale, i18n]);
}
