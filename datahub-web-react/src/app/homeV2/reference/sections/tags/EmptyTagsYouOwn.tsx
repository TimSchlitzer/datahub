import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { ANTD_GRAY } from '@app/entity/shared/constants';

const Text = styled.div`
    font-size: 14px;
    color: ${ANTD_GRAY[7]};
`;

export const EmptyTagsYouOwn = () => {
    const { t } = useTranslation();
    return (
        <Text>
            {t('home.reference.tags.empty')}
            <br />
            <a target="_blank" rel="noreferrer noopener" href="https://docs.datahub.com/docs/tags">
                {t('home.reference.learnMore')}
            </a>{' '}
            {t('home.reference.tags.learnMore')}.
        </Text>
    );
};
