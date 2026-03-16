import { PageTitle } from '@components';
import React from 'react';
import { useTranslation } from 'react-i18next';

const HistoricalSectionHeader = () => {
    const { t } = useTranslation();
    return (
        <>
            <PageTitle
                title={t('entity.dataset.stats.historicalSection.title')}
                subTitle={t('entity.dataset.stats.historicalSection.subTitle')}
                variant="sectionHeader"
            />{' '}
        </>
    );
};

export default HistoricalSectionHeader;
