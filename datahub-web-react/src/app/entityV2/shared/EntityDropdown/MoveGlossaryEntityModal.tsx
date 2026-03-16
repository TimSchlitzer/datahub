import { Form, Typography, message } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';

import { useRefetch } from '@app/entity/shared/EntityContext';
import { GenericEntityProperties } from '@app/entity/shared/types';
import NodeParentSelect from '@app/entityV2/shared/EntityDropdown/NodeParentSelect';
import { useGlossaryEntityData } from '@app/entityV2/shared/GlossaryEntityContext';
import { getGlossaryRootToUpdate, getParentNodeToUpdate, updateGlossarySidebar } from '@app/glossary/utils';
import { useEntityRegistry } from '@app/useEntityRegistry';
import { Modal } from '@src/alchemy-components';

import { useUpdateParentNodeMutation } from '@graphql/glossary.generated';
import { Entity, EntityType } from '@types';

const StyledItem = styled(Form.Item)`
    margin-bottom: 0;
`;

const OptionalWrapper = styled.span`
    font-weight: normal;
`;

interface Props {
    entityData: GenericEntityProperties | null;
    entityType: EntityType;
    urn: string;
    onClose: () => void;
}

function MoveGlossaryEntityModal({ onClose, urn, entityData, entityType }: Props) {
    const { t } = useTranslation();
    const { isInGlossaryContext, urnsToUpdate, setUrnsToUpdate, setNodeToDeletedUrn, setNodeToNewEntity } =
        useGlossaryEntityData();
    const [form] = Form.useForm();
    const entityRegistry = useEntityRegistry();
    const [selectedParentUrn, setSelectedParentUrn] = useState('');
    const refetch = useRefetch();

    const [updateParentNode] = useUpdateParentNodeMutation();

    function moveGlossaryEntity() {
        updateParentNode({
            variables: {
                input: {
                    resourceUrn: urn,
                    parentNode: selectedParentUrn || null,
                },
            },
        })
            .then(() => {
                message.loading({ content: t('entityDropdown.updating'), duration: 2 });
                setTimeout(() => {
                    message.success({
                        content: t('entityDropdown.moved', { type: entityRegistry.getEntityName(entityType) }),
                        duration: 2,
                    });
                    refetch();
                    if (isInGlossaryContext) {
                        const oldParentToUpdate = getParentNodeToUpdate(entityData, entityType);
                        const newParentToUpdate = selectedParentUrn || getGlossaryRootToUpdate(entityType);
                        if (oldParentToUpdate === newParentToUpdate) return;
                        updateGlossarySidebar([oldParentToUpdate, newParentToUpdate], urnsToUpdate, setUrnsToUpdate);
                        setNodeToDeletedUrn((currData) => ({
                            ...currData,
                            [oldParentToUpdate]: urn,
                        }));
                        if (selectedParentUrn) {
                            setNodeToNewEntity((currData) => ({
                                ...currData,
                                [selectedParentUrn]: entityData as Entity,
                            }));
                        }
                    }
                }, 2000);
            })
            .catch((e) => {
                message.destroy();
                message.error({ content: t('entityDropdown.failedMove', { error: e.message || '' }), duration: 3 });
            });
        onClose();
    }

    return (
        <Modal
            data-testid="move-glossary-entity-modal"
            title={t(
                entityType === EntityType.GlossaryNode ? 'entityDropdown.moveTermGroup' : 'entityDropdown.moveTerm',
            )}
            open
            onCancel={onClose}
            buttons={[
                {
                    text: t('common.cancel'),
                    variant: 'outline',
                    onClick: onClose,
                },
                {
                    text: t('entityDropdown.move'),
                    variant: 'filled',
                    onClick: moveGlossaryEntity,
                    buttonDataTestId: 'glossary-entity-modal-move-button',
                },
            ]}
        >
            <Form form={form} initialValues={{}} layout="vertical">
                <Form.Item
                    label={
                        <Typography.Text strong>
                            {t('entityDropdown.moveTo')} <OptionalWrapper>{t('common.optional')}</OptionalWrapper>
                        </Typography.Text>
                    }
                >
                    <StyledItem name="parent">
                        <NodeParentSelect
                            selectedParentUrn={selectedParentUrn}
                            setSelectedParentUrn={setSelectedParentUrn}
                            isMoving
                        />
                    </StyledItem>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default MoveGlossaryEntityModal;
