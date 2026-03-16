import { Empty, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

type Props = {
    isEmptySearch: boolean;
};

const EmptyContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
`;

const StyledEmpty = styled(Empty)`
    .ant-empty-description {
        margin-bottom: 12px;
    }
`;

const EmptyTags = ({ isEmptySearch }: Props) => {
    const { t } = useTranslation();

    return (
        <EmptyContainer>
            <StyledEmpty
                description={
                    <>
                        <Typography.Text data-testid="tags-not-found">
                            {isEmptySearch ? t('tags.noTagsSearched') : t('tags.noTags')}
                        </Typography.Text>
                        <div>
                            {!isEmptySearch && <Typography.Paragraph>{t('tags.tagsDescription')}</Typography.Paragraph>}
                        </div>
                    </>
                }
                image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
        </EmptyContainer>
    );
};

export default EmptyTags;
