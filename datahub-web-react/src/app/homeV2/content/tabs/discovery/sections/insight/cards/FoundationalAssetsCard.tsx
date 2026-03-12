import React from 'react';
import { useTranslation } from 'react-i18next';

import { SearchListInsightCard } from '@app/homeV2/content/tabs/discovery/sections/insight/cards/SearchListInsightCard';
import {
    buildFoundationalAssetsFilters,
    buildFoundationalAssetsSort,
} from '@app/homeV2/content/tabs/discovery/sections/insight/cards/useGetFoundationalAssets';
import { ASSET_ENTITY_TYPES } from '@app/searchV2/utils/constants';

export const FoundationalAssetsCard = () => {
    const { t } = useTranslation();
    return (
        <SearchListInsightCard
            id="FoundationalAssets"
            types={[...ASSET_ENTITY_TYPES] as any}
            title={t('home.insights.foundational.title')}
            tip={t('home.insights.foundational.subtitle')}
            filters={buildFoundationalAssetsFilters()}
            sort={buildFoundationalAssetsSort()}
        />
    );
};
