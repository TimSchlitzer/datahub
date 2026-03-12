import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { StatsProps } from '@app/entityV2/shared/tabs/Dataset/Schema/components/SchemaFieldDrawer/StatsSidebarView';
import Metric from '@app/entityV2/shared/tabs/Dataset/Schema/components/SchemaFieldDrawer/StatsV2/components/sections/StatsAndInsights/components/Metric';
import useStatsTabContext from '@app/entityV2/shared/tabs/Dataset/Schema/components/SchemaFieldDrawer/StatsV2/hooks/useStatsTabContext';
import { formatNumber } from '@app/entityV2/shared/tabs/Dataset/Schema/components/SchemaFieldDrawer/StatsV2/utils';
import { isValuePresent } from '@src/app/entityV2/shared/containers/profile/sidebar/shared/utils';
import { SchemaFieldDataType } from '@src/types.generated';

const MetricsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;

    & div {
        // two metrics in a row
        flex: 50%;
    }
`;

interface MetricRenderingRules {
    label: string;
    key: string;
    value: (properties?: StatsProps['properties']) => string | undefined | null;
    isHidden?: (properties?: StatsProps['properties']) => boolean;
}

const EMPTY_VALUE = '-';

function getMetricsConfig(t: any): MetricRenderingRules[] {
    return [
        {
            label: t('entity.dataset.schema.statsV2.nullCount'),
            key: 'null-count',
            value: (properties) => formatNumber(properties?.fieldProfile?.nullCount),
            isHidden: (properties) => !properties?.expandedField?.nullable,
        },
        {
            label: t('entity.dataset.schema.statsV2.nullPct'),
            key: 'null-percent',
            value: (properties) => {
                const nullProportion = properties?.fieldProfile?.nullProportion;
                if (!isValuePresent(nullProportion)) return null;
                const nullPercent = (nullProportion as number) * 100;
                return formatNumber(nullPercent)?.concat('%');
            },
            isHidden: (properties) => !properties?.expandedField?.nullable,
        },
        {
            label: t('entity.dataset.schema.statsV2.distinctCount'),
            key: 'distinct-count',
            value: (properties) => formatNumber(properties?.fieldProfile?.uniqueCount),
        },
        {
            label: t('entity.dataset.schema.statsV2.distinctPct'),
            key: 'distinct-percent',
            value: (properties) => {
                const uniqueProportion = properties?.fieldProfile?.uniqueProportion;
                if (!isValuePresent(uniqueProportion)) return null;
                const uniquePercent = (uniqueProportion as number) * 100;
                return formatNumber(uniquePercent)?.concat('%');
            },
        },
        {
            label: t('entity.dataset.schema.statsV2.max'),
            key: 'max',
            value: (properties) => {
                const max = properties?.fieldProfile?.max;
                if (!isValuePresent(max)) return null;
                return formatNumber(parseFloat(max as string));
            },
            isHidden: (properties) => {
                const fieldType = properties?.expandedField?.type;
                if (fieldType === undefined) return true;
                return ![SchemaFieldDataType.Number, SchemaFieldDataType.Date, SchemaFieldDataType.Time].includes(
                    fieldType,
                );
            },
        },
        {
            label: t('entity.dataset.schema.statsV2.min'),
            key: 'min',
            value: (properties) => {
                const min = properties?.fieldProfile?.min;
                if (!isValuePresent(min)) return null;
                return formatNumber(parseFloat(min as string));
            },
            isHidden: (properties) => {
                const fieldType = properties?.expandedField?.type;
                if (fieldType === undefined) return true;
                return ![SchemaFieldDataType.Number, SchemaFieldDataType.Date, SchemaFieldDataType.Time].includes(
                    fieldType,
                );
            },
        },
        {
            label: t('entity.dataset.schema.statsV2.median'),
            key: 'median',
            value: (properties) => {
                const median = properties?.fieldProfile?.median;
                if (!isValuePresent(median)) return null;
                return formatNumber(parseFloat(median as string));
            },
            isHidden: (properties) => properties?.expandedField?.type !== SchemaFieldDataType.Number,
        },
        {
            label: t('entity.dataset.schema.statsV2.stdDev'),
            key: 'standard-deviation',
            value: (properties) => {
                const stdev = parseFloat(`${properties?.fieldProfile?.stdev}`);
                const mean = parseFloat(`${properties?.fieldProfile?.mean}`);

                if (Number.isNaN(stdev) || Number.isNaN(mean)) return null;
                const stdevPercent = (stdev / mean) * 100;

                return formatNumber(stdevPercent)?.concat('%');
            },
            isHidden: (properties) => properties?.expandedField?.type !== SchemaFieldDataType.Number,
        },
    ];
}

export default function Metrics() {
    const { t } = useTranslation();
    const { properties } = useStatsTabContext();
    const METRICS = useMemo(() => getMetricsConfig(t), [t]);

    return (
        <MetricsContainer>
            {METRICS.map((metric) => {
                if (metric.isHidden?.(properties)) return null;
                const value = metric.value(properties);
                return (
                    <Metric
                        label={metric.label}
                        value={value || EMPTY_VALUE}
                        key={metric.key}
                        dataTestId={metric.key}
                    />
                );
            })}
        </MetricsContainer>
    );
}
