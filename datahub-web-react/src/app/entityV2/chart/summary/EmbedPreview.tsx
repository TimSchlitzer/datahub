import HeaderIcon from '@mui/icons-material/VisibilityOutlined';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { SummaryTabHeaderTitle, SummaryTabHeaderWrapper } from '@app/entityV2/shared/summary/HeaderComponents';

const Wrapper = styled.div`
    height: fit-content;
`;

const StyledIframe = styled.iframe`
    width: 100%;
    height: 70vh;
`;

interface Props {
    embedUrl: string;
}

export default function EmbedPreview({ embedUrl }: Props) {
    const { t } = useTranslation();
    return (
        <Wrapper>
            <SummaryTabHeaderWrapper>
                <SummaryTabHeaderTitle icon={<HeaderIcon />} title={t('entity.shared.tabs.preview')} />
            </SummaryTabHeaderWrapper>
            <StyledIframe src={embedUrl} frameBorder={0} />
        </Wrapper>
    );
}
