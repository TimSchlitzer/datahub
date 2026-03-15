import { Text } from '@components';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { EmptyContainer } from '@app/govern/structuredProperties/styledComponents';
import EmptyFormsImage from '@src/images/empty-forms.svg?react';

interface Props {
    isEmptySearch?: boolean;
}

const EmptyStructuredProperties = ({ isEmptySearch }: Props) => {
    const { t } = useTranslation();
    return (
        <EmptyContainer>
            {isEmptySearch ? (
                <Text size="lg" color="gray" weight="bold">
                    {t('govern.structuredProperties.noResults')}
                </Text>
            ) : (
                <>
                    <EmptyFormsImage />
                    <Text size="md" color="gray" weight="bold">
                        {t('govern.structuredProperties.noProperties')}
                    </Text>
                </>
            )}
        </EmptyContainer>
    );
};

export default EmptyStructuredProperties;
