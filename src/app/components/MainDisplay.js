import React from 'react';
import styled from 'styled-components';
import { IoMdExpand, IoMdContract } from 'react-icons/io';
import MarkdownPreviewComponent from './MarkdownPreview';
import { IconButton } from './common/IconButton';

const MainContent = styled.main`
    flex-grow: 1; padding: 0; display: flex; flex-direction: column;
    overflow: hidden; min-width: 0;
    background-color: ${({ theme }) => theme.body};
    transition: background-color 0.2s ease;
`;

const MainContentHeader = styled.header`
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid ${({ theme }) => theme.borderColor};
    background-color: ${({ theme }) => theme.headerControlsBg};
    flex-shrink: 0;
    transition: background-color 0.2s ease, border-color 0.2s ease;
    min-height: 57px;

    @media (max-width: 768px) {
        padding: 8px 15px;
        min-height: 50px;
    }
`;

const CurrentNoteTitle = styled.h1`
    margin: 0;
    font-size: 1.3em;
    color: ${({ theme }) => theme.text};
    word-break: break-word;
    flex-grow: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: color 0.2s ease;

    @media (max-width: 768px) {
        font-size: 1.15em;
    }
`;

const HeaderControls = styled.div`
    display: flex; align-items: center; gap: 10px;
`;

const EditorPreviewContainer = styled.div`
    display: flex;
    flex-grow: 1;
    gap: ${props => (props.isPreviewEditorHidden || props.isPreviewAreaMaximized) ? '0' : '20px'};
    overflow: hidden;
    padding: ${props => (props.isPreviewEditorHidden || props.isPreviewAreaMaximized) ? '0' : '20px'};
    background-color: ${({ theme }) => theme.body};
    transition: padding 0.3s ease-in-out, gap 0.3s ease-in-out;
  
    @media (max-width: 768px) {
        flex-direction: column;
        padding: 10px;
        gap: 10px;
    }
`;

const EditorTextarea = styled.textarea`
    flex-basis: ${props => props.isPreviewEditorHidden ? '0%' : '50%'};
    flex-grow: ${props => props.isPreviewEditorHidden ? '0' : '1'};
    opacity: ${props => props.isPreviewEditorHidden ? '0' : '1'};
    padding: ${props => props.isPreviewEditorHidden ? '0' : '15px'};
    border-width: ${props => props.isPreviewEditorHidden ? '0' : '1px'};
    margin-right: ${props => (props.isPreviewEditorHidden || props.isPreviewAreaMaximized) ? '0' : '0'};

    display: block;
    border-style: solid;
    border-color: ${({ theme }) => theme.borderColor};
    background-color: ${({ theme }) => theme.inputBg};
    color: ${({ theme }) => theme.text};
    border-radius: ${props => (props.isPreviewEditorHidden || props.isPreviewAreaMaximized) ? '0' : '6px'};
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
    font-size: 0.95em; 
    line-height: 1.6; 
    resize: none;
    transition: flex-basis 0.3s ease-in-out,
              opacity 0.2s ease-in-out, 
              padding 0.3s ease-in-out, 
              border-width 0.3s ease-in-out,
              margin-right 0.3s ease-in-out;
    height: 100%;
    overflow-y: auto;
    min-width: ${props => props.isPreviewEditorHidden ? '0' : 'auto'}; /* 隠れるときに幅0を許容 */


    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.inputFocusBorder};
        box-shadow: ${({ theme }) => theme.inputFocusBoxShadow};
    }

    @media (max-width: 768px) {
        font-size: 0.9em;
    flex-basis: ${props => props.isPreviewEditorHidden ? '0' : 'auto'}; /* モバイルではauto or 0 */
    height: ${props => props.isPreviewEditorHidden ? '0' : '50vh'}; /* 変更: vh単位などで高さを確保 */
    min-height: ${props => props.isPreviewEditorHidden ? '0' : '200px'};
    border-radius: 6px;
    opacity: ${props => props.isPreviewEditorHidden ? '0' : '1'}; /* モバイルでもopacity制御 */
    padding: ${props => props.isPreviewEditorHidden ? '0' : '15px'}; /* モバイルでもpadding制御 */
    border-width: ${props => props.isPreviewEditorHidden ? '0' : '1px'}; /* モバイルでもborder制御 */
    margin-bottom: ${props => (props.isPreviewEditorHidden) ? '0' : '10px'}; /* エディタ表示時に下にgapの代わり */
    flex-grow: 1;

  }
`;

const PreviewArea = styled.section`
    flex-basis: ${props => (props.isPreviewEditorHidden || props.isPreviewAreaMaximized) ? '100%' : '50%'}; /* 変更: width -> flex-basis */
    flex-grow: 1;

    display: block;
    border: 1px solid ${({ theme }) => theme.borderColor};
    border-radius: ${props => (props.isPreviewEditorHidden || props.isPreviewAreaMaximized) ? '0' : '6px'};
    padding: ${props => (props.isPreviewEditorHidden || props.isPreviewAreaMaximized) ? '20px' : '15px'};
    overflow-y: auto;
    background-color: ${({ theme }) => theme.markdownBg};
    color: ${({ theme }) => theme.text};
    word-wrap: break-word;
    transition: flex-basis 0.3s ease-in-out, 
              padding 0.3s ease-in-out,
              border-radius 0.3s ease-in-out;
    height: 100%;


    ${props => (props.isPreviewEditorHidden || props.isPreviewAreaMaximized) && `
        border-left-width: 0; 
        border-right-width: 0; 
        border-bottom-width: 0;
        `
    }

    @media (max-width: 768px) {
    font-size: 0.9em;
    flex-basis: auto;
    height: ${props => (props.isPreviewEditorHidden || props.isPreviewAreaMaximized) ? '100%' : 'auto'};
    min-height: ${props => (props.isPreviewEditorHidden || props.isPreviewAreaMaximized) ? '0' : '200px'};
    border-radius: 6px;
    padding: 15px;
    flex-grow: 1;
  }
`;


const NoNoteSelectedMessage = styled.div`
    text-align: center; color: ${({ theme }) => theme.text}; font-size: 1.1em;
    flex-grow: 1; display: flex; align-items: center; justify-content: center;
    padding: 20px; opacity: 0.7;
`;

const MainDisplay = ({
    activeNote,
    editingContent,
    handleContentChange,
    isPreviewEditorHidden,
    toggleEditorVisibility,
}) => {
    if (!activeNote) {
        return (
            <MainContent>
                <NoNoteSelectedMessage>ノートを選択するか、新しいノートを作成してください。</NoNoteSelectedMessage>
            </MainContent>
        );
    }

    return (
        <MainContent>
            <MainContentHeader>
                <CurrentNoteTitle title={activeNote.title}>{activeNote.title}</CurrentNoteTitle>
                <HeaderControls>
                    <IconButton
                        onClick={toggleEditorVisibility}
                        title={isPreviewEditorHidden ? "エディタ表示" : "プレビュー最大化"}
                        disabled={!activeNote}
                    >
                        {isPreviewEditorHidden ? <IoMdContract /> : <IoMdExpand />}
                    </IconButton>
                </HeaderControls>
            </MainContentHeader>
            <EditorPreviewContainer isPreviewEditorHidden={isPreviewEditorHidden} isPreviewAreaMaximized={isPreviewEditorHidden}>
                <EditorTextarea
                    value={editingContent}
                    onChange={handleContentChange}
                    placeholder="マークダウンでノートを記述..."
                    isPreviewEditorHidden={isPreviewEditorHidden}
                    isPreviewAreaMaximized={false} 
                />
                <PreviewArea 
                    isPreviewAreaMaximized={isPreviewEditorHidden} 
                    isPreviewEditorHidden={false}
                >
                    <MarkdownPreviewComponent content={editingContent} />
                </PreviewArea>
            </EditorPreviewContainer>
        </MainContent>
    );
};

export default MainDisplay;