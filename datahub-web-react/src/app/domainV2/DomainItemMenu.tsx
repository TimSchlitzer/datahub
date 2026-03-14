import { DeleteOutlined } from '@ant-design/icons';
import { Dropdown, Menu, message } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { MenuIcon } from '@app/entity/shared/EntityDropdown/EntityDropdown';
import { ConfirmationModal } from '@app/sharedV2/modals/ConfirmationModal';
import { useEntityRegistry } from '@app/useEntityRegistry';

import { useDeleteDomainMutation } from '@graphql/domain.generated';
import { EntityType } from '@types';

type Props = {
    urn: string;
    name: string;
    onDelete?: () => void;
};

export default function DomainItemMenu({ name, urn, onDelete }: Props) {
    const { t } = useTranslation();
    const entityRegistry = useEntityRegistry();
    const [deleteDomainMutation] = useDeleteDomainMutation();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const deleteDomain = () => {
        deleteDomainMutation({
            variables: {
                urn,
            },
        })
            .then(({ errors }) => {
                if (!errors) {
                    message.success(t('domain.deletedMessage'));
                    onDelete?.();
                }
            })
            .catch((e) => {
                console.error('Issue deleting a domain:', e);
                message.destroy();
                message.error({ content: t('domain.deleteErrorMessage'), duration: 3 });
            });
    };

    return (
        <>
            <Dropdown
                trigger={['click']}
                overlay={
                    <Menu>
                        <Menu.Item onClick={() => setShowDeleteModal(true)} key="delete">
                            <DeleteOutlined /> &nbsp;{t('domain.delete')}
                        </Menu.Item>
                    </Menu>
                }
            >
                <MenuIcon data-testid={`dropdown-menu-${urn}`} fontSize={20} />
            </Dropdown>
            <ConfirmationModal
                isOpen={showDeleteModal}
                handleClose={() => setShowDeleteModal(false)}
                handleConfirm={deleteDomain}
                modalTitle={`Delete Domain '${name}'`}
                modalText={`Are you sure you want to remove this ${entityRegistry.getEntityName(EntityType.Domain)}?`}
            />
        </>
    );
}
