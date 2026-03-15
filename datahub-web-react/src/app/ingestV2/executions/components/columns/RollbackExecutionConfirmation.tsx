import React from 'react';
import { useTranslation } from 'react-i18next';

import { ConfirmationModal } from '@app/sharedV2/modals/ConfirmationModal';

interface Props {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function RollbackExecutionConfirmation({ isOpen, onConfirm, onCancel }: Props) {
    const { t } = useTranslation();
    return (
        <ConfirmationModal
            isOpen={isOpen}
            modalTitle={t('ingest.confirmRollback')}
            modalText={
                <>
                    {t('ingest.confirmRollbackModalText')}{' '}
                    <a
                        href="https://docs.datahub.com/docs/how/delete-metadata#rollback-ingestion-run"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {t('common.learnMore')}
                    </a>
                </>
            }
            handleConfirm={onConfirm}
            handleClose={onCancel}
        />
    );
}
