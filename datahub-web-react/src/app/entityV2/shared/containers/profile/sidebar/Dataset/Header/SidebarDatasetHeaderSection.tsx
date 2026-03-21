import { Tooltip } from '@components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { useEntityData } from '@app/entity/shared/EntityContext';
import { REDESIGN_COLORS } from '@app/entityV2/shared/constants';
import { SidebarHeaderSectionColumns } from '@app/entityV2/shared/containers/profile/sidebar/SidebarHeaderSectionColumns';
import SidebarTopUsersHeaderSection from '@app/entityV2/shared/containers/profile/sidebar/shared/SidebarTopUsersHeaderSection';
import {
    getDatasetPopularityTier,
    isValuePresent,
    userExists,
} from '@app/entityV2/shared/containers/profile/sidebar/shared/utils';
import { SidebarStatsColumn, getPopularityColumn } from '@app/entityV2/shared/containers/profile/utils';
import CompactContext from '@app/shared/CompactContext';
import { formatBytes, formatNumber, formatNumberWithoutAbbreviation } from '@app/shared/formatNumber';

const StatContent = styled.div`
    color: ${REDESIGN_COLORS.FOUNDATION_BLUE_4};
    font-size: 12px;
    font-weight: 600;
`;

const SidebarDatasetHeaderSection = () => {
    const { t } = useTranslation();
    const { entityData } = useEntityData();
    const dataset = entityData as any;

    const isCompact = React.useContext(CompactContext);

    const columns: SidebarStatsColumn[] = [];

    const latestFullTableProfile = dataset?.latestFullTableProfile?.[0];
    const latestPartitionProfile = dataset?.latestPartitionProfile?.[0];

    const maybeLastProfile = latestFullTableProfile || latestPartitionProfile || undefined;

    /**
     * Popularity tab
     */
    const popularityColumn = getPopularityColumn(
        getDatasetPopularityTier(
            dataset?.statsSummary?.queryCountPercentileLast30Days,
            dataset?.statsSummary?.uniqueUserPercentileLast30Days,
        ),
    );
    if (popularityColumn) {
        columns.push(popularityColumn);
    }

    /**
     * Top users tab
     */
    if (
        dataset?.statsSummary?.topUsersLast30Days &&
        dataset?.statsSummary?.topUsersLast30Days?.find((user) => userExists(user))
    ) {
        columns.push({
            title: t('entity.dataset.header.topUsers'),
            content: (
                <Tooltip showArrow={false} title={t('entity.dataset.header.topUsersTooltip')}>
                    <SidebarTopUsersHeaderSection />
                </Tooltip>
            ),
        });
    }

    /**
     * Queries column
     */
    if (dataset?.statsSummary?.queryCountLast30Days) {
        columns.push({
            title: t('entity.dataset.header.queries'),
            content: (
                <Tooltip
                    showArrow={false}
                    title={t('entity.dataset.header.queriesTooltip', {
                        count: formatNumberWithoutAbbreviation(dataset?.statsSummary?.queryCountLast30Days),
                    })}
                >
                    <StatContent>{formatNumber(dataset?.statsSummary?.queryCountLast30Days)} {t('entity.dataset.header.queries').toLowerCase()}</StatContent>
                </Tooltip>
            ),
        });
    }

    /**
     * Users column
     */
    if (dataset?.statsSummary?.uniqueUserCountLast30Days) {
        columns.push({
            title: t('entity.dataset.header.users'),
            content: (
                <Tooltip
                    showArrow={false}
                    title={t('entity.dataset.header.usersTooltip', {
                        count: formatNumberWithoutAbbreviation(dataset?.statsSummary?.uniqueUserCountLast30Days),
                    })}
                >
                    <StatContent>{formatNumber(dataset?.statsSummary?.uniqueUserCountLast30Days)} {t('entity.dataset.header.users').toLowerCase()}</StatContent>
                </Tooltip>
            ),
        });
    }

    /**
     * Rows column
     */
    if (isValuePresent(maybeLastProfile?.rowCount)) {
        columns.push({
            title: t('entity.dataset.header.rows'),
            content: (
                <Tooltip
                    showArrow={false}
                    title={t('entity.dataset.header.rowsTooltip', {
                        count: formatNumberWithoutAbbreviation(maybeLastProfile?.rowCount),
                    })}
                >
                    <StatContent>{formatNumber(maybeLastProfile?.rowCount)} {t('entity.dataset.header.rows').toLowerCase()}</StatContent>
                </Tooltip>
            ),
        });
    }

    /**
     * Column column
     */
    if (isValuePresent(maybeLastProfile?.columnCount)) {
        columns.push({
            title: t('entity.dataset.header.columnsCount'),
            content: <StatContent>{formatNumber(maybeLastProfile?.columnCount)} {t('entity.dataset.header.columnsCount').toLowerCase()}</StatContent>,
        });
    }

    /**
     * Size column
     */
    if (isValuePresent(maybeLastProfile?.sizeInBytes)) {
        const formattedBytes = formatBytes(maybeLastProfile?.sizeInBytes, 0);
        const { number, unit } = formattedBytes;
        columns.push({
            title: t('entity.dataset.header.size'),
            content: (
                <Tooltip
                    showArrow={false}
                    title={t('entity.dataset.header.storageBytes', {
                        count: formatNumberWithoutAbbreviation(maybeLastProfile?.sizeInBytes),
                    })}
                >
                    <StatContent>
                        {number} {unit}
                    </StatContent>
                </Tooltip>
            ),
        });
    }

    if (!columns.length && !isCompact) {
        return null;
    }

    return <SidebarHeaderSectionColumns columns={columns} />;
};

export default SidebarDatasetHeaderSection;
