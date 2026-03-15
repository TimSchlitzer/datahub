import { Button, Tooltip, colors } from '@components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const StyledButton = styled(Button)`
    border: 1px solid ${colors.gray[100]};
`;

type Props = {
    setShowSelectMode: (showSelectMode: boolean) => any;
    disabled?: boolean;
};

export default function EditButton({ setShowSelectMode, disabled }: Props) {
    const { t } = useTranslation();
    return (
        <Tooltip title={t('sharedV2.editButton.edit')} showArrow={false} placement="top">
            <StyledButton
                onClick={() => setShowSelectMode(true)}
                disabled={disabled}
                data-testid="search-results-edit-button"
                isCircle
                icon={{ icon: 'PencilSimple', source: 'phosphor' }}
                variant="text"
                color="gray"
                size="sm"
            />
        </Tooltip>
    );
}
