import React from 'react';
import { useTranslation } from 'react-i18next';

import { SearchListInsightCard } from '@app/homeV2/content/tabs/discovery/sections/insight/cards/SearchListInsightCard';
import {
    buildMostRowsFilters,
    buildMostRowsSort,
} from '@app/homeV2/content/tabs/discovery/sections/insight/cards/useGetMostRows';

import { EntityType } from '@types';

export const MOST_ROWS_ID = 'MostRows';

export const MostRowsCard = () => {
    const { t } = useTranslation();
    return (
        <SearchListInsightCard
            id={MOST_ROWS_ID}
            title={t('home.insights.largestTables')}
            types={[EntityType.Dataset]}
            filters={buildMostRowsFilters()}
            sort={buildMostRowsSort()}
        />
    );
};
