import { Button, Tooltip } from '@components';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import CreateDomainModal from '@app/domainV2/CreateDomainModal';

const Wrapper = styled.div`
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
`;

const DomainTitle = styled.div`
    font-size: 16px;
    font-weight: bold;
    color: #374066;
`;

const StyledButton = styled(Button)`
    padding: 2px;
    margin-right: 4px;
    svg {
        width: 20px;
        height: 20px;
    }
`;

export default function DomainsSidebarHeader() {
    const { t } = useTranslation();
    const [isCreatingDomain, setIsCreatingDomain] = useState(false);

    return (
        <Wrapper>
            <DomainTitle>{t('domain.sidebarTitle')}</DomainTitle>
            <Tooltip showArrow={false} title={t('domain.createNewTooltip')} placement="right">
                <StyledButton
                    variant="filled"
                    color="violet"
                    isCircle
                    icon={{ icon: 'Plus', source: 'phosphor' }}
                    onClick={() => setIsCreatingDomain(true)}
                    data-testid="sidebar-create-domain-button"
                />
            </Tooltip>
            {isCreatingDomain && (
                <CreateDomainModal
                    onClose={() => setIsCreatingDomain(false)}
                    onCreate={() => setIsCreatingDomain(false)}
                />
            )}
        </Wrapper>
    );
}
