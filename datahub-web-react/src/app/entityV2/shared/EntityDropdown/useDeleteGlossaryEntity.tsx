import { Modal, message } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useEntityData } from '@app/entity/shared/EntityContext';
import { useEntityRegistry } from '@app/useEntityRegistry';

import { useDeleteGlossaryEntityMutation } from '@graphql/glossary.generated';

function useDeleteGlossaryEntity() {
    const { t } = useTranslation();
    const [hasBeenDeleted, setHasBeenDeleted] = useState(false);
    const { entityData, urn: entityDataUrn, entityType } = useEntityData();
    const entityRegistry = useEntityRegistry();

    const [deleteGlossaryEntity] = useDeleteGlossaryEntityMutation();

    function handleDeleteGlossaryEntity() {
        deleteGlossaryEntity({
            variables: {
                urn: entityDataUrn,
            },
        })
            .catch((e) => {
                message.destroy();
                message.error({ content: t('entityDropdown.failedDelete', { error: e.message || '' }), duration: 3 });
            })
            .finally(() => {
                message.loading({
                    content: t('entityDropdown.deletingEllipsis'),
                    duration: 2,
                });
                setHasBeenDeleted(true);
                message.success({
                    content: t('entityDropdown.deleted', { type: entityRegistry.getEntityName(entityType) }),
                    duration: 2,
                });
            });
    }

    function onDeleteEntity() {
        Modal.confirm({
            title: `Delete ${entityRegistry.getDisplayName(entityType, entityData)}`,
            content: `Are you sure you want to remove this ${entityRegistry.getEntityName(entityType)}?`,
            onOk() {
                handleDeleteGlossaryEntity();
            },
            onCancel() {},
            okText: 'Yes',
            maskClosable: true,
            closable: true,
        });
    }

    return { onDeleteEntity, hasBeenDeleted };
}

export default useDeleteGlossaryEntity;
