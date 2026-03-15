import { Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { ANTD_GRAY } from '@app/entityV2/shared/constants';

export const EntityCountText = styled(Typography.Text)`
    display: inline-block;
    font-size: 12px;
    line-height: 20px;
    font-weight: 400;
    color: ${ANTD_GRAY[7]};
`;

interface Props {
    entityCount?: number;
    displayAssetsText?: boolean;
}

function EntityCount(props: Props) {
    const { entityCount, displayAssetsText } = props;
    const { t } = useTranslation();

    if (!entityCount || entityCount <= 0)
        return (
            <EntityCountText className="entityCount">
                0 {t('entityV2.containers.profile.header.entityCount.assets')}
            </EntityCountText>
        );

    return (
        <EntityCountText className="entityCount">
            {entityCount.toLocaleString()}{' '}
            {displayAssetsText ? (
                <>
                    {entityCount === 1
                        ? t('entityV2.containers.profile.header.entityCount.asset')
                        : t('entityV2.containers.profile.header.entityCount.assets')}
                </>
            ) : (
                <>
                    {entityCount === 1
                        ? t('entityV2.containers.profile.header.entityCount.entity')
                        : t('entityV2.containers.profile.header.entityCount.entities')}
                </>
            )}
        </EntityCountText>
    );
}

export default EntityCount;
