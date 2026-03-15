import React from 'react';
import { useTranslation } from 'react-i18next';

import { ConfirmationModal } from '@app/sharedV2/modals/ConfirmationModal';

interface Props {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function CancelExecutionConfirmation({ isOpen, onConfirm, onCancel }: Props) {
    const { t } = useTranslation();
    return (
        <ConfirmationModal
            isOpen={isOpen}
            modalTitle={t('ingest.confirmCancel')}
            modalText={t('ingest.confirmCancelModalText')}
            handleConfirm={onConfirm}
            handleClose={onCancel}
        />
    );
}
