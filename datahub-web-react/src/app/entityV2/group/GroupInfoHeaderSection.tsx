import { LockOutlined } from '@ant-design/icons';
import { Tooltip } from '@components';
import { Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { MemberCount } from '@app/entityV2/group/GroupSidebar';
import { REDESIGN_COLORS } from '@app/entityV2/shared/constants';

import { EntityRelationshipsResult } from '@types';

const GroupHeader = styled.div`
    position: relative;
    z-index: 2;
`;

const GroupName = styled(Typography.Title)`
    word-wrap: break-word;
    text-align: left;
    &&& {
        margin-bottom: 0;
        word-break: break-all;
        font-size: 12px;
        color: ${REDESIGN_COLORS.WHITE};
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }

    .ant-typography-edit {
        font-size: 12px;
    }
`;

type Props = {
    groupMemberRelationships: EntityRelationshipsResult;
    isExternalGroup: boolean;
    externalGroupType: string | undefined;
    groupName: string | undefined;
};

export const GroupInfoHeaderSection = ({
    groupMemberRelationships,
    externalGroupType,
    isExternalGroup,
    groupName,
}: Props) => {
    const { t } = useTranslation();
    const groupMemberRelationshipsTotal = groupMemberRelationships?.total || 0;
    return (
        <GroupHeader>
            <Tooltip title={groupName}>
                <GroupName level={3}>{groupName}</GroupName>
            </Tooltip>
            {groupMemberRelationshipsTotal > 0 && (
                <MemberCount>{t('group.membersCount', { count: groupMemberRelationshipsTotal })}</MemberCount>
            )}
            {isExternalGroup && (
                <Tooltip title={t('group.cantEditBecauseExternalGroup', { externalGroupType })}>
                    <LockOutlined />
                </Tooltip>
            )}
        </GroupHeader>
    );
};
