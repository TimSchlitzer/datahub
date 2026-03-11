import { red } from '@ant-design/colors';
import { DeleteOutlined, InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { PageTitle } from '@components';
import { Alert, Button, Divider, Dropdown, Empty, Pagination, Select, Typography, message } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import analytics, { EventType } from '@app/analytics';
import { useUserContext } from '@app/context/useUserContext';
import { StyledTable } from '@app/entity/shared/components/styled/StyledTable';
import TabToolbar from '@app/entity/shared/components/styled/TabToolbar';
import CreateTokenModal from '@app/settingsV2/CreateTokenModal';
import SelectServiceAccountModal from '@app/settingsV2/SelectServiceAccountModal';
import { Message } from '@app/shared/Message';
import { OwnerLabel } from '@app/shared/OwnerLabel';
import { scrollToTop } from '@app/shared/searchUtils';
import { getLocaleTimezone } from '@app/shared/time/timeUtils';
import { ConfirmationModal } from '@app/sharedV2/modals/ConfirmationModal';
import { useAppConfig } from '@app/useAppConfig';
import { useEntityRegistry } from '@app/useEntityRegistry';

import { useListAccessTokensQuery, useRevokeAccessTokenMutation } from '@graphql/auth.generated';
import { useListUsersQuery } from '@graphql/user.generated';
import { AccessTokenType, EntityType, FacetFilterInput, ServiceAccount } from '@types';

const SourceContainer = styled.div`
    width: 100%;
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    overflow: auto;
`;

const TokensContainer = styled.div`
    padding-top: 0px;
`;

const StyledAlert = styled(Alert)`
    padding-top: 12px;
    padding-bottom: 12px;
    margin-bottom: 20px;
`;

const StyledSelectOwner = styled(Select)`
    margin-right: 15px;
    width: 200px;
`;

const StyledSelect = styled(Select)`
    margin-right: 15px;
    min-width: 75px;
`;

const StyledInfoCircleOutlined = styled(InfoCircleOutlined)`
    margin-right: 8px;
`;

const PersonTokenDescriptionText = styled(Typography.Paragraph)`
    && {
        max-width: 700px;
        margin-top: 12px;
        margin-bottom: 16px;
    }
`;

const ActionButtonContainer = styled.div`
    display: flex;
    justify-content: right;
`;

const PaginationContainer = styled.div`
    display: flex;
    justify-content: center;
`;

const NeverExpireText = styled.span`
    color: ${red[5]};
`;

const SelectContainer = styled.div`
    display: flex;
    align-items: flex-start;
`;

const DEFAULT_PAGE_SIZE = 10;

export enum StatusType {
    ALL,
    EXPIRED,
}

export const AccessTokens = () => {
    const { t } = useTranslation();
    const [createTokenFor, setCreateTokenFor] = useState<'personal' | 'remote-executor' | undefined>(undefined);
    const [showSelectServiceAccountModal, setShowSelectServiceAccountModal] = useState(false);
    const [selectedServiceAccount, setSelectedServiceAccount] = useState<ServiceAccount | null>(null);
    const [removedTokens, setRemovedTokens] = useState<string[]>([]);
    const [statusFilter, setStatusFilter] = useState(StatusType.ALL);
    const [owner, setOwner] = useState('All');
    const [filters, setFilters] = useState<Array<FacetFilterInput> | null>(null);
    const [query, setQuery] = useState<undefined | string>(undefined);
    const [tokenToBeRemoved, setTokenToBeRemoved] = useState<any>(null);
    // Current User Urn
    const authenticatedUser = useUserContext();
    const entityRegistry = useEntityRegistry();
    const currentUserUrn = authenticatedUser?.user?.urn || '';

    useEffect(() => {
        if (currentUserUrn) {
            setFilters([
                {
                    field: 'ownerUrn',
                    values: [currentUserUrn],
                },
            ]);
        }
    }, [currentUserUrn]);

    const isTokenAuthEnabled = useAppConfig().config?.authConfig?.tokenAuthEnabled;
    const canGeneratePersonalAccessTokens =
        isTokenAuthEnabled && authenticatedUser?.platformPrivileges?.generatePersonalAccessTokens;

    const canManageToken = authenticatedUser?.platformPrivileges?.manageTokens;
    const canManageServiceAccounts = authenticatedUser?.platformPrivileges?.manageServiceAccounts;

    // Access Tokens list paging.
    const [page, setPage] = useState(1);
    const pageSize = DEFAULT_PAGE_SIZE;
    const start = (page - 1) * pageSize;

    // Call list Access Token Mutation
    const {
        loading: tokensLoading,
        error: tokensError,
        data: tokensData,
        refetch: tokensRefetch,
    } = useListAccessTokensQuery({
        skip: !canGeneratePersonalAccessTokens || !filters,
        variables: {
            input: {
                start,
                count: pageSize,
                filters,
            },
        },
    });

    const { data: usersData } = useListUsersQuery({
        skip: !canGeneratePersonalAccessTokens || !canManageToken,
        variables: {
            input: {
                start,
                count: 10,
                query: (query?.length && query) || undefined,
            },
        },
        fetchPolicy: 'no-cache',
    });

    useEffect(() => {
        const timestamp = Date.now();
        const lessThanStatus = { field: 'expiresAt', values: [`${timestamp}`], condition: 'LESS_THAN' };
        if (canManageToken) {
            const newFilters: any = owner && owner !== 'All' ? [{ field: 'ownerUrn', values: [owner] }] : [];
            if (statusFilter === StatusType.EXPIRED) {
                newFilters.push(lessThanStatus);
            }
            setFilters(newFilters);
        } else if (filters && statusFilter === StatusType.EXPIRED) {
            const currentUserFilters: any = [...filters];
            currentUserFilters.push(lessThanStatus);
            setFilters(currentUserFilters);
        } else if (filters) {
            setFilters(filters.filter((filter) => filter?.field !== 'expiresAt'));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canManageToken, owner, statusFilter]);

    const renderSearchResult = (entity: any) => {
        const { editableProperties } = entity;
        const displayNameSearchResult = entityRegistry.getDisplayName(EntityType.CorpUser, entity);
        const avatarUrl = editableProperties?.pictureLink || undefined;
        return (
            <Select.Option value={entity.urn} key={entity.urn}>
                <OwnerLabel name={displayNameSearchResult} avatarUrl={avatarUrl} type={entity.type} />
            </Select.Option>
        );
    };
    const ownerResult = usersData?.listUsers?.users;

    const ownerSearchOptions = ownerResult?.map((result) => {
        return renderSearchResult(result);
    });

    const totalTokens = tokensData?.listAccessTokens?.total || 0;
    const tokens = useMemo(() => tokensData?.listAccessTokens?.tokens || [], [tokensData]);
    const filteredTokens = tokens.filter((token) => !removedTokens.includes(token.id));

    const [revokeAccessToken, { error: revokeTokenError }] = useRevokeAccessTokenMutation();

    // Revoke token Handler
    const onRemoveToken = (token: any) => {
        // Hack to deal with eventual consistency.
        const newTokenIds = [...removedTokens, token.id];
        setRemovedTokens(newTokenIds);

        revokeAccessToken({ variables: { tokenId: token.id } })
            .then(({ errors }) => {
                if (!errors) {
                    analytics.event({ type: EventType.RevokeAccessTokenEvent });
                }
            })
            .catch((e) => {
                message.destroy();
                message.error({ content: `Failed to revoke Token!: \n ${e.message || ''}`, duration: 3 });
            })
            .finally(() => {
                setTimeout(() => {
                    tokensRefetch?.();
                }, 3000);
            });
    };

    const tableData = filteredTokens?.map((token) => ({
        urn: token.urn,
        id: token.id,
        name: token.name,
        description: token.description,
        actorUrn: token.actorUrn,
        ownerUrn: token.ownerUrn,
        owner: (token as any).owner,
        createdAt: token.createdAt,
        expiresAt: token.expiresAt,
    }));

    const tableColumns = [
        {
            title: t('settings.accessTokens.table.name'),
            dataIndex: 'name',
            key: 'name',
            render: (name: string) => <b>{name}</b>,
        },
        {
            title: t('settings.accessTokens.table.description'),
            dataIndex: 'description',
            key: 'description',
            render: (description: string) => description || '',
        },
        {
            title: t('settings.accessTokens.table.expiresAt'),
            dataIndex: 'expiresAt',
            key: 'expiresAt',
            render: (expiresAt: string) => {
                if (expiresAt === null) return <NeverExpireText>{t('settings.accessTokens.table.never')}</NeverExpireText>;
                const localeTimezone = getLocaleTimezone();
                const formattedExpireAt = new Date(expiresAt);
                return (
                    <span>{`${formattedExpireAt.toLocaleDateString()} at ${formattedExpireAt.toLocaleTimeString()} (${localeTimezone})`}</span>
                );
            },
        },
        {
            title: t('settings.accessTokens.table.owner'),
            dataIndex: 'owner',
            key: 'owner',
            render: (tokenOwner: any, record: any) => {
                if (!tokenOwner && !record.ownerUrn) return '';
                const ownerUrn = tokenOwner?.urn || record.ownerUrn;
                const displayName = tokenOwner
                    ? entityRegistry.getDisplayName(EntityType.CorpUser, tokenOwner)
                    : ownerUrn?.replace('urn:li:corpuser:', '');
                const link = `/${entityRegistry.getPathName(EntityType.CorpUser)}/${encodeURIComponent(ownerUrn)}`;
                return <a href={link}>{displayName}</a>;
            },
        },
        {
            title: '',
            dataIndex: '',
            key: 'x',
            render: (_, record: any) => (
                <ActionButtonContainer>
                    <Button
                        onClick={() => setTokenToBeRemoved(record)}
                        icon={<DeleteOutlined />}
                        danger
                        data-testid="revoke-token-button"
                    >
                        {t('common.revoke')}
                    </Button>
                </ActionButtonContainer>
            ),
        },
    ];

    const filterColumns = canManageToken ? tableColumns : tableColumns.filter((column) => column.key !== 'owner');

    const onChangePage = (newPage: number) => {
        scrollToTop();
        setPage(newPage);
    };

    return (
        <SourceContainer>
            {tokensLoading && !tokensData && (
                <Message type="loading" content={t('settings.accessTokens.loading')} style={{ marginTop: '10%' }} />
            )}
            {tokensError && message.error(t('common.error'))}
            {revokeTokenError && message.error(t('common.error'))}
            <TokensContainer>
                <PageTitle title={t('settings.accessTokens.pageTitle')} subTitle={t('settings.accessTokens.pageSubtitle')} />
            </TokensContainer>
            <Divider />
            {isTokenAuthEnabled === false && (
                <StyledAlert
                    type="error"
                    message={
                        <span>
                            <StyledInfoCircleOutlined />
                            {t('settings.accessTokens.disabledAlert')}
                        </span>
                    }
                />
            )}
            <Typography.Title level={5}>{t('settings.accessTokens.personalTokensTitle')}</Typography.Title>
            <PersonTokenDescriptionText type="secondary">
                {t('settings.accessTokens.descriptionV2')}
            </PersonTokenDescriptionText>
            <TabToolbar>
                <div>
                    {/* NOTE: only for SaaS. If this is brought into OSS, we will need to disable the dropdown and have the button onClick open the personal token modal */}
                    <Dropdown
                        disabled={!canGeneratePersonalAccessTokens}
                        placement="bottom"
                        menu={{
                            items: [
                                {
                                    key: 'personal',
                                    className: 'personal-token-dropdown-option',
                                    label: t('settings.accessTokens.type.personal'),
                                    onClick: () => setCreateTokenFor('personal'),
                                },
                                {
                                    key: 'remote-executor',
                                    className: 'remote-executor-dropdown-option',
                                    label: t('settings.accessTokens.type.remoteExecutor'),
                                    onClick: () => setCreateTokenFor('remote-executor'),
                                },
                                ...(canManageServiceAccounts
                                    ? [
                                          {
                                              key: 'service-account',
                                              className: 'service-account-dropdown-option',
                                              label: t('settings.accessTokens.type.serviceAccount'),
                                              onClick: () => setShowSelectServiceAccountModal(true),
                                          },
                                      ]
                                    : []),
                            ],
                        }}
                    >
                        <Button type="text" data-testid="add-token-button" disabled={!canGeneratePersonalAccessTokens}>
                            <PlusOutlined /> {t('settings.accessTokens.generateToken')}
                        </Button>
                    </Dropdown>
                </div>
                <SelectContainer>
                    {canGeneratePersonalAccessTokens && canManageToken && (
                        <>
                            <StyledSelectOwner
                                showSearch
                                placeholder={t('settings.accessTokens.filterOwner')}
                                optionFilterProp="children"
                                allowClear
                                filterOption={false}
                                defaultActiveFirstOption={false}
                                onSelect={(ownerData: any) => {
                                    setOwner(ownerData);
                                }}
                                onClear={() => {
                                    setQuery('');
                                    setOwner('All');
                                }}
                                onSearch={(value: string) => {
                                    setQuery(value.trim());
                                }}
                                style={{ width: 200 }}
                            >
                                {ownerSearchOptions}
                            </StyledSelectOwner>
                        </>
                    )}
                    {canGeneratePersonalAccessTokens && (
                        <StyledSelect
                            value={statusFilter}
                            onChange={(selection) => setStatusFilter(selection as StatusType)}
                            style={{ width: 100 }}
                        >
                            <Select.Option value={StatusType.ALL} key="ALL">
                                {t('settings.accessTokens.filterAll')}
                            </Select.Option>
                            <Select.Option value={StatusType.EXPIRED} key="EXPIRED">
                                {t('settings.accessTokens.filterExpired')}
                            </Select.Option>
                        </StyledSelect>
                    )}
                </SelectContainer>
            </TabToolbar>
            <StyledTable
                columns={filterColumns}
                dataSource={tableData}
                rowKey="urn"
                locale={{
                    emptyText: <Empty description={t('settings.accessTokens.noTokens')} image={Empty.PRESENTED_IMAGE_SIMPLE} />,
                }}
                pagination={false}
            />
            <PaginationContainer>
                <Pagination
                    style={{ margin: 40 }}
                    current={page}
                    pageSize={pageSize}
                    total={totalTokens}
                    showLessItems
                    onChange={onChangePage}
                    showSizeChanger={false}
                />
            </PaginationContainer>
            <CreateTokenModal
                currentUserUrn={currentUserUrn}
                visible={!!createTokenFor}
                forRemoteExecutor={createTokenFor === 'remote-executor'}
                onClose={() => setCreateTokenFor(undefined)}
                onCreateToken={() => {
                    // Hack to deal with eventual consistency.
                    setTimeout(() => {
                        tokensRefetch?.();
                    }, 3000);
                }}
            />
            <ConfirmationModal
                isOpen={!!tokenToBeRemoved}
                handleClose={() => setTokenToBeRemoved(null)}
                handleConfirm={() => {
                    onRemoveToken(tokenToBeRemoved);
                    setTokenToBeRemoved(null);
                }}
                modalTitle={t('settings.accessTokens.revokeConfirmTitle')}
                modalText={t('settings.accessTokens.revokeConfirmContent')}
            />
            <SelectServiceAccountModal
                visible={showSelectServiceAccountModal}
                onClose={() => setShowSelectServiceAccountModal(false)}
                onSelectServiceAccount={(serviceAccount) => {
                    setShowSelectServiceAccountModal(false);
                    setSelectedServiceAccount(serviceAccount);
                }}
            />
            {selectedServiceAccount && (
                <CreateTokenModal
                    visible={!!selectedServiceAccount}
                    actorUrn={selectedServiceAccount.urn}
                    tokenType={AccessTokenType.ServiceAccount}
                    actorDisplayName={selectedServiceAccount.displayName || selectedServiceAccount.name}
                    onClose={() => setSelectedServiceAccount(null)}
                    onCreateToken={() => {
                        setSelectedServiceAccount(null);
                        tokensRefetch?.();
                    }}
                />
            )}
        </SourceContainer>
    );
};
