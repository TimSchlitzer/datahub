import { Button, Card, colors } from '@components';
import { Globe, Plugs, UserPlus } from '@phosphor-icons/react';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { useUserContext } from '@app/context/useUserContext';
import ViewInviteTokenModal from '@app/identity/user/ViewInviteTokenModal';
import OnboardingContext from '@app/onboarding/OnboardingContext';
import { HOME_PAGE_ONBOARDING_CARDS_ID } from '@app/onboarding/config/HomePageOnboardingConfig';
import { PageRoutes } from '@conf/Global';
import { useGetPlatforms } from '@src/app/homeV2/content/tabs/discovery/sections/platform/useGetPlatforms';

export const OnboardingCards = () => {
    const { t } = useTranslation();
    const { user, platformPrivileges } = useUserContext();
    const { platforms, loading } = useGetPlatforms(user);
    const { isUserInitializing } = useContext(OnboardingContext);
    const [isViewingInviteToken, setIsViewingInviteToken] = useState(false);

    if (loading || platforms?.length || isUserInitializing || !user) {
        return null;
    }

    // We use manage policies here because this determines whether users can invite other users
    // with particular roles.
    const canManageUsers = platformPrivileges?.managePolicies;

    const openInviteUsers = () => {
        setIsViewingInviteToken(true);
    };

    return (
        <div style={{ display: 'flex', gap: '16px' }} id={HOME_PAGE_ONBOARDING_CARDS_ID}>
            <Link to={`${PageRoutes.INGESTION}`}>
                <Card
                    icon={<Plugs color={colors.gray[1800]} size={32} />}
                    title={t('home.onboarding.addDataSources')}
                    subTitle={t('home.onboarding.addDataSourcesSubtitle')}
                    button={<Button variant="text">{t('home.onboarding.addDataSourcesButton')}</Button>}
                />
            </Link>
            {canManageUsers ? (
                <Card
                    icon={<UserPlus color={colors.gray[1800]} size={32} />}
                    title={t('home.onboarding.inviteUsers')}
                    subTitle={t('home.onboarding.inviteUsersSubtitle')}
                    onClick={openInviteUsers}
                    button={<Button variant="text">{t('home.onboarding.inviteButton')}</Button>}
                />
            ) : null}
            <Link to={`${PageRoutes.DOMAINS}?create=true`}>
                <Card
                    icon={<Globe color={colors.gray[1800]} size={32} />}
                    title={t('home.onboarding.addDomains')}
                    subTitle={t('home.onboarding.addDomainsSubtitle')}
                    button={<Button variant="text">{t('home.onboarding.addDomainsButton')}</Button>}
                />
            </Link>
            <ViewInviteTokenModal open={isViewingInviteToken} onClose={() => setIsViewingInviteToken(false)} />
        </div>
    );
};
