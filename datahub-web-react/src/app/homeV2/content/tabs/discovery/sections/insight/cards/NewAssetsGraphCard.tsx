import React from 'react';
import { useTranslation } from 'react-i18next';

// Ideally these sections are rendered from the backend, and are simply groups of entities.
export const NewAssetsGraphCard = () => {
    const { t } = useTranslation();
    return <>{t('home.insights.newAssets')}</>;
};
