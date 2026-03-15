import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { FAILURE_COLOR_HEX, SUCCESS_COLOR_HEX } from '@components/theme/foundations/colors';

import { TestResultType } from '@types';

/**
 * Returns the display text assoociated with an Test Result Type
 */
export const getResultText = (result: TestResultType, t?: any) => {
    if (!t) {
        // Fallback for when t is not available
        switch (result) {
            case TestResultType.Success:
                return 'Passing';
            case TestResultType.Failure:
                return 'Failing';
            default:
                throw new Error(`Unsupported Test Result Type ${result} provided.`);
        }
    }
    switch (result) {
        case TestResultType.Success:
            return t('entity.governance.testResults.status.passing');
        case TestResultType.Failure:
            return t('entity.governance.testResults.status.failing');
        default:
            throw new Error(`Unsupported Test Result Type ${result} provided.`);
    }
};

/**
 * Returns the display color assoociated with an TestResultType
 */

export const getResultColor = (result: TestResultType) => {
    switch (result) {
        case TestResultType.Success:
            return SUCCESS_COLOR_HEX;
        case TestResultType.Failure:
            return FAILURE_COLOR_HEX;
        default:
            throw new Error(`Unsupported Test Result Type ${result} provided.`);
    }
};

/**
 * Returns the display icon assoociated with an TestResultType
 */
export const getResultIcon = (result: TestResultType) => {
    const resultColor = getResultColor(result);
    switch (result) {
        case TestResultType.Success:
            return <CheckCircleOutlined style={{ color: resultColor }} />;
        case TestResultType.Failure:
            return <CloseCircleOutlined style={{ color: resultColor }} />;
        default:
            throw new Error(`Unsupported Test Result Type ${result} provided.`);
    }
};
