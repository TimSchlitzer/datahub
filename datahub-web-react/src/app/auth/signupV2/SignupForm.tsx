import { Input } from '@components';
import { Form, FormInstance } from 'antd';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import styled from 'styled-components';

import { SignupFormValues } from '@app/auth/shared/types';
import { FieldLabel } from '@app/sharedV2/forms/FieldLabel';

const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding: 0 20px;
`;

const ItemContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

interface Props {
    form: FormInstance;
    handleSubmit: (values: SignupFormValues) => void;
    onFormChange: () => void;
    isSubmitDisabled: boolean;
}

export default function SignupForm({ form, handleSubmit, onFormChange, isSubmitDisabled }: Props) {
    const { t } = useTranslation();
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);

    const emailFromQuery = searchParams.get('email');
    const firstNameFromQuery = searchParams.get('first_name');
    const lastNameFromQuery = searchParams.get('last_name');

    const isEmailFromQuery = Boolean(emailFromQuery);

    useEffect(() => {
        form.setFieldsValue({
            email: emailFromQuery || undefined,
            fullName:
                firstNameFromQuery || lastNameFromQuery
                    ? `${firstNameFromQuery ?? ''} ${lastNameFromQuery ?? ''}`.trim()
                    : undefined,
        });
    }, [emailFromQuery, firstNameFromQuery, lastNameFromQuery, form]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isSubmitDisabled) {
            form.submit();
        }
    };

    return (
        <FormContainer>
            <Form form={form} onFinish={handleSubmit} onFieldsChange={onFormChange} onKeyDown={handleKeyDown}>
                <ItemContainer>
                    <FieldLabel label={t('auth.signup.emailLabel')} required />
                    <Form.Item rules={[{ required: true, message: t('auth.signup.emailError') }]} name="email">
                        <Input placeholder={t('auth.signup.emailPlaceholder')} isDisabled={isEmailFromQuery} inputTestId="email" />
                    </Form.Item>
                </ItemContainer>

                <ItemContainer>
                    <FieldLabel label={t('auth.signup.fullNameLabel')} required />
                    <Form.Item rules={[{ required: true, message: t('auth.signup.fullNameError') }]} name="fullName">
                        <Input placeholder={t('auth.signup.fullNamePlaceholder')} inputTestId="name" />
                    </Form.Item>
                </ItemContainer>

                <ItemContainer>
                    <FieldLabel label={t('auth.signup.passwordLabel')} required />
                    <Form.Item
                        rules={[
                            { required: true, message: t('auth.signup.passwordError') },
                            ({ getFieldValue }) => ({
                                validator() {
                                    if (getFieldValue('password').length < 8) {
                                        return Promise.reject(new Error(t('auth.signup.passwordLengthError')));
                                    }
                                    return Promise.resolve();
                                },
                            }),
                        ]}
                        name="password"
                    >
                        <Input placeholder={t('auth.signup.passwordPlaceholder')} type="password" inputTestId="password" />
                    </Form.Item>
                </ItemContainer>

                <ItemContainer>
                    <FieldLabel label={t('auth.signup.confirmPasswordLabel')} required />
                    <Form.Item
                        rules={[
                            { required: true, message: t('auth.signup.confirmPasswordError') },
                            ({ getFieldValue }) => ({
                                validator() {
                                    if (getFieldValue('confirmPassword') !== getFieldValue('password')) {
                                        return Promise.reject(new Error(t('auth.signup.confirmPasswordMismatchError')));
                                    }
                                    return Promise.resolve();
                                },
                            }),
                        ]}
                        name="confirmPassword"
                    >
                        <Input placeholder={t('auth.signup.confirmPasswordPlaceholder')} type="password" inputTestId="confirmPassword" />
                    </Form.Item>
                </ItemContainer>
            </Form>
        </FormContainer>
    );
}
