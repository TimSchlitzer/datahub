import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { Text } from '@src/alchemy-components';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px 0;
`;

export default function NoSearchingPlaceholder() {
    const { t } = useTranslation();
    return (
        <Container>
            <Text color="gray" colorLevel={600} size="md">
                {t('placeholder.startSearching')}
            </Text>
            <Text color="gray" size="sm">
                {t('placeholder.searchCatalogDescription')}
            </Text>
        </Container>
    );
}
