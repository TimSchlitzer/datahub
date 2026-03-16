import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import OptionalPromptsRemaining from '@app/entity/shared/containers/profile/sidebar/FormInfo/OptionalPromptsRemaining';
import VerificationAuditStamp from '@app/entity/shared/containers/profile/sidebar/FormInfo/VerificationAuditStamp';
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

import ShieldCheck from '@images/shield-check.svg';

interface Props {
    showVerificationStyles: boolean;
    numOptionalPromptsRemaining: number;
    isUserAssigned: boolean;
    formUrn?: string;
    openFormModal?: () => void;
}

export default function CompletedView({
    showVerificationStyles,
    numOptionalPromptsRemaining,
    isUserAssigned,
    formUrn,
    openFormModal,
}: Props) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <CTAWrapper backgroundColor="#FFF" borderColor="#77B750">
            <FlexWrapper>
                <Content>
                    <TitleWrapper
                        isOpen={isOpen}
                        isUserAssigned={isUserAssigned}
                        onClick={() => isUserAssigned && setIsOpen(!isOpen)}
                    >
                        <Title>
                            {showVerificationStyles ? (
                                <StyledImgIcon src={ShieldCheck} addLineHeight />
                            ) : (
                                <StyledReadOutlined color="#77B750" addLineHeight />
                            )}
                            {showVerificationStyles
                                ? t('entity.shared.sidebar.verified')
                                : t('entity.shared.sidebar.documented')}
                        </Title>
                        {isUserAssigned && <StyledArrow isOpen={isOpen} />}
                    </TitleWrapper>
                    {isUserAssigned && isOpen && (
                        <>
                            <VerificationAuditStamp formUrn={formUrn} />
                            {isUserAssigned && <OptionalPromptsRemaining numRemaining={numOptionalPromptsRemaining} />}
                            {!!openFormModal && (
                                <StyledButtonWrapper>
                                    <Button variant="outline" onClick={openFormModal}>
                                        {t('entity.shared.sidebar.viewAndEdit')}
                                    </Button>
                                </StyledButtonWrapper>
                            )}
                        </>
                    )}
                </Content>
            </FlexWrapper>
        </CTAWrapper>
    );
}
