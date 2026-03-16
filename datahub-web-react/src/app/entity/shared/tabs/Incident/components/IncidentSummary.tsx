import { CheckCircleFilled, StopOutlined, WarningFilled } from '@ant-design/icons';
import { Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled, { useTheme } from 'styled-components';

import { FAILURE_COLOR_HEX, SUCCESS_COLOR_HEX } from '@app/entity/shared/tabs/Incident/incidentUtils';

const SummaryHeader = styled.div`
    width: 100%;
    height: 80px;
    padding-left: 40px;
    padding-top: 0px;
    display: flex;
    align-items: center;
    padding-top: 20px;
    padding-bottom: 20px;
`;

const SummaryContainer = styled.div``;

const SummaryMessage = styled.div`
    display: inline-block;
    margin-left: 20px;
`;

const SummaryTitle = styled(Typography.Title)`
    && {
        padding-bottom: 0px;
        margin-bottom: 0px;
    }
`;

export type IncidentsSummary = {
    totalIncident: number;
    resolvedIncident: number;
    activeIncident: number;
};

type Props = {
    summary: IncidentsSummary;
};

const getSummaryIcon = (summary: IncidentsSummary, theme: any) => {
    if (summary.totalIncident === 0) {
        return <StopOutlined style={{ color: theme.colors.iconDisabled, fontSize: 28 }} />;
    }
    if (summary.resolvedIncident === summary.totalIncident) {
        return <CheckCircleFilled style={{ color: SUCCESS_COLOR_HEX, fontSize: 28 }} />;
    }
    return <WarningFilled style={{ color: FAILURE_COLOR_HEX, fontSize: 28 }} />;
};

const getSummaryMessage = (summary: IncidentsSummary, t: any) => {
    if (summary.totalIncident === 0) {
        return t('incident.noIncidentsRaised');
    }
    if (summary.resolvedIncident === summary.totalIncident) {
        return t('incident.noActiveIncidents');
    }
    if (summary.activeIncident === 1) {
        return t('incident.activeIncidentSingle', { count: summary.activeIncident });
    }
    if (summary.activeIncident > 1) {
        return t('incident.activeIncidentsPlural', { count: summary.activeIncident });
    }
    return null;
};

export const IncidentSummary = ({ summary }: Props) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const summaryIcon = getSummaryIcon(summary, theme);
    const summaryMessage = getSummaryMessage(summary, t);
    const subtitleMessage = t('incident.summarySubtitle', {
        active: summary.activeIncident,
        resolved: summary.resolvedIncident,
    });
    return (
        <SummaryHeader>
            <SummaryContainer>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {summaryIcon}
                    <SummaryMessage>
                        <SummaryTitle level={5}>{summaryMessage}</SummaryTitle>
                        <Typography.Text type="secondary">{subtitleMessage}</Typography.Text>
                    </SummaryMessage>
                </div>
            </SummaryContainer>
        </SummaryHeader>
    );
};
