import { SearchBar } from '@components';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { useDebounce } from 'react-use';
import { useTranslation } from 'react-i18next';

import { onClickPreventSelect } from '@app/lineageV3/common';

interface Props {
    searchText: string;
    setSearchText: Dispatch<SetStateAction<string>>;
}

export default function ColumnSearch({ searchText, setSearchText }: Props) {
    const { t } = useTranslation();
    // Prevent lag with local value
    const [value, setValue] = useState(searchText);

    useDebounce(() => setSearchText(value), 200, [value]);

    return (
        <SearchBar
            value={value}
            defaultValue={searchText}
            placeholder={t('lineage.findColumn')}
            onChange={(v) => setValue(v.trim())}
            onClick={onClickPreventSelect}
            height="32px"
        />
    );
}
