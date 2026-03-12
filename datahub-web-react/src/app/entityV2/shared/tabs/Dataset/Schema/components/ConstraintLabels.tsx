import { blue, green } from '@ant-design/colors';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { ANTD_GRAY } from '@app/entityV2/shared/constants';

const Pill = styled.div`
    background-color: ${ANTD_GRAY[1]};
    border-radius: 10px;
    border: 1px solid;
    font-size: 12px;
    font-weight: 400;

    padding: 0 8px;
`;

const PrimaryKeyPill = styled(Pill)`
    color: ${blue[5]} !important;
    border-color: ${blue[2]};
`;

const ForeignKeyPill = styled(Pill)`
    color: ${green[5]} !important;
    border-color: ${green[2]};
`;

const NullablePill = styled(Pill)`
    color: ${ANTD_GRAY[7]} !important;
    border-color: ${ANTD_GRAY[7]};
`;

export function PrimaryKeyLabel() {
    const { t } = useTranslation();
    return <PrimaryKeyPill>{t('entity.dataset.schema.constraints.primaryKey')}</PrimaryKeyPill>;
}

export function ForeignKeyLabel() {
    const { t } = useTranslation();
    return <ForeignKeyPill>{t('entity.dataset.schema.constraints.foreignKey')}</ForeignKeyPill>;
}

export function PartitioningKeyLabel() {
    const { t } = useTranslation();
    return <PrimaryKeyPill>{t('entity.dataset.schema.constraints.partitionKey')}</PrimaryKeyPill>;
}

export default function NullableLabel() {
    const { t } = useTranslation();
    return <NullablePill>{t('entity.dataset.schema.constraints.nullable')}</NullablePill>;
}
