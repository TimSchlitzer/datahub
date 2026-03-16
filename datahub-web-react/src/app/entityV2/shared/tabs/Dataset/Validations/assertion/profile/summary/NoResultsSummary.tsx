import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const SecondaryText = styled.div`
    color: ${(props) => props.theme.colors.textSecondary};
`;

/**
 * No results yet summarization.
 */
export const NoResultsSummary = () => {
    const { t } = useTranslation();
    return <SecondaryText>{t('assertion.noAssertionsHaveRun')}</SecondaryText>;
};
