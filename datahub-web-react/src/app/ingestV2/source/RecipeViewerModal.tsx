import Editor from '@monaco-editor/react';
import { Button, Modal } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';

import { jsonToYaml } from '@app/ingestV2/source/utils';

const YamlWrapper = styled.div`
    padding: 24px;
`;

interface Props {
    recipe?: string;
    onCancel: () => void;
}

function RecipeViewerModal({ recipe, onCancel }: Props) {
    const { t } = useTranslation();
    const formattedRecipe = recipe ? jsonToYaml(recipe) : '';

    return (
        <Modal
            open
            onCancel={onCancel}
            width={800}
            title={t('ingest.source.viewIngestionRecipe')}
            footer={<Button onClick={onCancel}>{t('ingest.source.done')}</Button>}
        >
            <YamlWrapper>
                <Editor
                    options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        scrollbar: {
                            vertical: 'hidden',
                            horizontal: 'hidden',
                        },
                    }}
                    height="55vh"
                    defaultLanguage="yaml"
                    value={formattedRecipe}
                />
            </YamlWrapper>
        </Modal>
    );
}

export default RecipeViewerModal;
