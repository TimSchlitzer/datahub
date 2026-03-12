import { PageTitle, Select, Switch, colors } from '@components';
import { message } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import analytics, { EventType } from '@app/analytics';
import { useUserContext } from '@app/context/useUserContext';
import { useAppConfig } from '@app/useAppConfig';
import { useIsThemeV2, useIsThemeV2EnabledForUser, useIsThemeV2Toggleable } from '@app/useIsThemeV2';

import { useUpdateApplicationsSettingsMutation } from '@graphql/app.generated';
import { useUpdateUserLocaleMutation, useUpdateUserSettingMutation } from '@graphql/me.generated';
import { UserSetting } from '@types';

const LANGUAGE_OPTIONS = [
    { value: 'en', label: 'English' },
    { value: 'de', label: 'Deutsch' },
    { value: 'pt-BR', label: 'Português (Brasil)' },
];

const Page = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const HeaderContainer = styled.div`
    margin-bottom: 24px;
`;

const StyledCard = styled.div`
    border: 1px solid ${colors.gray[100]};
    border-radius: 12px;
    box-shadow: 0px 1px 2px 0px rgba(33, 23, 95, 0.07);
    padding: 16px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
`;

const SourceContainer = styled.div`
    width: 100%;
    padding: 16px 20px 16px 20px;
`;

const TokensContainer = styled.div`
    padding-top: 0px;
`;

const TextContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
`;

const UserSettingRow = styled.div`
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    width: 100%;
`;

const SettingText = styled.div`
    font-size: 16px;
    color: ${colors.gray[600]};
    font-weight: 700;
`;

const DescriptionText = styled.div`
    color: ${colors.gray[1700]};
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
`;

export const Preferences = () => {
    const { t, i18n } = useTranslation();
    // Current User Urn
    const { user, refetchUser } = useUserContext();
    const isThemeV2 = useIsThemeV2();
    const [isThemeV2Toggleable] = useIsThemeV2Toggleable();
    const [isThemeV2EnabledForUser] = useIsThemeV2EnabledForUser();
    const userContext = useUserContext();
    const appConfig = useAppConfig();

    const showSimplifiedHomepage = !!user?.settings?.appearance?.showSimplifiedHomepage;

    const applicationsEnabled = appConfig.config?.visualConfig?.application?.showApplicationInNavigation ?? false;

    const [updateUserSettingMutation] = useUpdateUserSettingMutation();
    const [updateApplicationsSettingsMutation] = useUpdateApplicationsSettingsMutation();
    const [updateUserLocaleMutation] = useUpdateUserLocaleMutation();

    const currentLocale = user?.settings?.appearance?.locale ?? i18n.language;

    const showSimplifiedHomepageSetting = !isThemeV2;
    const canManageApplicationAppearance = userContext?.platformPrivileges?.manageFeatures;

    return (
        <Page>
            <SourceContainer>
                <TokensContainer>
                    <HeaderContainer>
                        <PageTitle
                            title={t('settings.preferences.appearance')}
                            subTitle={t('settings.preferences.subtitle')}
                        />
                    </HeaderContainer>
                </TokensContainer>
                {showSimplifiedHomepageSetting && (
                    <StyledCard>
                        <UserSettingRow>
                            <TextContainer>
                                <SettingText>{t('settings.preferences.simplifiedHomepage')}</SettingText>
                                <DescriptionText>
                                    {t('settings.preferences.simplifiedHomepageDescription')}
                                </DescriptionText>
                            </TextContainer>
                            <Switch
                                label=""
                                checked={showSimplifiedHomepage}
                                onChange={async () => {
                                    await updateUserSettingMutation({
                                        variables: {
                                            input: {
                                                name: UserSetting.ShowSimplifiedHomepage,
                                                value: !showSimplifiedHomepage,
                                            },
                                        },
                                    });
                                    analytics.event({
                                        type: showSimplifiedHomepage
                                            ? EventType.ShowStandardHomepageEvent
                                            : EventType.ShowSimplifiedHomepageEvent,
                                    });
                                    message.success({ content: t('common.settingUpdated'), duration: 2 });
                                    refetchUser?.();
                                }}
                            />
                        </UserSettingRow>
                    </StyledCard>
                )}
                {isThemeV2Toggleable && (
                    <>
                        <StyledCard>
                            <UserSettingRow>
                                <TextContainer>
                                    <SettingText>{t('settings.preferences.themeV2')}</SettingText>
                                    <DescriptionText>{t('settings.preferences.themeV2Description')}</DescriptionText>
                                </TextContainer>
                                <Switch
                                    label=""
                                    checked={isThemeV2EnabledForUser}
                                    onChange={async () => {
                                        await updateUserSettingMutation({
                                            variables: {
                                                input: {
                                                    name: UserSetting.ShowThemeV2,
                                                    value: !isThemeV2EnabledForUser,
                                                },
                                            },
                                        });
                                        // clicking this button toggles, so event is whatever is opposite to what isThemeV2EnabledForUser currently is
                                        analytics.event({
                                            type: isThemeV2EnabledForUser
                                                ? EventType.RevertV2ThemeEvent
                                                : EventType.ShowV2ThemeEvent,
                                        });
                                        message.success({ content: t('common.settingUpdated'), duration: 2 });
                                        refetchUser?.();
                                    }}
                                />
                            </UserSettingRow>
                        </StyledCard>
                    </>
                )}
                {canManageApplicationAppearance && (
                    <StyledCard>
                        <UserSettingRow>
                            <TextContainer>
                                <SettingText>{t('settings.preferences.showApplications')}</SettingText>
                                <DescriptionText>
                                    {t('settings.preferences.showApplicationsDescription')}
                                </DescriptionText>
                            </TextContainer>
                            <Switch
                                label=""
                                checked={applicationsEnabled}
                                onChange={async () => {
                                    await updateApplicationsSettingsMutation({
                                        variables: {
                                            input: {
                                                enabled: !applicationsEnabled,
                                            },
                                        },
                                    });
                                    message.success({ content: t('common.settingUpdated'), duration: 2 });
                                    appConfig?.refreshContext();
                                }}
                            />
                        </UserSettingRow>
                    </StyledCard>
                )}
                <StyledCard>
                    <UserSettingRow>
                        <TextContainer>
                            <SettingText>{t('settings.preferences.language')}</SettingText>
                            <DescriptionText>{t('settings.preferences.languageDescription')}</DescriptionText>
                        </TextContainer>
                        <Select
                            options={LANGUAGE_OPTIONS}
                            values={[currentLocale]}
                            onUpdate={async (values) => {
                                const locale = values[0];
                                if (!locale) return;
                                i18n.changeLanguage(locale);
                                await updateUserLocaleMutation({
                                    variables: { input: { locale } },
                                });
                                message.success({ content: t('common.settingUpdated'), duration: 2 });
                                refetchUser?.();
                            }}
                        />
                    </UserSettingRow>
                </StyledCard>
                {!showSimplifiedHomepageSetting && !isThemeV2Toggleable && !canManageApplicationAppearance && (
                    <div style={{ color: colors.gray[1700] }}>{t('settings.preferences.noAppearanceSettings')}</div>
                )}
            </SourceContainer>
        </Page>
    );
};
