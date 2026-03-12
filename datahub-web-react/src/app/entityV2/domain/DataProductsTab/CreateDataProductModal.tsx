import { Modal } from '@components';
import { message } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import DataProductBuilderForm from '@app/entityV2/domain/DataProductsTab/DataProductBuilderForm';
import { DataProductBuilderState } from '@app/entityV2/domain/DataProductsTab/types';
import { useReloadableContext } from '@app/sharedV2/reloadableContext/hooks/useReloadableContext';
import { ReloadableKeyTypeNamespace } from '@app/sharedV2/reloadableContext/types';
import { getReloadableKeyType } from '@app/sharedV2/reloadableContext/utils';

import { useCreateDataProductMutation } from '@graphql/dataProduct.generated';
import { DataHubPageModuleType, DataProduct, Domain } from '@types';

const DEFAULT_STATE = {
    name: '',
};

type Props = {
    domain: Domain;
    onClose: () => void;
    onCreateDataProduct: (dataProduct: DataProduct) => void;
};

export default function CreateDataProductModal({ domain, onCreateDataProduct, onClose }: Props) {
    const { t } = useTranslation();
    const [builderState, updateBuilderState] = useState<DataProductBuilderState>(DEFAULT_STATE);
    const [createDataProductMutation] = useCreateDataProductMutation();
    const { reloadByKeyType } = useReloadableContext();

    function createDataProduct() {
        createDataProductMutation({
            variables: {
                input: {
                    domainUrn: domain.urn,
                    properties: {
                        name: builderState.name,
                        description: builderState.description || undefined,
                    },
                },
            },
        })
            .then(({ data, errors }) => {
                if (!errors) {
                    message.success(t('entity.domain.dataProductsTab.messages.created'));
                    if (data?.createDataProduct) {
                        const updateDataProduct = { ...data.createDataProduct, domain: { domain } };
                        onCreateDataProduct(updateDataProduct as DataProduct);
                    }
                    onClose();
                    // Reload modules
                    // DataProducts - handling of creating of new data product from data products tab
                    reloadByKeyType(
                        [getReloadableKeyType(ReloadableKeyTypeNamespace.MODULE, DataHubPageModuleType.DataProducts)],
                        3000,
                    );
                }
            })
            .catch(() => {
                onClose();
                message.destroy();
                message.error({ content: t('entity.domain.dataProductsTab.messages.error') });
            });
    }

    return (
        <Modal
            title={t('entity.domain.dataProductsTab.modal.title')}
            onCancel={onClose}
            open
            width={725}
            buttons={[
                {
                    text: t('entity.domain.dataProductsTab.modal.cancel'),
                    variant: 'text',
                    onClick: onClose,
                    buttonDataTestId: 'cancel-button',
                },
                {
                    text: t('entity.domain.dataProductsTab.modal.create'),
                    onClick: createDataProduct,
                    variant: 'filled',
                    disabled: !builderState.name,
                    buttonDataTestId: 'submit-button',
                },
            ]}
            data-testid="create-data-product-modal"
        >
            <DataProductBuilderForm builderState={builderState} updateBuilderState={updateBuilderState} />
        </Modal>
    );
}
