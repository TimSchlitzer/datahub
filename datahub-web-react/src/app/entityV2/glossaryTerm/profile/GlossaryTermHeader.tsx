import { Divider, Space, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { AvatarsGroup } from '@app/shared/avatar';
import { useEntityRegistry } from '@app/useEntityRegistry';

type Props = {
    definition: string;
    sourceRef: string;
    sourceUrl: string;
    ownership?: any;
};
export default function GlossaryTermHeader({ definition, sourceRef, sourceUrl, ownership }: Props) {
    const { t } = useTranslation();
    const entityRegistry = useEntityRegistry();
    return (
        <>
            <Space direction="vertical" size="middle" style={{ marginBottom: '15px' }}>
                <Typography.Paragraph>{definition}</Typography.Paragraph>
                <Space split={<Divider type="vertical" />}>
                    <Typography.Text>{t('entity.glossaryTerm.source')}</Typography.Text>
                    <Typography.Text strong>{sourceRef}</Typography.Text>
                    {sourceUrl && (
                        <a href={decodeURIComponent(sourceUrl)} target="_blank" rel="noreferrer">
                            {t('entity.glossaryTerm.viewSource')}
                        </a>
                    )}
                </Space>
                <AvatarsGroup owners={ownership?.owners} entityRegistry={entityRegistry} />
            </Space>
        </>
    );
}
