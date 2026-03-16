import { Form, FormInstance } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

import AllowedValuesField from '@app/govern/structuredProperties/AllowedValuesField';
import RequiredAsterisk from '@app/govern/structuredProperties/RequiredAsterisk';
import {
    FieldLabel,
    FlexContainer,
    RowContainer,
    SubTextContainer,
} from '@app/govern/structuredProperties/styledComponents';
import useStructuredProp from '@app/govern/structuredProperties/useStructuredProp';
import {
    APPLIES_TO_ENTITIES,
    PropValueField,
    SEARCHABLE_ENTITY_TYPES,
    StructuredProp,
    isEntityTypeSelected,
} from '@app/govern/structuredProperties/utils';
import { Icon, SimpleSelect, Text, Tooltip } from '@src/alchemy-components';
import { AllowedValue, PropertyCardinality, StructuredPropertyEntity } from '@src/types.generated';

interface Props {
    selectedProperty: StructuredPropertyEntity | undefined;
    form: FormInstance;
    formValues: StructuredProp | undefined;
    setFormValues: React.Dispatch<React.SetStateAction<StructuredProp | undefined>>;
    setCardinality: React.Dispatch<React.SetStateAction<PropertyCardinality>>;
    isEditMode: boolean;
    selectedValueType: string;
    setSelectedValueType: React.Dispatch<React.SetStateAction<string>>;
    allowedValues: AllowedValue[] | undefined;
    valueField: PropValueField;
    setShowAllowedValuesDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

const StructuredPropsFormSection = ({
    selectedProperty,
    form,
    formValues,
    setFormValues,
    isEditMode,
    setCardinality,
    selectedValueType,
    setSelectedValueType,
    allowedValues,
    valueField,
    setShowAllowedValuesDrawer,
}: Props) => {
    const { t } = useTranslation();
    const {
        handleSelectChange,
        handleSelectUpdateChange,
        getEntitiesListOptions,
        disabledEntityTypeValues,
        disabledTypeQualifierValues,
    } = useStructuredProp({
        selectedProperty,
        form,
        setFormValues,
        setCardinality,
        setSelectedValueType,
    });

    return (
        <>
            {!(isEditMode && !allowedValues) && (
                <AllowedValuesField
                    selectedValueType={selectedValueType}
                    allowedValues={allowedValues}
                    valueField={valueField}
                    setShowAllowedValuesDrawer={setShowAllowedValuesDrawer}
                />
            )}
            {isEntityTypeSelected(selectedValueType) && (
                <RowContainer>
                    <FieldLabel>
                        <FlexContainer>
                            {t('govern.structuredProperties.formSection.allowedEntityTypes')}
                            <Tooltip
                                title={t('govern.structuredProperties.formSection.allowedEntityTypesTooltip')}
                                showArrow={false}
                            >
                                <Icon icon="Info" color="violet" size="lg" />
                            </Tooltip>
                        </FlexContainer>
                        {isEditMode && (
                            <SubTextContainer>
                                <Text size="sm" weight="medium">
                                    <Tooltip
                                        title={t('govern.structuredProperties.formSection.allowedEntityTypesAddOnlyTooltip')}
                                        showArrow={false}
                                    >
                                        {t('govern.structuredProperties.formSection.allowedEntityTypesAddOnly')}
                                    </Tooltip>
                                </Text>
                            </SubTextContainer>
                        )}
                    </FieldLabel>
                    <Tooltip
                        title={
                            !formValues?.typeQualifier?.allowedTypes?.length &&
                            t('govern.structuredProperties.formSection.allowedEntityTypesAnyWarning')
                        }
                        showArrow={false}
                    >
                        <Form.Item name={['typeQualifier', 'allowedTypes']}>
                            <SimpleSelect
                                options={getEntitiesListOptions(SEARCHABLE_ENTITY_TYPES)}
                                onUpdate={(values) =>
                                    isEditMode
                                        ? handleSelectUpdateChange(['typeQualifier', 'allowedTypes'], values)
                                        : handleSelectChange(['typeQualifier', 'allowedTypes'], values)
                                }
                                placeholder={t('govern.structuredProperties.formSection.appliesToPlaceholder')}
                                isMultiSelect
                                values={formValues?.typeQualifier?.allowedTypes}
                                disabledValues={disabledTypeQualifierValues}
                                width="full"
                                isDisabled={isEditMode ? !formValues?.typeQualifier?.allowedTypes?.length : false}
                            />
                        </Form.Item>
                    </Tooltip>
                </RowContainer>
            )}
            <RowContainer>
                <FieldLabel>
                    <FlexContainer>
                        {t('govern.structuredProperties.formSection.appliesToLabel')}
                        <RequiredAsterisk />
                        <Tooltip
                            title={t('govern.structuredProperties.formSection.appliesToTooltip')}
                            showArrow={false}
                        >
                            <Icon icon="Info" color="violet" size="lg" />
                        </Tooltip>
                    </FlexContainer>
                    {isEditMode && (
                        <SubTextContainer>
                            <Text size="sm" weight="medium">
                                <Tooltip
                                    title={t('govern.structuredProperties.formSection.appliesToAddOnlyTooltip')}
                                    showArrow={false}
                                >
                                    {t('govern.structuredProperties.formSection.appliesToAddOnly')}
                                </Tooltip>
                            </Text>
                        </SubTextContainer>
                    )}
                </FieldLabel>

                <Form.Item
                    name="entityTypes"
                    rules={[
                        {
                            required: true,
                            message: t('govern.structuredProperties.formSection.appliesToRequired'),
                        },
                    ]}
                >
                    <SimpleSelect
                        options={getEntitiesListOptions(APPLIES_TO_ENTITIES)}
                        onUpdate={(values) =>
                            isEditMode
                                ? handleSelectUpdateChange('entityTypes', values)
                                : handleSelectChange('entityTypes', values)
                        }
                        placeholder={t('govern.structuredProperties.formSection.appliesToPlaceholder')}
                        isMultiSelect
                        values={formValues?.entityTypes ? formValues?.entityTypes : undefined}
                        disabledValues={disabledEntityTypeValues}
                        width="full"
                        showSelectAll
                        selectAllLabel={t('govern.structuredProperties.formSection.appliesToSelectAllLabel')}
                        data-testid="structured-props-select-input-applies-to"
                        optionListTestId="applies-to-options-list"
                    />
                </Form.Item>
            </RowContainer>
        </>
    );
};

export default StructuredPropsFormSection;
