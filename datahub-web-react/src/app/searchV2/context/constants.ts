import { SortOrder } from '@types';

export const RELEVANCE = 'relevance';
export const ENTITY_NAME_FIELD = '_entityName';
export const LAST_MODIFIED_TIME_FIELD = 'lastModifiedAt';

export const DEFAULT_SORT_OPTION = RELEVANCE;

export const getSortOptions = (t: (key: string) => string) => ({
    [RELEVANCE]: { label: t('search.filters.sort.relevance'), field: RELEVANCE, sortOrder: SortOrder.Descending },
    [`${ENTITY_NAME_FIELD}_${SortOrder.Ascending}`]: {
        label: t('search.filters.sort.nameAZ'),
        field: ENTITY_NAME_FIELD,
        sortOrder: SortOrder.Ascending,
    },
    [`${ENTITY_NAME_FIELD}_${SortOrder.Descending}`]: {
        label: t('search.filters.sort.nameZA'),
        field: ENTITY_NAME_FIELD,
        sortOrder: SortOrder.Descending,
    },
    [`${LAST_MODIFIED_TIME_FIELD}_${SortOrder.Descending}`]: {
        label: t('search.filters.sort.lastModified'),
        field: LAST_MODIFIED_TIME_FIELD,
        sortOrder: SortOrder.Descending,
    },
});
