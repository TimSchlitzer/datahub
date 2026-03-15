import React from 'react';
import { useTranslation } from 'react-i18next';

import LineageTabTimeSelector from '@app/entityV2/shared/tabs/Lineage/LineageTabTimeSelector';
import { ControlPanel, ControlPanelSubtext, ControlPanelTitle } from '@app/lineageV3/controls/common';

const LineageTimeRangeControls = () => {
    const { t } = useTranslation();
    return (
        <ControlPanel>
            <ControlPanelTitle>{t('lineage.timeRangeTitle')}</ControlPanelTitle>
            <ControlPanelSubtext>{t('lineage.timeRangeSubtitle')}</ControlPanelSubtext>
            <LineageTabTimeSelector />
        </ControlPanel>
    );
};

export default LineageTimeRangeControls;
