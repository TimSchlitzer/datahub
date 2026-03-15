import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useReactiveVar } from '@apollo/client';
import { Button, Form, Image, Input, message } from 'antd';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router';
import styled, { useTheme } from 'styled-components/macro';

import analytics, { EventType } from '@app/analytics';
import { isLoggedInVar } from '@app/auth/checkAuthStatus';
import styles from '@app/auth/login.module.css';
import useGetResetTokenFromUrlParams from '@app/auth/useGetResetTokenFromUrlParams';
import { Message } from '@app/shared/Message';
import { useAppConfig } from '@app/useAppConfig';
import { PageRoutes } from '@conf/Global';
import { resolveRuntimePath } from '@utils/runtimeBasePath';

type FormValues = {
    email: string;
    password: string;
    confirmPassword: string;
};

const FormInput = styled(Input)`
    &&& {
        height: 32px;
        font-size: 12px;
        border: 1px solid #555555;
        border-radius: 5px;
        background-color: transparent;
        color: white;
        line-height: 1.5715;
    }
    > .ant-input {
        color: white;
        font-size: 14px;
        background-color: transparent;
    }
    > .ant-input:hover {
        color: white;
        font-size: 14px;
        background-color: transparent;
    }
`;

const StyledFormItem = styled(Form.Item)`
    .ant-input-affix-wrapper-status-error:not(.ant-input-affix-wrapper-disabled):not(
            .ant-input-affix-wrapper-borderless
        ).ant-input-affix-wrapper {
        background-color: transparent;
    }
`;

export type ResetCredentialsProps = Record<string, never>;

export const ResetCredentials: React.VFC<ResetCredentialsProps> = () => {
    const { t } = useTranslation();
    const isLoggedIn = useReactiveVar(isLoggedInVar);
    const resetToken = useGetResetTokenFromUrlParams();

    const themeConfig = useTheme();
    const [loading, setLoading] = useState(false);

    const { refreshContext } = useAppConfig();

    const handleResetCredentials = useCallback(
        (values: FormValues) => {
            setLoading(true);
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: values.email,
                    password: values.password,
                    resetToken,
                }),
            };
            fetch(resolveRuntimePath('/resetNativeUserCredentials'), requestOptions)
                .then(async (response) => {
                    if (!response.ok) {
                        const data = await response.json();
                        const error = (data && data.message) || response.status;
                        return Promise.reject(error);
                    }
                    isLoggedInVar(true);
                    refreshContext();
                    analytics.event({ type: EventType.ResetCredentialsEvent });
                    return Promise.resolve();
                })
                .catch((_) => {
                    message.error(t('auth.failedToLogIn'));
                })
                .finally(() => setLoading(false));
        },
        [refreshContext, resetToken, t],
    );

    if (isLoggedIn && !loading) {
        return <Redirect to={`${PageRoutes.ROOT}`} />;
    }

    return (
        <div className={styles.login_page}>
            <div className={styles.login_box}>
                <div className={styles.login_logo_box}>
                    <Image wrapperClassName={styles.logo_image} src={themeConfig.assets?.logoUrl} preview={false} />
                </div>
                <div className={styles.login_form_box}>
                    {loading && <Message type="loading" content={t('auth.resettingCredentials')} />}
                    <Form onFinish={handleResetCredentials} layout="vertical">
                        <StyledFormItem
                            rules={[{ required: true, message: t('auth.emailError') }]}
                            name="email"
                            // eslint-disable-next-line jsx-a11y/label-has-associated-control
                            label={<label style={{ color: 'white' }}>{t('auth.email')}</label>}
                        >
                            <FormInput prefix={<UserOutlined />} data-testid="email" />
                        </StyledFormItem>
                        <StyledFormItem
                            rules={[
                                { required: true, message: t('auth.passwordError') },
                                ({ getFieldValue }) => ({
                                    validator() {
                                        if (getFieldValue('password').length < 8) {
                                            return Promise.reject(
                                                new Error(t('auth.passwordLengthError')),
                                            );
                                        }
                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                            name="password"
                            // eslint-disable-next-line jsx-a11y/label-has-associated-control
                            label={<label style={{ color: 'white' }}>{t('auth.password')}</label>}
                        >
                            <FormInput prefix={<LockOutlined />} type="password" data-testid="password" />
                        </StyledFormItem>
                        <StyledFormItem
                            rules={[
                                { required: true, message: t('auth.confirmPasswordError') },
                                ({ getFieldValue }) => ({
                                    validator() {
                                        if (getFieldValue('confirmPassword') !== getFieldValue('password')) {
                                            return Promise.reject(new Error(t('auth.confirmPasswordError')));
                                        }
                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                            name="confirmPassword"
                            // eslint-disable-next-line jsx-a11y/label-has-associated-control
                            label={<label style={{ color: 'white' }}>{t('auth.confirmPassword')}</label>}
                        >
                            <FormInput prefix={<LockOutlined />} type="password" data-testid="confirmPassword" />
                        </StyledFormItem>
                        <StyledFormItem style={{ marginBottom: '0px' }} shouldUpdate>
                            {({ getFieldsValue }) => {
                                const { email, password, confirmPassword } = getFieldsValue() as {
                                    email: string;
                                    password: string;
                                    confirmPassword: string;
                                };
                                const fieldsAreNotEmpty = !!email && !!password && !!confirmPassword;
                                const passwordsMatch = password === confirmPassword;
                                const formIsComplete = fieldsAreNotEmpty && passwordsMatch;
                                return (
                                    <Button
                                        type="primary"
                                        block
                                        htmlType="submit"
                                        className={styles.login_button}
                                        disabled={!formIsComplete}
                                        data-testid="reset-password"
                                    >
                                        {t('auth.resetPasswordButton')}
                                    </Button>
                                );
                            }}
                        </StyledFormItem>
                    </Form>
                </div>
            </div>
        </div>
    );
};
