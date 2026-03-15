import { CheckCircleFilled, CloseCircleFilled, StopOutlined } from '@ant-design/icons';
import { Tooltip } from '@components';
import { Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { FAILURE_COLOR_HEX, SUCCESS_COLOR_HEX } from '@components/theme/foundations/colors';

import { ANTD_GRAY } from '@app/entityV2/shared/constants';

const SummaryHeader = styled.div`
    width: 100%;
    padding-left: 40px;
    padding-top: 20px;
    padding-bottom: 20px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid ${ANTD_GRAY[4.5]};
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

export type TestsSummary = {
    failing: number;
    passing: number;
    total: number;
};

type Props = {
    summary: TestsSummary;
};

const getSummaryIcon = (summary: TestsSummary) => {
    if (summary.total === 0) {
        return <StopOutlined style={{ color: ANTD_GRAY[6], fontSize: 28 }} />;
    }
    if (summary.passing === summary.total) {
        return <CheckCircleFilled style={{ color: SUCCESS_COLOR_HEX, fontSize: 28 }} />;
    }
    return <CloseCircleFilled style={{ color: FAILURE_COLOR_HEX, fontSize: 28 }} />;
};

const getSummaryMessage = (summary: TestsSummary, t: any) => {
    if (summary.total === 0) {
        return t('entity.governance.testResults.summary.noTestsHaveRun');
    }
    if (summary.passing === summary.total) {
        return t('entity.governance.testResults.summary.allTestsPassing');
    }
    if (summary.failing === summary.total) {
        return t('entity.governance.testResults.summary.allTestsFailing');
    }
    return t('entity.governance.testResults.summary.someTestsFailing');
};

export const TestResultsSummary = ({ summary }: Props) => {
    const { t } = useTranslation();
    const summaryIcon = getSummaryIcon(summary);
    const summaryMessage = getSummaryMessage(summary, t);
    const subtitleMessage = t('entity.governance.testResults.summary.passingTests', {
        passing: summary.passing,
        failing: summary.failing,
    });
    return (
        <SummaryHeader>
            <SummaryContainer>
                <Tooltip title={t('entity.governance.testResults.summary.tooltip')}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {summaryIcon}
                        <SummaryMessage>
                            <SummaryTitle level={5}>{summaryMessage}</SummaryTitle>
                            <Typography.Text type="secondary">{subtitleMessage}</Typography.Text>
                        </SummaryMessage>
                    </div>
                </Tooltip>
            </SummaryContainer>
        </SummaryHeader>
    );
};
