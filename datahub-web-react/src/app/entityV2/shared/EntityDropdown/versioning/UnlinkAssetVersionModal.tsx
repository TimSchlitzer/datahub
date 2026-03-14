import { Modal } from '@components';
import { message } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

import analytics, { EventType } from '@app/analytics';
import { useEntityRegistry } from '@app/useEntityRegistry';

import { useUnlinkAssetVersionMutation } from '@graphql/versioning.generated';
import { EntityType } from '@types';

interface Props {
    urn: string;
    entityType: EntityType;
    closeModal: () => void;
    versionSetUrn?: string;
    refetch?: () => void;
}

export default function UnlinkAssetVersionModal({ urn, entityType, closeModal, versionSetUrn, refetch }: Props) {
    const { t } = useTranslation();
    const entityRegistry = useEntityRegistry();
    const [unlink] = useUnlinkAssetVersionMutation();

    function handleUnlink() {
        unlink({ variables: { input: { unlinkedEntity: urn, versionSet: versionSetUrn } } })
            .then(() => {
                closeModal();
                analytics.event({
                    type: EventType.UnlinkAssetVersionEvent,
                    assetUrn: urn,
                    versionSetUrn,
                    entityType,
                });
                message.loading({
                    content: t('entityDropdown.unlinking'),
                    duration: 2,
                });

                setTimeout(() => {
                    refetch?.();
                    message.success({
                        content: t('entityDropdown.unlinked', { type: entityRegistry.getEntityName(entityType) }),
                        duration: 2,
                    });
                }, 2000);
            })
            .catch((e) => {
                message.destroy();
                message.error({ content: t('entityDropdown.failedUnlink', { error: e.message || '' }), duration: 3 });
            });
    }

    return (
        <Modal
            title={t('entityDropdown.confirmUnlink')}
            subtitle={t('entityDropdown.confirmUnlinkText')}
            buttons={[
                { text: t('common.no'), variant: 'text', onClick: closeModal, key: 'no' },
                { text: t('common.yes'), variant: 'filled', onClick: handleUnlink, key: 'yes' },
            ]}
            onCancel={closeModal}
        />
    );
}
