import { Tooltip } from '@components';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';

import { ANTD_GRAY } from '@app/entity/shared/constants';
import { LineageTabContext } from '@app/entityV2/shared/tabs/Lineage/LineageTabContext';
import ColumnsRelationshipText from '@app/previewV2/EntityPaths/ColumnsRelationshipText';
import DisplayedColumns from '@app/previewV2/EntityPaths/DisplayedColumns';

import { EntityPath, EntityType, LineageDirection, SchemaFieldEntity } from '@types';

export const ResultText = styled.span`
    white-space: nowrap;
    &:hover {
        border-bottom: 1px solid black;
        cursor: pointer;
    }
`;

const DescriptionWrapper = styled.span`
    color: ${ANTD_GRAY[8]};
    white-space: nowrap;
`;

export function getDisplayedColumns(paths: EntityPath[], resultEntityUrn: string) {
    return paths
        .map((path) =>
            path.path?.filter(
                (entity) =>
                    entity?.type === EntityType.SchemaField &&
                    (entity as SchemaFieldEntity).parent.urn === resultEntityUrn,
            ),
        )
        .flat();
}

interface Props {
    paths: EntityPath[];
    resultEntityUrn: string;
    openModal: () => void;
}

export default function ColumnPathsText({ paths, resultEntityUrn, openModal }: Props) {
    const { t } = useTranslation();
    const { lineageDirection } = useContext(LineageTabContext);

    const displayedColumns = getDisplayedColumns(paths, resultEntityUrn);

    if (!displayedColumns.length) return null;

    const directionLabel =
        lineageDirection === LineageDirection.Downstream ? t('preview.downstream') : t('preview.upstream');

    return (
        <>
            <DescriptionWrapper>
                {directionLabel} {t('preview.entityPaths.column', { count: displayedColumns.length })}:&nbsp;
            </DescriptionWrapper>
            <ResultText onClick={openModal}>
                <Tooltip
                    title={
                        <span>
                            {t('preview.entityPaths.clickToSeeColumnPath', { count: paths.length })}{' '}
                            <ColumnsRelationshipText displayedColumns={displayedColumns} />
                        </span>
                    }
                >
                    <span>
                        <DisplayedColumns displayedColumns={displayedColumns} />
                    </span>
                </Tooltip>
            </ResultText>
        </>
    );
}
