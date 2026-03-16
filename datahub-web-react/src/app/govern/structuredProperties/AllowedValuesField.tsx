import { Icon, Text, Tooltip } from '@components';
import React from 'react';
import { useTranslation } from 'react-i18next';

import {
    FieldLabel,
    FlexContainer,
    ItemsContainer,
    RowContainer,
    StyledIcon,
    ValueListContainer,
    ValueType,
    ValuesList,
    VerticalDivider,
} from '@app/govern/structuredProperties/styledComponents';
import { PropValueField, isStringOrNumberTypeSelected } from '@app/govern/structuredProperties/utils';
import { AllowedValue } from '@src/types.generated';

interface Props {
    selectedValueType: string;
    allowedValues: AllowedValue[] | undefined;
    valueField: PropValueField;
    setShowAllowedValuesDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

const AllowedValuesField = ({ selectedValueType, allowedValues, valueField, setShowAllowedValuesDrawer }: Props) => {
    const { t } = useTranslation();

    return (
        <>
            {isStringOrNumberTypeSelected(selectedValueType) && (
                <RowContainer>
                    <FieldLabel>
                        <FlexContainer>
                            {t('govern.structuredProperties.allowedValuesField.label')}
                            <Tooltip
                                title={t('govern.structuredProperties.allowedValuesField.tooltip')}
                                showArrow={false}
                            >
                                <Icon icon="Info" color="violet" size="lg" />
                            </Tooltip>
                        </FlexContainer>
                    </FieldLabel>

                    {allowedValues && allowedValues.length > 0 ? (
                        <ItemsContainer>
                            <ValuesList>
                                {allowedValues.map((val, index) => {
                                    return (
                                        <>
                                            <Text>{val[valueField]}</Text>
                                            {index < allowedValues.length - 1 && <VerticalDivider type="vertical" />}
                                        </>
                                    );
                                })}
                            </ValuesList>
                            <Tooltip
                                title={t('govern.structuredProperties.allowedValuesField.updateTooltip')}
                                showArrow={false}
                            >
                                <StyledIcon
                                    icon="ChevronRight"
                                    color="gray"
                                    onClick={() => setShowAllowedValuesDrawer(true)}
                                />
                            </Tooltip>
                        </ItemsContainer>
                    ) : (
                        <ValueListContainer>
                            {t('govern.structuredProperties.allowedValuesField.anyValueText')}
                            <ValueType>
                                {valueField === 'stringValue'
                                    ? t('govern.structuredProperties.allowedValuesField.textType')
                                    : t('govern.structuredProperties.allowedValuesField.numberType')}
                            </ValueType>
                            {t('govern.structuredProperties.allowedValuesField.valueWillBeAllowed')}
                            <Tooltip
                                title={t('govern.structuredProperties.allowedValuesField.updateTooltip')}
                                showArrow={false}
                            >
                                <Icon icon="Add" color="gray" onClick={() => setShowAllowedValuesDrawer(true)} />
                            </Tooltip>
                        </ValueListContainer>
                    )}
                </RowContainer>
            )}
        </>
    );
};

export default AllowedValuesField;
