import { Editor } from '@components';
import { Form, FormInstance, Input, Radio, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { PostEntry } from '@app/settingsV2/posts/PostsListColumns';
import {
    DESCRIPTION_FIELD_NAME,
    LINK_FIELD_NAME,
    LOCATION_FIELD_NAME,
    TITLE_FIELD_NAME,
    TYPE_FIELD_NAME,
} from '@app/settingsV2/posts/constants';
import { ANTD_GRAY } from '@src/app/entity/shared/constants';

import { PostContentType } from '@types';

const TopFormItem = styled(Form.Item)`
    margin-bottom: 24px;
`;

const SubFormItem = styled(Form.Item)`
    margin-bottom: 0;
`;

const StyledEditor = styled(Editor)`
    border: 1px solid ${ANTD_GRAY[4.5]};
`;

type Props = {
    setCreateButtonEnabled: (isEnabled: boolean) => void;
    form: FormInstance;
    contentType: PostContentType;
    editData?: PostEntry;
};

export default function CreatePostForm({ setCreateButtonEnabled, form, editData, contentType }: Props) {
    const { t } = useTranslation();
    const [postType, setPostType] = useState<PostContentType>(PostContentType.Text);

    useEffect(() => {
        if (contentType) {
            setPostType(contentType);
        }
    }, [contentType]);

    return (
        <Form
            form={form}
            initialValues={{}}
            layout="vertical"
            onFieldsChange={() => {
                setCreateButtonEnabled(!form.getFieldsError().some((field) => field.errors.length > 0));
            }}
        >
            <TopFormItem name={TYPE_FIELD_NAME} label={<Typography.Text strong>{t('settings.posts.contentType')}</Typography.Text>}>
                <Radio.Group
                    onChange={(e) => setPostType(e.target.value)}
                    value={postType}
                    defaultValue={postType}
                    optionType="button"
                    buttonStyle="solid"
                >
                    <Radio value={PostContentType.Text}>{t('settings.posts.announcement')}</Radio>
                    <Radio value={PostContentType.Link}>{t('settings.posts.pinnedLink')}</Radio>
                </Radio.Group>
            </TopFormItem>

            <TopFormItem label={<Typography.Text strong>{t('common.title')}</Typography.Text>}>
                <Typography.Paragraph>{t('settings.posts.titleDescription')}</Typography.Paragraph>
                <SubFormItem name={TITLE_FIELD_NAME} rules={[{ required: true }]} hasFeedback>
                    <Input data-testid="create-post-title" placeholder={t('settings.posts.yourTitle')} />
                </SubFormItem>
            </TopFormItem>
            {postType === PostContentType.Text && (
                <TopFormItem label={<Typography.Text strong>{t('common.description')}</Typography.Text>}>
                    <Typography.Paragraph>{t('settings.posts.announcementDescription')}</Typography.Paragraph>
                    <SubFormItem name={DESCRIPTION_FIELD_NAME} rules={[{ min: 0, max: 500 }]} hasFeedback>
                        <StyledEditor
                            className="create-post-description"
                            doNotFocus
                            content={editData?.description || undefined}
                            onKeyDown={(e) => {
                                // Preventing the modal from closing when the Enter key is pressed
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }
                            }}
                        />
                    </SubFormItem>
                </TopFormItem>
            )}
            {postType === PostContentType.Link && (
                <>
                    <TopFormItem label={<Typography.Text strong>{t('settings.posts.linkUrl')}</Typography.Text>}>
                        <Typography.Paragraph>
                            {t('settings.posts.linkUrlDescription')}
                        </Typography.Paragraph>
                        <SubFormItem name={LINK_FIELD_NAME} rules={[{ type: 'url', warningOnly: true }]} hasFeedback>
                            <Input data-testid="create-post-link" placeholder={t('settings.posts.yourLinkUrl')} />
                        </SubFormItem>
                    </TopFormItem>
                    <TopFormItem label={<Typography.Text strong>{t('settings.posts.imageUrlOptional')}</Typography.Text>}>
                        <Typography.Paragraph>
                            {t('settings.posts.imageUrlDescription')}
                        </Typography.Paragraph>
                        <SubFormItem
                            name={LOCATION_FIELD_NAME}
                            rules={[{ type: 'url', warningOnly: true }]}
                            hasFeedback
                        >
                            <Input data-testid="create-post-media-location" placeholder={t('settings.posts.yourImageUrl')} />
                        </SubFormItem>
                    </TopFormItem>
                    <SubFormItem label={<Typography.Text strong>{t('common.description')}</Typography.Text>}>
                        <Typography.Paragraph>{t('settings.posts.linkDescription')}</Typography.Paragraph>
                        <SubFormItem name={DESCRIPTION_FIELD_NAME} rules={[{ min: 0, max: 500 }]} hasFeedback>
                            <StyledEditor
                                doNotFocus
                                content={editData?.description || undefined}
                                className="create-post-description"
                                onKeyDown={(e) => {
                                    // Preventing the modal from closing when the Enter key is pressed
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }
                                }}
                            />
                        </SubFormItem>
                    </SubFormItem>
                </>
            )}
        </Form>
    );
}
