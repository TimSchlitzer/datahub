import { Empty } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const EmptyAnnouncements = () => {
    const { t } = useTranslation();
    return <Empty description={t('home.noAnnouncements')} />;
};
