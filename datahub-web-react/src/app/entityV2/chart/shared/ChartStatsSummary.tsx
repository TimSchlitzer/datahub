import { ClockCircleOutlined, EyeOutlined, QuestionCircleOutlined, TeamOutlined } from '@ant-design/icons';
import { Popover, Tooltip } from '@components';
import { Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import ExpandingStat from '@app/entityV2/dataset/shared/ExpandingStat';
import { StatsSummary } from '@app/entityV2/shared/components/styled/StatsSummary';
import { ANTD_GRAY } from '@app/entityV2/shared/constants';
import { PercentileLabel } from '@app/entityV2/shared/stats/PercentileLabel';
import { formatNumber, formatNumberWithoutAbbreviation } from '@app/shared/formatNumber';
import { toLocalDateTimeString, toRelativeTimeString } from '@app/shared/time/timeUtils';
import { countFormatter, needsFormatting } from '@utils/formatter';

const StatText = styled.span`
    color: ${ANTD_GRAY[8]};
`;

const HelpIcon = styled(QuestionCircleOutlined)`
    color: ${ANTD_GRAY[7]};
    padding-left: 4px;
`;

type Props = {
    chartCount?: number | null;
    viewCount?: number | null;
    viewCountLast30Days?: number | null;
    viewCountPercentileLast30Days?: number | null;
    uniqueUserCountLast30Days?: number | null;
    uniqueUserPercentileLast30Days?: number | null;
    lastUpdatedMs?: number | null;
    createdMs?: number | null;
};

export const ChartStatsSummary = ({
    chartCount,
    viewCount,
    viewCountLast30Days,
    viewCountPercentileLast30Days,
    uniqueUserCountLast30Days,
    uniqueUserPercentileLast30Days,
    lastUpdatedMs,
    createdMs,
}: Props) => {
    const { t } = useTranslation();
    // acryl-main only.
    const effectiveViewCount = (!!viewCountLast30Days && viewCountLast30Days) || viewCount;
    const effectiveViewCountText =
        (!!viewCountLast30Days && t('entity.chart.statsSummary.viewsLastMonth')) ||
        t('entity.chart.statsSummary.views');

    const statsViews = [
        (!!chartCount && (
            <ExpandingStat
                disabled={!needsFormatting(chartCount)}
                render={(isExpanded) => (
                    <StatText color={ANTD_GRAY[8]}>
                        <b>{isExpanded ? formatNumberWithoutAbbreviation(chartCount) : countFormatter(chartCount)}</b>{' '}
                        {t('entity.chart.statsSummary.charts')}
                    </StatText>
                )}
            />
        )) ||
            undefined,
        (!!effectiveViewCount && (
            <StatText>
                <EyeOutlined style={{ marginRight: 8, color: ANTD_GRAY[7] }} />
                {formatNumber(effectiveViewCount)} {effectiveViewCountText}
                {!!viewCountPercentileLast30Days && (
                    <PercentileLabel
                        percentile={viewCountPercentileLast30Days}
                        description={t('entity.chart.statsSummary.moreViewsThan', {
                            percentile: viewCountPercentileLast30Days,
                        })}
                    />
                )}
            </StatText>
        )) ||
            undefined,
        (!!uniqueUserCountLast30Days && (
            <StatText>
                <TeamOutlined style={{ marginRight: 8, color: ANTD_GRAY[7] }} />
                {formatNumber(uniqueUserCountLast30Days)} {t('entity.chart.statsSummary.users')}
                {!!uniqueUserPercentileLast30Days && (
                    <Typography.Text type="secondary">
                        <PercentileLabel
                            percentile={uniqueUserPercentileLast30Days}
                            description={t('entity.chart.statsSummary.moreUsersThan', {
                                percentile: uniqueUserPercentileLast30Days,
                            })}
                        />
                    </Typography.Text>
                )}
            </StatText>
        )) ||
            undefined,
        (!!lastUpdatedMs && (
            <Popover
                content={
                    <>
                        {createdMs && (
                            <div>
                                {t('entity.chart.statsSummary.createdOn', { date: toLocalDateTimeString(createdMs) })}
                            </div>
                        )}
                        <div>
                            {t('entity.chart.statsSummary.changedOn', { date: toLocalDateTimeString(lastUpdatedMs) })}{' '}
                            <Tooltip title={t('entity.chart.statsSummary.lastChangedTooltip')}>
                                <HelpIcon />
                            </Tooltip>
                        </div>
                    </>
                }
            >
                <StatText>
                    <ClockCircleOutlined style={{ marginRight: 8, color: ANTD_GRAY[7] }} />
                    {t('entity.chart.statsSummary.changed', { time: toRelativeTimeString(lastUpdatedMs) })}
                </StatText>
            </Popover>
        )) ||
            undefined,
    ].filter((stat) => stat !== undefined);

    return <>{statsViews.length > 0 && <StatsSummary stats={statsViews} />}</>;
};
