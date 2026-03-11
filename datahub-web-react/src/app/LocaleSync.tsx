import React from 'react';

import { useLocale } from '@app/useLocale';

interface Props {
    children: React.ReactNode;
}

/**
 * Thin wrapper that activates locale synchronisation from user settings.
 * Rendered inside UserContextProvider so it has access to the user's saved locale.
 */
export default function LocaleSync({ children }: Props) {
    useLocale();
    return <>{children}</>;
}
