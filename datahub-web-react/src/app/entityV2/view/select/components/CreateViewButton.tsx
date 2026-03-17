import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import {
    CardViewLabel,
    ViewContainer,
    ViewContent,
    ViewDescription,
    ViewIcon,
    ViewIconNavBarRedesign,
} from '@app/entityV2/view/select/styledComponents';
import { useShowNavBarRedesign } from '@app/useShowNavBarRedesign';

const AddOutlinedIconStyle = styled(AddOutlinedIcon)`
    font-size: 18px !important;
`;

interface Props {
    onClick?: () => void;
}

export default function CreateViewButton({ onClick }: Props) {
    const { t } = useTranslation();
    const isShowNavBarRedesign = useShowNavBarRedesign();
    const IconWrapper = isShowNavBarRedesign ? ViewIconNavBarRedesign : ViewIcon;

    return (
        <ViewContainer onClick={() => onClick?.()} role="none" $isShowNavBarRedesign={isShowNavBarRedesign}>
            <IconWrapper>
                <AddOutlinedIconStyle />
            </IconWrapper>
            <ViewContent $isShowNavBarRedesign={isShowNavBarRedesign}>
                <CardViewLabel className="static" $isShowNavBarRedesign={isShowNavBarRedesign}>
                    {t('entityV2.view.createAView')}
                </CardViewLabel>
                <ViewDescription $isShowNavBarRedesign={isShowNavBarRedesign}>
                    {isShowNavBarRedesign ? t('entityV2.view.createAViewDescription') : t('entityV2.view.createView')}
                </ViewDescription>
            </ViewContent>
        </ViewContainer>
    );
}
