import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Dropdown, Menu, message } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { MenuIcon } from '@app/entity/shared/EntityDropdown/EntityDropdown';
import handleGraphQLError from '@app/shared/handleGraphQLError';
import { ConfirmationModal } from '@app/sharedV2/modals/ConfirmationModal';

import { useDeletePostMutation } from '@graphql/post.generated';

type Props = {
    urn: string;
    title: string;
    onDelete?: () => void;
    onEdit?: () => void;
};

export default function PostItemMenu({ title, urn, onDelete, onEdit }: Props) {
    const { t } = useTranslation();
    const [deletePostMutation] = useDeletePostMutation();
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    const deletePost = () => {
        deletePostMutation({
            variables: {
                urn,
            },
        })
            .then(({ errors }) => {
                if (!errors) {
                    message.success(t('settings.posts.deletedPost'));
                    onDelete?.();
                }
            })
            .catch((error) => {
                handleGraphQLError({
                    error,
                    defaultMessage: t('settings.posts.failedToDeletePost'),
                    permissionMessage: t('settings.posts.unauthorizedToDeletePost'),
                });
            });
    };

    return (
        <>
            <Dropdown
                trigger={['click']}
                overlay={
                    <Menu>
                        <Menu.Item onClick={() => setShowConfirmDelete(true)} key="delete">
                            <DeleteOutlined /> &nbsp;{t('common.delete')}
                        </Menu.Item>
                        <Menu.Item onClick={onEdit} key="edit">
                            <EditOutlined /> &nbsp;{t('common.edit')}
                        </Menu.Item>
                    </Menu>
                }
            >
                <MenuIcon data-testid="dropdown-menu-item" fontSize={20} />
            </Dropdown>
            <ConfirmationModal
                isOpen={showConfirmDelete}
                handleClose={() => setShowConfirmDelete(false)}
                handleConfirm={deletePost}
                modalTitle={t('settings.posts.deletePostTitle', { title })}
                modalText={t('settings.posts.deletePostConfirm')}
            />
        </>
    );
}
