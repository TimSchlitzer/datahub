import { InfoCircleOutlined } from '@ant-design/icons';
import { message } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';

import { Button, Modal, Text } from '@src/alchemy-components';
import { IconNames } from '@src/alchemy-components/components/Icon/types';
import { colors } from '@src/alchemy-components/theme';
import { resolveRuntimePath } from '@utils/runtimeBasePath';

const ModalContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const InfoAlert = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background: ${colors.blue[100]};
    border: 1px solid ${colors.blue[300]};
    border-radius: 8px;
    color: ${colors.blue[600]};
`;

const InfoIcon = styled(InfoCircleOutlined)`
    font-size: 16px;
    color: ${colors.blue[500]};
`;

const Section = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const CodeBlock = styled.div`
    position: relative;
    background: ${colors.gray[100]};
    border: 1px solid ${colors.gray[200]};
    border-radius: 6px;
    padding: 12px;
    overflow-x: auto;
`;

const CodeContent = styled.pre`
    margin: 0;
    white-space: pre-wrap;
    word-break: break-all;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 12px;
    line-height: 1.5;
    color: ${colors.gray[600]};
`;

const CopyButton = styled(Button)`
    position: absolute;
    top: 8px;
    right: 8px;
    background: ${colors.white};

    &:hover {
        background: ${colors.gray[50]};
    }
`;

const Kbd = styled.code`
    display: inline;
    padding: 2px 6px;
    background: ${colors.gray[100]};
    border: 1px solid ${colors.gray[200]};
    border-radius: 4px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 12px;
`;

const ExpirationText = styled(Text)`
    color: ${colors.gray[500]};
`;

const Link = styled.a`
    color: ${colors.blue[500]};
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;

const ModalFooter = styled.div`
    display: flex;
    justify-content: flex-end;
`;

type Props = {
    visible: boolean;
    onClose: () => void;
    accessToken: string;
    expiresInText: string;
};

export const AccessTokenModal = ({ visible, onClose, accessToken, expiresInText }: Props) => {
    const { t } = useTranslation();
    const baseUrl = window.location.origin;
    const accessTokenCurl = `curl -X POST '${baseUrl}${resolveRuntimePath('/api/graphql')}' \\
--header 'Authorization: Bearer ${accessToken}' \\
--header 'Content-Type: application/json' \\
--data-raw '{"query":"{\\n  me {\\n    corpUser {\\n        username\\n    }\\n  }\\n}","variables":{}}'`;

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        message.success(t('common.copiedToClipboard', { label }));
    };

    if (!visible) {
        return null;
    }

    return (
        <Modal
            width={700}
            title={t('settings.accessTokens.newAccessToken')}
            onCancel={onClose}
            dataTestId="access-token-modal"
            footer={
                <ModalFooter>
                    <Button id="createTokenButton" onClick={onClose} data-testid="access-token-modal-close-button">
                        {t('common.close')}
                    </Button>
                </ModalFooter>
            }
        >
            <ModalContent>
                <InfoAlert>
                    <InfoIcon />
                    <Text size="sm">
                        {t('settings.accessTokens.makeSureTokenCopy')}
                    </Text>
                </InfoAlert>

                <Section>
                    <Text size="md" weight="semiBold">
                        {t('settings.accessTokens.token')}
                    </Text>
                    <ExpirationText size="sm">{expiresInText}</ExpirationText>
                    <CodeBlock>
                        <CodeContent data-testid="access-token-value">{accessToken}</CodeContent>
                        <CopyButton
                            variant="text"
                            size="sm"
                            onClick={() => copyToClipboard(accessToken, t('settings.accessTokens.token'))}
                            data-testid="copy-token-button"
                            icon={{ icon: 'ContentCopy' as IconNames, source: 'material' }}
                        >
                            {t('common.copy')}
                        </CopyButton>
                    </CodeBlock>
                </Section>

                <Section>
                    <Text size="md" weight="semiBold">
                        {t('settings.accessTokens.usage')}
                    </Text>
                    <Text size="sm" color="gray">
                        {t('settings.accessTokens.usageDescription')}
                    </Text>
                    <CodeBlock>
                        <CodeContent data-testid="access-token-curl">{accessTokenCurl}</CodeContent>
                        <CopyButton
                            variant="text"
                            size="sm"
                            onClick={() => copyToClipboard(accessTokenCurl, t('settings.accessTokens.curlCommand'))}
                            data-testid="copy-curl-button"
                            icon={{ icon: 'ContentCopy' as IconNames, source: 'material' }}
                        >
                            {t('common.copy')}
                        </CopyButton>
                    </CodeBlock>
                </Section>

                <Section>
                    <Text size="md" weight="semiBold">
                        {t('common.learnMore')}
                    </Text>
                    <Text size="sm" color="gray">
                        {t('settings.accessTokens.learnMoreText')}{' '}
                        <Link href="https://www.datahubproject.io/docs/" target="_blank" rel="noopener noreferrer">
                            {t('settings.accessTokens.datahubDocs')}
                        </Link>
                        .
                    </Text>
                </Section>
            </ModalContent>
        </Modal>
    );
};
