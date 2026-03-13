import { useTranslation } from 'react-i18next';

import { FIELD_TO_LABEL, getTranslatedFieldLabel } from '@app/searchV2/utils/constants';
import { FilterField } from '@app/searchV2/filters/types';

/**
 * Hook that returns filter fields with translated displayNames
 */
export const useTranslatedFilters = (fields: FilterField[]): FilterField[] => {
    const { t } = useTranslation();

    return fields.map((field) => ({
        ...field,
        displayName: getTranslatedFieldLabel(field.field, t) || field.displayName,
    }));
};
