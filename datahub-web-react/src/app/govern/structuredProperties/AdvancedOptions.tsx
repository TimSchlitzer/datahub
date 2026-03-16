import { Icon, Input, Text, Tooltip } from '@components';
import { Collapse, Form } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

import {
    CollapseHeader,
    FlexContainer,
    InputLabel,
    StyledCollapse,
} from '@app/govern/structuredProperties/styledComponents';

interface Props {
    isEditMode: boolean;
}

const AdvancedOptions = ({ isEditMode }: Props) => {
    const { t } = useTranslation();

    return (
        <StyledCollapse
            ghost
            expandIcon={({ isActive }) => (
                <Icon icon="ChevronRight" color="gray" size="4xl" rotate={isActive ? '90' : '0'} />
            )}
            expandIconPosition="end"
            defaultActiveKey={[]}
        >
            <Collapse.Panel
                key={1}
                header={
                    <CollapseHeader>
                        <Text weight="bold" color="gray">
                            {t('govern.structuredProperties.advancedOptions.label')}
                        </Text>
                    </CollapseHeader>
                }
                forceRender
            >
                <InputLabel>
                    <FlexContainer>
                        {t('govern.structuredProperties.advancedOptions.qualifiedName')}
                        <Tooltip
                            title={t('govern.structuredProperties.advancedOptions.qualifiedNameTooltip')}
                            showArrow={false}
                        >
                            <Icon icon="Info" color="violet" size="lg" />
                        </Tooltip>
                    </FlexContainer>
                </InputLabel>
                <Tooltip
                    title={isEditMode && t('govern.structuredProperties.advancedOptions.qualifiedNameCannotChange')}
                    showArrow={false}
                >
                    <Form.Item
                        name="qualifiedName"
                        rules={[
                            {
                                pattern: /^[^\s]*$/,
                                whitespace: true,
                                message: t('govern.structuredProperties.advancedOptions.qualifiedNameSpaceError'),
                            },
                        ]}
                    >
                        <Input
                            label=""
                            placeholder={t('govern.structuredProperties.advancedOptions.qualifiedNamePlaceholder')}
                            isDisabled={isEditMode}
                        />
                    </Form.Item>
                </Tooltip>
            </Collapse.Panel>
        </StyledCollapse>
    );
};

export default AdvancedOptions;
