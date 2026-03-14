import React from 'react';
import { useTranslation } from 'react-i18next';

import { SidebarSection } from '@app/entityV2/shared/containers/profile/sidebar/SidebarSection';
import { SchemaTab } from '@app/entityV2/shared/tabs/Dataset/Schema/SchemaTab';
import { TabRenderType } from '@app/entityV2/shared/types';
import { ENTITY_PROFILE_SCHEMA_ID } from '@app/onboarding/config/EntityProfileOnboardingConfig';

export const SidebarCompactSchemaSection = () => {
    const { t } = useTranslation();
    return (
        <div id={ENTITY_PROFILE_SCHEMA_ID}>
            <SidebarSection title={t('entity.shared.sidebar.fields')} content={<SchemaTab renderType={TabRenderType.COMPACT} />} />
        </div>
    );
};
