import { useTranslation } from 'react-i18next';

import { getSortOptions } from '@app/searchV2/context/constants';

export default function useGetSortOptions() {
    const { t } = useTranslation();
    // TODO: Add a new endpoint showSortFields() that passes the list of potential sort fields, and verifies
    // whether there are any entries matching that sort field.
    return getSortOptions(t);
}
