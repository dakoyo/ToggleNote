import React, { useMemo } from 'react';
import styled from 'styled-components';
import { marked } from 'marked';
import { preprocessSpoilers } from '../utils/markdownUtils';

export const MarkdownPreviewWrapper = styled.div``;

const MarkdownPreviewComponent = React.memo(({ content }) => {
    const processedContent = useMemo(() => {
        if (typeof content !== 'string') return '';
        const preprocessed = preprocessSpoilers(content);
        return marked.parse(preprocessed);
    }, [content]);

    const handlePreviewClick = (event) => {
        if (event.target.classList.contains('spoiler-text')) {
            event.target.classList.toggle('revealed');
        }
    };

    return (
        <MarkdownPreviewWrapper
            onClick={handlePreviewClick}
            dangerouslySetInnerHTML={{ __html: processedContent }}
        />
    );
});

export default MarkdownPreviewComponent;