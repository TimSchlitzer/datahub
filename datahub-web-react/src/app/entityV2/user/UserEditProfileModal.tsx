import { MoreOutlined } from '@ant-design/icons';
import { Modal, Tooltip } from '@components';
import { Form, Input, Typography, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { useAppConfig } from '@app/useAppConfig';

import { useUpdateCorpUserPropertiesMutation } from '@graphql/user.generated';

const StyledInput = styled(Input)`
    margin-bottom: 20px;
`;

const StyledText = styled(Typography.Text)`
    display: block;
    position: absolute;
    bottom: 11.5rem;
`;

type PropsData = {
    name: string | undefined;
    title: string | undefined;
    image: string | undefined;
    team: string | undefined;
    email: string | undefined;
    slack: string | undefined;
    phone: string | undefined;
    urn: string | undefined;
};

type Props = {
    visible: boolean;
    onClose: () => void;
    onSave: () => void;
    editModalData: PropsData;
};
/** Regex Validations */
export const USER_NAME_REGEX = new RegExp('^[a-zA-Z ]*$');

export default function UserEditProfileModal({ visible, onClose, onSave, editModalData }: Props) {
    const { t } = useTranslation();
    const { config } = useAppConfig();
    const { readOnlyModeEnabled } = config.featureFlags;
    const [updateCorpUserPropertiesMutation] = useUpdateCorpUserPropertiesMutation();
    const [form] = Form.useForm();

    const [saveButtonEnabled, setSaveButtonEnabled] = useState(true);
    const [data, setData] = useState<PropsData>({
        name: editModalData.name,
        title: editModalData.title,
        image: editModalData.image,
        team: editModalData.team,
        email: editModalData.email,
        slack: editModalData.slack,
        phone: editModalData.phone,
        urn: editModalData.urn,
    });

    useEffect(() => {
        setData({ ...editModalData });
    }, [editModalData]);

    // save changes function
    const onSaveChanges = () => {
        updateCorpUserPropertiesMutation({
            variables: {
                urn: editModalData?.urn || '',
                input: {
                    displayName: data.name,
                    title: data.title,
                    pictureLink: data.image,
                    teams: data.team?.split(','),
                    email: data.email,
                    slack: data.slack,
                    phone: data.phone,
                },
            },
        })
            .then(() => {
                message.success({
                    content: t('entity.user.changesSaved'),
                    duration: 3,
                });
                onSave(); // call the refetch function once save
                // clear the values from edit profile form
                setData({
                    name: '',
                    title: '',
                    image: '',
                    team: '',
                    email: '',
                    slack: '',
                    phone: '',
                    urn: '',
                });
            })
            .catch((e) => {
                message.destroy();
                message.error({ content: `${t('entity.user.failedSaveChanges')}: \n ${e.message || ''}`, duration: 3 });
            });
        onClose();
    };

    return (
        <Modal
            title={t('entity.user.editProfileTitle')}
            open={visible}
            onCancel={onClose}
            buttons={[
                {
                    text: t('entity.user.cancel'),
                    variant: 'text',
                    onClick: onClose,
                },
                {
                    text: t('entity.user.saveChanges'),
                    variant: 'filled',
                    id: 'editUserButton',
                    disabled: saveButtonEnabled,
                    onClick: onSaveChanges,
                },
            ]}
        >
            <Form
                form={form}
                initialValues={{ ...editModalData }}
                autoComplete="off"
                layout="vertical"
                onFieldsChange={() =>
                    setSaveButtonEnabled(form.getFieldsError().some((field) => field.errors.length > 0))
                }
                onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        onSaveChanges();
                    }
                }}
            >
                <Form.Item
                    name="name"
                    label={<Typography.Text strong>{t('entity.user.name')}</Typography.Text>}
                    rules={[
                        {
                            required: true,
                            message: t('entity.user.nameRequired'),
                        },
                        { whitespace: true },
                        { min: 2, max: 50 },
                        {
                            pattern: USER_NAME_REGEX,
                            message: '',
                        },
                    ]}
                    hasFeedback
                >
                    <Input
                        placeholder={t('entity.user.namePlaceholder')}
                        value={data.name}
                        onChange={(event) => setData({ ...data, name: event.target.value })}
                        disabled={readOnlyModeEnabled}
                    />
                </Form.Item>
                <Form.Item
                    name="title"
                    label={<Typography.Text strong>{t('entity.user.titleRole')}</Typography.Text>}
                    rules={[{ whitespace: true }, { min: 2, max: 50 }]}
                    hasFeedback
                >
                    <Input
                        placeholder={t('entity.user.titlePlaceholder')}
                        value={data.title}
                        onChange={(event) => setData({ ...data, title: event.target.value })}
                        disabled={readOnlyModeEnabled}
                    />
                </Form.Item>
                <Tooltip
                    title={t('entity.user.imageUrlDisabled')}
                    overlayStyle={readOnlyModeEnabled ? {} : { display: 'none' }}
                    placement="bottom"
                >
                    <Form.Item
                        name="image"
                        label={<Typography.Text strong>{t('entity.user.imageUrl')}</Typography.Text>}
                        rules={[{ whitespace: true }, { type: 'url', message: t('entity.user.invalidUrl') }]}
                        hasFeedback
                    >
                        <Input
                            placeholder="https://www.example.com/photo.png"
                            value={data.image}
                            onChange={(event) => setData({ ...data, image: event.target.value })}
                            disabled={readOnlyModeEnabled}
                        />
                    </Form.Item>
                </Tooltip>
                <Form.Item
                    name="team"
                    label={<Typography.Text strong>{t('entity.user.team')}</Typography.Text>}
                    rules={[{ whitespace: true }, { min: 2, max: 50 }]}
                >
                    <Input
                        placeholder={t('entity.user.teamPlaceholder')}
                        value={data.team}
                        onChange={(event) => setData({ ...data, team: event.target.value })}
                        disabled={readOnlyModeEnabled}
                    />
                </Form.Item>
                <Form.Item
                    name="email"
                    label={<Typography.Text strong>{t('entity.user.email')}</Typography.Text>}
                    rules={[
                        {
                            required: true,
                            message: t('entity.user.emailRequired'),
                        },
                        {
                            type: 'email',
                            message: t('entity.user.emailInvalid'),
                        },
                        { whitespace: true },
                        { min: 2, max: 50 },
                    ]}
                    hasFeedback
                >
                    <Input
                        placeholder="john.smith@example.com"
                        value={data.email}
                        onChange={(event) => setData({ ...data, email: event.target.value })}
                        disabled={readOnlyModeEnabled}
                    />
                </Form.Item>
                <Form.Item
                    name="slack"
                    label={
                        <>
                            <Typography.Text strong>{t('entity.user.slackMemberId')}</Typography.Text>
                        </>
                    }
                    rules={[{ whitespace: true }, { min: 2, max: 50 }]}
                    hasFeedback
                >
                    <StyledInput
                        placeholder="ABC12345678"
                        value={data.slack}
                        onChange={(event) => setData({ ...data, slack: event.target.value })}
                        disabled={readOnlyModeEnabled}
                    />
                </Form.Item>
                <StyledText type="secondary">
                    {t('entity.user.slackHelpText')} <MoreOutlined /> {t('entity.user.slackMenu')}
                    <a
                        href="https://slack.com/intl/en-ca/help/articles/212906697-Where-can-I-find-my-Slack-member-ID-"
                        target="_blank"
                        rel="noreferrer"
                    >
                        {' '}
                        {t('entity.user.here')}
                    </a>
                </StyledText>
                <Form.Item
                    name="phone"
                    label={<Typography.Text strong>{t('entity.user.phone')}</Typography.Text>}
                    rules={[
                        {
                            pattern: new RegExp('^(?=.*[0-9])[- +()0-9]+$'),
                            message: t('entity.user.phoneInvalid'),
                        },
                        {
                            min: 5,
                            max: 15,
                        },
                    ]}
                    hasFeedback
                >
                    <Input
                        placeholder="444-999-9999"
                        value={data.phone}
                        onChange={(event) => setData({ ...data, phone: event.target.value })}
                        disabled={readOnlyModeEnabled}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}
