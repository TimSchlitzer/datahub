import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { ANTD_GRAY } from '@app/entity/shared/constants';

const Text = styled.div`
    font-size: 14px;
    color: ${ANTD_GRAY[7]};
`;

export const EmptyGlossaryNodesYouOwn = () => {
    const { t } = useTranslation();
    return (
        <Text>
            {t('home.reference.glossary.empty')} <br />
            <a
                target="_blank"
                rel="noreferrer noopener"
                href="https://docs.datahub.com/docs/glossary/business-glossary/"
            >
                {t('home.reference.learnMore')}
            </a>{' '}
            {t('home.reference.glossary.learnMore')}.
        </Text>
    );
};
