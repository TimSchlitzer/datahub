import { Text } from '@components';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { OnboardingStep } from '@app/onboarding/OnboardingStep';

export const ROLES_INTRO_ID = 'roles-intro';

export const useRolesOnboardingConfig = (): OnboardingStep[] => {
    const { t } = useTranslation();

    return [
        {
            id: ROLES_INTRO_ID,
            title: t('onBoarding.roles.introID_component'),
            content: (
                <Typography.Paragraph>
                    <p>
                        Welcome to DataHub <strong>Roles</strong>!
                    </p>
                    <p>
                        <strong>Roles</strong> are the recommended way to manage permissions on DataHub.
                    </p>
                    <p>
                        DataHub currently supports three out-of-the-box Roles: <strong>Admin</strong>,{' '}
                        <strong>Editor</strong> and <strong>Reader</strong>.
                    </p>
                    <p>
                        Learn more about <strong>Roles</strong> and the different permissions for each Role{' '}
                        <a
                            target="_blank"
                            rel="noreferrer noopener"
                            href="https://docs.datahub.com/docs/authorization/roles"
                        >
                            {' '}
                            here.
                        </a>
                    </p>
                </Typography.Paragraph>
            ),
        },
    ];
};

// Backward compatibility export
export const RolesOnboardingConfig: OnboardingStep[] = [
    {
        id: ROLES_INTRO_ID,
        title: 'Roles',
        content: (
            <Text type="div" size="md">
                <p>
                    Welcome to DataHub <strong>Roles</strong>!
                </p>
                <p>
                    <strong>Roles</strong> are the recommended way to manage permissions on DataHub.
                </p>
                <p>
                    DataHub currently supports three out-of-the-box Roles: <strong>Admin</strong>,{' '}
                    <strong>Editor</strong> and <strong>Reader</strong>.
                </p>
                <p>
                    Learn more about <strong>Roles</strong> and the different permissions for each Role{' '}
                    <a
                        target="_blank"
                        rel="noreferrer noopener"
                        href="https://docs.datahub.com/docs/authorization/roles"
                    >
                        {' '}
                        here.
                    </a>
                </p>
            </Text>
        ),
    },
];
