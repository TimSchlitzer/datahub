import { Collapse } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
    CheckboxContainer,
    CollapseHeader,
    CompoundedItemWrapper,
    StyledCollapse,
    StyledFormItem,
    StyledFormSubItem,
    TogglesContainer,
} from '@app/govern/structuredProperties/styledComponents';
import { StructuredProp, canBeAssetBadge, getDisplayName } from '@app/govern/structuredProperties/utils';
import { Checkbox, Icon, Pill, Switch, Text } from '@src/alchemy-components';
import { ConfirmationModal } from '@src/app/sharedV2/modals/ConfirmationModal';
import { useUpdateStructuredPropertyMutation } from '@src/graphql/structuredProperties.generated';
import { AllowedValue, StructuredPropertyEntity } from '@src/types.generated';

const SCHEMA_FIELD_URN = 'urn:li:entityType:datahub.schemaField';

interface Props {
    formValues: StructuredProp | undefined;
    handleDisplaySettingChange: (settingField: string, value: boolean) => void;
    selectedValueType: string;
    refetchProperties: () => void;
    allowedValues?: AllowedValue[];
    badgeProperty?: StructuredPropertyEntity;
}

const DisplayPreferences = ({
    formValues,
    handleDisplaySettingChange,
    selectedValueType,
    refetchProperties,
    allowedValues,
    badgeProperty,
}: Props) => {
    const { t } = useTranslation();
    const [updateProperty] = useUpdateStructuredPropertyMutation();
    const [showReplaceBadge, setShowReplaceBadge] = useState<boolean>(false);

    const handleReplaceClose = () => {
        setShowReplaceBadge(false);
    };

    function updateBadgePropertyToOff() {
        if (badgeProperty) {
            updateProperty({
                variables: { input: { urn: badgeProperty.urn, settings: { showAsAssetBadge: false } } },
            }).then(() => refetchProperties());
        }
    }

    const hasAssetBadgeEnabled = formValues?.settings?.showAsAssetBadge;
    const showInColumnsTable = formValues?.settings?.showInColumnsTable;
    const hasColumnEntityType = formValues?.entityTypes?.includes(SCHEMA_FIELD_URN);

    return (
        <>
            <StyledCollapse
                ghost
                expandIcon={({ isActive }) => (
                    <Icon icon="ChevronRight" color="gray" size="4xl" rotate={isActive ? '90' : '0'} />
                )}
                expandIconPosition="end"
                defaultActiveKey={[1]}
            >
                <Collapse.Panel
                    key={1}
                    header={
                        <CollapseHeader>
                            <Text weight="bold" color="gray">
                                {t('govern.structuredProperties.displayPreferences.label')}
                            </Text>
                        </CollapseHeader>
                    }
                    forceRender
                >
                    <TogglesContainer>
                        <StyledFormItem name={['settings', 'isHidden']}>
                            <Switch
                                label={t('govern.structuredProperties.displayPreferences.hideProperty')}
                                size="sm"
                                checked={formValues?.settings?.isHidden}
                                onChange={(e) => handleDisplaySettingChange('isHidden', e.target.checked)}
                                labelHoverText={t('govern.structuredProperties.displayPreferences.hidePropertyTooltip')}
                                data-testid="structured-props-hide-switch"
                            />
                        </StyledFormItem>
                        <StyledFormItem name={['settings', 'showInSearchFilters']}>
                            <Switch
                                label={t('govern.structuredProperties.displayPreferences.showInSearchFilters')}
                                size="sm"
                                checked={formValues?.settings?.showInSearchFilters}
                                onChange={(e) => handleDisplaySettingChange('showInSearchFilters', e.target.checked)}
                                isDisabled={formValues?.settings?.isHidden}
                                labelHoverText={t('govern.structuredProperties.displayPreferences.showInSearchFiltersTooltip')}
                            />
                        </StyledFormItem>
                        <CompoundedItemWrapper>
                            <StyledFormItem name={['settings', 'showInAssetSummary']}>
                                <Switch
                                    label={t('govern.structuredProperties.displayPreferences.showInAssetSidebar')}
                                    size="sm"
                                    checked={formValues?.settings?.showInAssetSummary}
                                    onChange={(e) => handleDisplaySettingChange('showInAssetSummary', e.target.checked)}
                                    isDisabled={formValues?.settings?.isHidden}
                                    labelHoverText={t('govern.structuredProperties.displayPreferences.showInAssetSidebarTooltip')}
                                    data-testid="structured-props-show-in-asset-summary-switch"
                                />
                            </StyledFormItem>
                            {formValues?.settings?.showInAssetSummary && (
                                <StyledFormSubItem name={['settings', 'hideInAssetSummaryWhenEmpty']}>
                                    <CheckboxContainer>
                                        <Checkbox
                                            label={t('govern.structuredProperties.displayPreferences.hideWhenEmpty')}
                                            isChecked={formValues?.settings?.hideInAssetSummaryWhenEmpty}
                                            labelTooltip={t('govern.structuredProperties.displayPreferences.hideWhenEmptyTooltip')}
                                            size="sm"
                                            gap="2px"
                                            onCheckboxChange={(isChecked) =>
                                                handleDisplaySettingChange('hideInAssetSummaryWhenEmpty', isChecked)
                                            }
                                            justifyContent="flex-start"
                                            dataTestId="structured-props-hide-in-asset-summary-when-empty-checkbox"
                                            shouldHandleLabelClicks
                                        />
                                    </CheckboxContainer>
                                </StyledFormSubItem>
                            )}
                        </CompoundedItemWrapper>
                        <StyledFormItem name={['settings', 'showAsAssetBadge']}>
                            <Switch
                                label={t('govern.structuredProperties.displayPreferences.showAsAssetBadge')}
                                size="sm"
                                checked={formValues?.settings?.showAsAssetBadge === true}
                                onChange={(e) => {
                                    if (badgeProperty && e.target.checked) setShowReplaceBadge(true);
                                    else handleDisplaySettingChange('showAsAssetBadge', e.target.checked);
                                }}
                                isDisabled={
                                    !hasAssetBadgeEnabled &&
                                    (formValues?.settings?.isHidden ||
                                        !canBeAssetBadge(selectedValueType, allowedValues))
                                }
                                labelHoverText={t('govern.structuredProperties.displayPreferences.showAsAssetBadgeTooltip')}
                                disabledHoverText={t('govern.structuredProperties.displayPreferences.showAsAssetBadgeDisabledTooltip')}
                            />
                        </StyledFormItem>
                        <StyledFormItem name={['settings', 'showInColumnsTable']}>
                            <Switch
                                label={t('govern.structuredProperties.displayPreferences.showInColumnsTable')}
                                size="sm"
                                checked={formValues?.settings?.showInColumnsTable}
                                onChange={(e) => handleDisplaySettingChange('showInColumnsTable', e.target.checked)}
                                isDisabled={
                                    !showInColumnsTable && (formValues?.settings?.isHidden || !hasColumnEntityType)
                                }
                                labelHoverText={t('govern.structuredProperties.displayPreferences.showInColumnsTableTooltip')}
                                disabledHoverText={t('govern.structuredProperties.displayPreferences.showInColumnsTableDisabledTooltip')}
                                data-testid="structured-props-show-in-columns-table-switch"
                            />
                        </StyledFormItem>
                    </TogglesContainer>
                </Collapse.Panel>
            </StyledCollapse>
            {badgeProperty && (
                <ConfirmationModal
                    isOpen={showReplaceBadge}
                    handleClose={handleReplaceClose}
                    handleConfirm={() => {
                        handleDisplaySettingChange('showAsAssetBadge', true);
                        setShowReplaceBadge(false);
                        updateBadgePropertyToOff();
                    }}
                    confirmButtonText={t('govern.structuredProperties.displayPreferences.updatePropertyModal.confirmButtonText')}
                    modalTitle={t('govern.structuredProperties.displayPreferences.updatePropertyModal.title')}
                    modalText={
                        <p>
                            <span>Another property </span>
                            <Pill label={getDisplayName(badgeProperty)} size="sm" color="violet" clickable={false} />
                            &nbsp;is already being shown on asset previews, but only one property is allowed at a time.
                            Do you want to replace the current property? This will hide {getDisplayName(
                                badgeProperty,
                            )}{' '}
                            on all asset previews.
                        </p>
                    }
                />
            )}
        </>
    );
};

export default DisplayPreferences;
