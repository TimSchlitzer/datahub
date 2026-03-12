import { Alert, Button } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const StyledAlert = styled(Alert)`
    white-space: normal;
`;

type Props = {
    onClickRetry?: () => void;
};

const SidebarLoadingError = ({ onClickRetry }: Props) => {
    const { t } = useTranslation();
    return (
        <StyledAlert
            message={t('search.sidebar.loadError')}
            showIcon
            type="error"
            action={
                onClickRetry && (
                    <Button size="small" danger onClick={onClickRetry}>
                        {t('common.retry')}
                    </Button>
                )
            }
        />
    );
};

export default SidebarLoadingError;
