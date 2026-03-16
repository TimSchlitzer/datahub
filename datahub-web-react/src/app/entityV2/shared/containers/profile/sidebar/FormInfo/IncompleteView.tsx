import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import OptionalPromptsRemaining from '@app/entity/shared/containers/profile/sidebar/FormInfo/OptionalPromptsRemaining';
import RequiredPromptsRemaining from '@app/entity/shared/containers/profile/sidebar/FormInfo/RequiredPromptsRemaining';
import {
    CTAWrapper,
    Content,
    FlexWrapper,
    StyledArrow,
    StyledButtonWrapper,
    StyledImgIcon,
    StyledReadOutlined,
    Title,
    TitleWrapper,
} from '@app/entityV2/shared/containers/profile/sidebar/FormInfo/components';
import { Button } from '@src/alchemy-components';

import ShieldExclamation from '@images/shield-exclamation.svg';

const Text = styled.div`
    text-wrap: wrap;
`;

interface Props {
    showVerificationStyles: boolean;
    numOptionalPromptsRemaining: number;
    numRequiredPromptsRemaining: number;
    isUserAssigned: boolean;
    openFormModal?: () => void;
}

export default function IncompleteView({
    showVerificationStyles,
    numOptionalPromptsRemaining,
    numRequiredPromptsRemaining,
    isUserAssigned,
    openFormModal,
}: Props) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <CTAWrapper backgroundColor="#FEF9ED" borderColor="#F4C449">
            <FlexWrapper>
                <Content>
                    <TitleWrapper
                        isOpen={isOpen}
                        isUserAssigned={isUserAssigned}
                        onClick={() => isUserAssigned && setIsOpen(!isOpen)}
                        data-testid={
                            showVerificationStyles ? 'incomplete-verification-title' : 'incomplete-documentation-title'
                        }
                    >
                        <Title>
                            {isUserAssigned && (
                                <>
                                    {showVerificationStyles ? (
                                        <StyledImgIcon src={ShieldExclamation} />
                                    ) : (
                                        <StyledReadOutlined color="#F4C449" addLineHeight />
                                    )}
                                </>
                            )}
                            {!isUserAssigned && <StyledImgIcon src={ShieldExclamation} disable />}
                            {showVerificationStyles
                                ? t('entity.shared.sidebar.awaitingVerification')
                                : t('entity.shared.sidebar.awaitingDocumentation')}
                        </Title>
                        {isUserAssigned && <StyledArrow isOpen={isOpen} />}
                    </TitleWrapper>
                    {isUserAssigned && isOpen && (
                        <>
                            <Text>{t('entity.shared.sidebar.completeRequirements')}</Text>
                            <RequiredPromptsRemaining numRemaining={numRequiredPromptsRemaining} />
                            <OptionalPromptsRemaining numRemaining={numOptionalPromptsRemaining} />
                        </>
                    )}
                </Content>
            </FlexWrapper>
            {!!openFormModal && isUserAssigned && isOpen && (
                <StyledButtonWrapper>
                    <Button
                        variant="outline"
                        onClick={openFormModal}
                        data-testid={
                            showVerificationStyles ? 'complete-verification-button' : 'complete-documentation-button'
                        }
                    >
                        {showVerificationStyles
                            ? t('entity.shared.sidebar.completeVerification')
                            : t('entity.shared.sidebar.completeDocumentation')}
                    </Button>
                </StyledButtonWrapper>
            )}
        </CTAWrapper>
    );
}
