import { Icon } from '@components';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { EXECUTION_REQUEST_STATUS_RUNNING, EXECUTION_REQUEST_STATUS_SUCCESS } from '@app/ingestV2/executions/constants';
import { ExecutionRequestRecord } from '@app/ingestV2/executions/types';
import BaseActionsColumn, { MenuItem } from '@app/ingestV2/shared/components/columns/BaseActionsColumn';

interface ActionsColumnProps {
    record: ExecutionRequestRecord;
    handleViewDetails: (urn: string) => void;
    handleRollback: (urn: string) => void;
    handleCancel: (urn: string) => void;
}

export function ActionsColumn({ record, handleViewDetails, handleRollback, handleCancel }: ActionsColumnProps) {
    const { t } = useTranslation();
    const items = [
        {
            key: '0',
            disabled: !record.urn || !navigator.clipboard,
            label: (
                <MenuItem
                    onClick={() => {
                        navigator.clipboard.writeText(record.urn);
                    }}
                >
                    {t('copy.copyURN')}
                </MenuItem>
            ),
        },
        {
            key: '1',
            label: (
                <MenuItem
                    onClick={() => {
                        handleViewDetails(record.urn);
                    }}
                >
                    {t('common.details')}
                </MenuItem>
            ),
        },
    ];

    if (record.status === EXECUTION_REQUEST_STATUS_RUNNING) {
        items.push({
            key: '2',
            label: <MenuItem onClick={() => handleCancel(record.urn)}>{t('common.cancel')}</MenuItem>,
        });
    }

    return (
        <BaseActionsColumn
            dropdownItems={items}
            extraActions={
                record.status === EXECUTION_REQUEST_STATUS_SUCCESS && record.showRollback ? (
                    <Icon
                        icon="ArrowUUpLeft"
                        source="phosphor"
                        onClick={() => handleRollback(record.id)}
                        tooltipText={t('common.rollback')}
                    />
                ) : null
            }
        />
    );
}
