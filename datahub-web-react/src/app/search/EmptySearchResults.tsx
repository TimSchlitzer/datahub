import { RocketOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import styled from 'styled-components';

import analytics, { EventType } from '@app/analytics';
import { useUserContext } from '@app/context/useUserContext';
import { ANTD_GRAY_V2 } from '@app/entity/shared/constants';
import { SuggestedText } from '@app/search/suggestions/SearchQuerySugggester';
import useGetSearchQueryInputs from '@app/search/useGetSearchQueryInputs';
import { navigateToSearchUrl } from '@app/search/utils/navigateToSearchUrl';

import { FacetFilterInput, SearchSuggestion } from '@types';

const NoDataContainer = styled.div`
    margin: 40px auto;
    font-size: 16px;
    color: ${ANTD_GRAY_V2[8]};
`;

const Section = styled.div`
    margin-bottom: 16px;
`;

function getRefineSearchText(filters: FacetFilterInput[], t: (key: string) => string, viewUrn?: string | null) {
    let text = '';
    if (filters.length && viewUrn) {
        text = t('search.tryOptionFilterAndViewUrn');
    } else if (filters.length) {
        text = t('search.tryOptionFilter');
    } else if (viewUrn) {
        text = t('search.tryOptionViewUrn');
    }

    return text;
}

interface Props {
    suggestions: SearchSuggestion[];
}

export default function EmptySearchResults({ suggestions }: Props) {
    const { query, filters, viewUrn } = useGetSearchQueryInputs();
    const history = useHistory();
    const userContext = useUserContext();
    const { t } = useTranslation();
    const suggestText = suggestions.length > 0 ? suggestions[0].text : '';
    const refineSearchText = getRefineSearchText(filters, t, viewUrn);

    const onClickExploreAll = useCallback(() => {
        analytics.event({ type: EventType.SearchResultsExploreAllClickEvent });
        navigateToSearchUrl({ query: '*', history });
    }, [history]);

    const searchForSuggestion = () => {
        navigateToSearchUrl({ query: suggestText, history });
    };

    const clearFiltersAndView = () => {
        navigateToSearchUrl({ query, history });
        userContext.updateLocalState({
            ...userContext.localState,
            selectedViewUrn: undefined,
        });
    };

    return (
        <NoDataContainer>
            <Section>{t('search.noResultsFor', { query })}</Section>
            {refineSearchText && (
                <>
                    {t('search.try')} <SuggestedText onClick={clearFiltersAndView}>{refineSearchText}</SuggestedText>{' '}
                    {suggestText && (
                        <>
                            {t('search.orSearchFor')}{' '}
                            <SuggestedText onClick={searchForSuggestion}>{suggestText}</SuggestedText>
                        </>
                    )}
                </>
            )}
            {!refineSearchText && suggestText && (
                <>
                    {t('search.didYouMean')} <SuggestedText onClick={searchForSuggestion}>{suggestText}</SuggestedText>
                </>
            )}
            {!refineSearchText && !suggestText && (
                <Button onClick={onClickExploreAll}>
                    <RocketOutlined /> {t('search.exploreAll')}
                </Button>
            )}
        </NoDataContainer>
    );
}
