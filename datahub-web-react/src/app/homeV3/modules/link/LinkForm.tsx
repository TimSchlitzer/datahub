import { Input, TextArea } from '@components';
import { Form, FormInstance } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { LinkModuleParams } from '@types';

interface Props {
    form: FormInstance;
    formValues?: LinkModuleParams;
}

export default function LinkForm({ form, formValues }: Props) {
    const { t } = useTranslation();
    return (
        <Form form={form} initialValues={formValues}>
            <Form.Item
                name="linkUrl"
                rules={[
                    {
                        required: true,
                        message: t('homeV3.linkForm.urlRequired'),
                    },
                    {
                        type: 'url',
                        message: t('homeV3.linkForm.invalidUrl'),
                    },
                ]}
            >
                <Input
                    label={t('homeV3.linkForm.linkLabel')}
                    placeholder="https://www.datahub.com"
                    isRequired
                    data-testid="link-url"
                />
            </Form.Item>
            <Form.Item
                name="imageUrl"
                rules={[
                    {
                        type: 'url',
                        message: t('homeV3.linkForm.invalidUrl'),
                    },
                ]}
            >
                <Input
                    label={t('homeV3.linkForm.imageUrlLabel')}
                    placeholder={t('homeV3.linkForm.imageUrlPlaceholder')}
                />
            </Form.Item>
            <Form.Item name="description">
                <TextArea
                    label={t('homeV3.linkForm.descriptionLabel')}
                    placeholder={t('homeV3.linkForm.descriptionPlaceholder')}
                />
            </Form.Item>
        </Form>
    );
}
