import { Button, Loader, borders, colors, radius, spacing } from '@components';
import { useDraggable } from '@dnd-kit/core';
import React, { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import analytics, { EventType } from '@app/analytics';
import { usePageTemplateContext } from '@app/homeV3/context/PageTemplateContext';
import ModuleContainer from '@app/homeV3/module/components/ModuleContainer';
import ModuleMenu from '@app/homeV3/module/components/ModuleMenu';
import ModuleName from '@app/homeV3/module/components/ModuleName';
import { DragIcon } from '@app/homeV3/module/components/SmallModule';
import { ModuleProps } from '@app/homeV3/module/types';
import { FloatingRightHeaderSection } from '@app/homeV3/styledComponents';
import { DataHubPageModuleType } from '@types';

const ModuleHeader = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 2px;
    border-radius: ${radius.lg} ${radius.lg} 0 0;
    padding: ${spacing.sm} ${spacing.lg} ${spacing.sm} ${spacing.md};
    border-bottom: ${borders['1px']} ${colors.white};
    user-select: none;

    /* Optimize for smooth dragging */
    transform: translateZ(0);
    will-change: transform;

    :hover {
        background: linear-gradient(180deg, #fff 0%, #fafafb 100%);
        border-bottom: 1px solid ${colors.gray[100]};
    }

    :hover ${DragIcon} {
        display: block;
    }
`;

const DragHandle = styled.div<{ $isDragging?: boolean; $isDisabled?: boolean }>`
    cursor: ${({ $isDisabled, $isDragging }) => {
        if ($isDisabled) return 'default';
        if ($isDragging) return 'grabbing';
        return 'grab';
    }};
    flex: 1;
    max-width: calc(100% - 10px);
`;

const Content = styled.div<{ $hasViewAll: boolean }>`
    margin: 0 0 8px 8px;
    overflow-y: auto;
    padding-right: 5px;
    scrollbar-gutter: stable;
    height: ${({ $hasViewAll }) => ($hasViewAll ? '234px' : '246px')};
`;

const LoaderContainer = styled.div`
    display: flex;
    height: 100%;
`;

const ViewAllButton = styled(Button)`
    margin: 0 16px 0 auto;
    padding-right: 8px;
`;

const MODULE_TYPE_TITLE_KEYS: Partial<Record<DataHubPageModuleType, string>> = {
    [DataHubPageModuleType.OwnedAssets]: 'homeV3.addModuleMenu.yourAssets.title',
    [DataHubPageModuleType.Domains]: 'homeV3.addModuleMenu.domains.title',
    [DataHubPageModuleType.Platforms]: 'homeV3.addModuleMenu.platforms.title',
    [DataHubPageModuleType.Assets]: 'homeV3.addModuleMenu.assets.title',
    [DataHubPageModuleType.DataProducts]: 'homeV3.addModuleMenu.dataProducts.title',
    [DataHubPageModuleType.ChildHierarchy]: 'homeV3.addModuleMenu.childHierarchy.title',
    [DataHubPageModuleType.RelatedTerms]: 'homeV3.addModuleMenu.relatedTerms.title',
    [DataHubPageModuleType.Lineage]: 'homeV3.addModuleMenu.lineage.title',
    [DataHubPageModuleType.Columns]: 'homeV3.addModuleMenu.columns.title',
    [DataHubPageModuleType.Hierarchy]: 'homeV3.addModuleMenu.hierarchy.title',
    [DataHubPageModuleType.AssetCollection]: 'homeV3.addModuleMenu.collection.title',
};

interface Props extends ModuleProps {
    loading?: boolean;
    onClickViewAll?: () => void;
    viewAllText?: string;
    dataTestId?: string;
}

function LargeModule({
    children,
    module,
    position,
    loading,
    onClickViewAll,
    viewAllText,
    dataTestId,
}: React.PropsWithChildren<Props>) {
    const { t } = useTranslation();
    const { name, type } = module.properties;
    const titleKey = MODULE_TYPE_TITLE_KEYS[type];
    const displayName = titleKey ? t(titleKey) : name;

    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `module-${module.urn}-${position.rowIndex}-${position.moduleIndex}`,
        data: {
            module,
            position,
            isSmall: false,
        },
    });
    const { isTemplateEditable, templateType } = usePageTemplateContext();

    const hasViewAll = useMemo(() => !!onClickViewAll, [onClickViewAll]);

    const onClickViewAllHandler = useCallback(() => {
        onClickViewAll?.();
        analytics.event({
            type: EventType.HomePageTemplateModuleViewAllClick,
            moduleType: module.properties.type,
            location: templateType,
        });
    }, [onClickViewAll, module.properties.type, templateType]);

    return (
        <ModuleContainer $height="316px" ref={setNodeRef} data-testid={dataTestId}>
            <ModuleHeader>
                <DragHandle
                    {...(isTemplateEditable ? listeners : {})}
                    {...(isTemplateEditable ? attributes : {})}
                    $isDragging={isDragging}
                    $isDisabled={!isTemplateEditable}
                    data-testid="large-module-drag-handle"
                >
                    {isTemplateEditable && (
                        <DragIcon
                            {...listeners}
                            size="lg"
                            color="gray"
                            icon="DotsSixVertical"
                            source="phosphor"
                            isDragging={isDragging}
                        />
                    )}
                    <ModuleName text={displayName} />
                    {/* TODO: implement description for modules CH-548 */}
                    {/* <ModuleDescription text={description} /> */}
                </DragHandle>
                {isTemplateEditable && (
                    <FloatingRightHeaderSection>
                        <ModuleMenu module={module} position={position} />
                    </FloatingRightHeaderSection>
                )}
            </ModuleHeader>
            <Content $hasViewAll={hasViewAll} data-testid="module-content">
                {loading ? (
                    <LoaderContainer>
                        <Loader />
                    </LoaderContainer>
                ) : (
                    children
                )}
            </Content>
            {hasViewAll && (
                <ViewAllButton
                    variant="link"
                    color="gray"
                    size="sm"
                    onClick={onClickViewAllHandler}
                    data-testid="view-all"
                >
                    {viewAllText || t('common.viewAll')}
                </ViewAllButton>
            )}
        </ModuleContainer>
    );
}

// Export memoized component to prevent unnecessary re-renders
export default memo(LargeModule);
