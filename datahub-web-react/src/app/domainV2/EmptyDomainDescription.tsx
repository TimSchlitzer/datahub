import { Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';

import { ANTD_GRAY } from '@app/entity/shared/constants';

const StyledParagraph = styled(Typography.Paragraph)`
    text-align: justify;
    text-justify: inter-word;
    margin: 40px 0;
    font-size: 15px;
`;

function EmptyDomainDescription() {
    const { t } = useTranslation();
    return (
        <>
            <StyledParagraph type="secondary">
                <strong style={{ color: ANTD_GRAY[8] }}>{t('domain.welcomeTitle')}</strong> {t('domain.welcomeDescription')}
            </StyledParagraph>
            <StyledParagraph type="secondary">
                <strong style={{ color: ANTD_GRAY[8] }}>{t('domain.nestedDomainsTitle')}</strong> {t('domain.nestedDomainsDescription')}
            </StyledParagraph>
            <StyledParagraph type="secondary">
                <strong style={{ color: ANTD_GRAY[8] }}>{t('domain.buildDataProductsTitle')}</strong>: {t('domain.buildDataProductsDescription')}
            </StyledParagraph>
            <StyledParagraph type="secondary">
                {t('domain.readyToStart')}
            </StyledParagraph>
        </>
    );
}

export default EmptyDomainDescription;
