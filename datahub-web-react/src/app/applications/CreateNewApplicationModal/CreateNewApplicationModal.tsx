import { Modal } from '@components';
import { message } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ModalButton } from '@components/components/Modal/Modal';

import ApplicationDetailsSection from '@app/applications/CreateNewApplicationModal/ApplicationDetailsSection';
import OwnersSection, { PendingOwner } from '@app/sharedV2/owners/OwnersSection';

import { useCreateApplicationMutation } from '@graphql/application.generated';
import { useBatchAddOwnersMutation } from '@graphql/mutations.generated';

type CreateNewApplicationModalProps = {
    open: boolean;
    onClose: () => void;
};

/**
 * Modal for creating a new application with owners and applying it to entities
 */
const CreateNewApplicationModal: React.FC<CreateNewApplicationModalProps> = ({ onClose, open }) => {
    const { t } = useTranslation();

    // Application details state
    const [applicationName, setApplicationName] = useState('');
    const [applicationDescription, setApplicationDescription] = useState('');

    // Owners state
    const [pendingOwners, setPendingOwners] = useState<PendingOwner[]>([]);
    const [selectedOwnerUrns, setSelectedOwnerUrns] = useState<string[]>([]);

    // Loading state
    const [isLoading, setIsLoading] = useState(false);

    // Mutations
    const [createApplicationMutation] = useCreateApplicationMutation();
    const [batchAddOwnersMutation] = useBatchAddOwnersMutation();

    const onChangeOwners = (newOwners: PendingOwner[]) => {
        setPendingOwners(newOwners);
    };

    /**
     * Handler for creating the tag and applying it to entities
     */
    const onOk = async () => {
        if (!applicationName) {
            // this should not happen due to validation in the modal, but doesnt hurt to be safe
            message.error(t('applications.nameRequired'));
            return;
        }

        setIsLoading(true);

        try {
            // Step 1: Create the new application
            const createApplicationResult = await createApplicationMutation({
                variables: {
                    input: {
                        properties: {
                            name: applicationName.trim(),
                            description: applicationDescription,
                        },
                    },
                },
            });

            const newApplicationUrn = createApplicationResult.data?.createApplication?.urn;

            if (!newApplicationUrn) {
                message.error(t('applications.createError'));
                setIsLoading(false);
                return;
            }

            // Step 3: Add owners if any
            if (pendingOwners.length > 0) {
                await batchAddOwnersMutation({
                    variables: {
                        input: {
                            owners: pendingOwners,
                            resources: [{ resourceUrn: newApplicationUrn }],
                        },
                    },
                });
            }

            message.success(t('applications.createSuccess', { name: applicationName }));
            setApplicationName('');
            setApplicationDescription('');
            setPendingOwners([]);
            setSelectedOwnerUrns([]);
            onClose();
        } catch (e: any) {
            message.destroy();
            message.error(`${t('applications.createFailed')}: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Modal buttons configuration
    const buttons: ModalButton[] = [
        {
            text: t('common.cancel'),
            color: 'violet',
            variant: 'text',
            onClick: onClose,
        },
        {
            text: t('applications.create'),
            id: 'createNewApplicationButton',
            color: 'violet',
            variant: 'filled',
            onClick: onOk,
            disabled: !applicationName || isLoading,
            isLoading,
        },
    ];

    return (
        <Modal title={t('applications.createNewApplication')} onCancel={onClose} buttons={buttons} open={open} centered width={500}>
            <ApplicationDetailsSection
                applicationName={applicationName}
                setApplicationName={setApplicationName}
                applicationDescription={applicationDescription}
                setApplicationDescription={setApplicationDescription}
            />
            <OwnersSection
                selectedOwnerUrns={selectedOwnerUrns}
                setSelectedOwnerUrns={setSelectedOwnerUrns}
                existingOwners={[]}
                onChange={onChangeOwners}
            />
        </Modal>
    );
};

export default CreateNewApplicationModal;
