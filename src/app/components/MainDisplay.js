import React, { useRef, useMemo } from 'react';
import styled from 'styled-components';
import {
    IoMdExpand,
    IoMdContract
} from 'react-icons/io';
import {
    FaHeading, FaBold, FaItalic, FaListUl, FaListOl, FaTable, FaQuoteLeft, FaCode, FaLink, FaImage,
    FaUndo, FaRedo
} from 'react-icons/fa';
import MarkdownPreviewComponent from './MarkdownPreview';
import { IconButton } from './common/IconButton';

const MainContent = styled.main`
    flex-grow: 1;
    padding: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-width: 0;
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
    display: flex;
    align-items: center;
    gap: 10px;
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

const EditorWrapper = styled.div`
    display: ${props => props.isPreviewEditorHidden ? 'none' : 'flex'};
    flex-direction: column;
    flex-basis: ${props => props.isPreviewEditorHidden ? '0%' : '50%'};
    flex-grow: ${props => props.isPreviewEditorHidden ? '0' : '1'};
    opacity: ${props => props.isPreviewEditorHidden ? '0' : '1'};
    height: 100%;
    min-width: ${props => props.isPreviewEditorHidden ? '0' : 'auto'};
    transition: flex-basis 0.3s ease-in-out, opacity 0.2s ease-in-out;

    @media (max-width: 768px) {
        flex-basis: ${props => props.isPreviewEditorHidden ? '0' : 'auto'};
        height: ${props => props.isPreviewEditorHidden ? '0' : '50vh'};
        min-height: ${props => props.isPreviewEditorHidden ? '0' : '200px'};
        opacity: ${props => props.isPreviewEditorHidden ? '0' : '1'};
        margin-bottom: ${props => (props.isPreviewEditorHidden) ? '0' : '10px'};
        width: 100%;
    }
`;

const Toolbar = styled.div`
    display: flex;
    flex-wrap: wrap;
    padding: 8px 10px;
    background-color: ${({ theme }) => theme.headerControlsBg};
    border: 1px solid ${({ theme }) => theme.borderColor};
    border-bottom: none;
    border-radius: 6px 6px 0 0;
    flex-shrink: 0;

    @media (max-width: 768px) {
        padding: 6px 8px;
    }
`;

const ToolbarButton = styled(IconButton)`
    font-size: 1.1rem;
    padding: 6px 8px;
    margin: 2px;
    border-radius: 4px;
    color: ${({ theme }) => theme.iconColor};

    &:hover {
        background-color: ${({ theme }) => theme.iconHoverBg};
        color: ${({ theme }) => theme.text};
    }
`;

const EditorTextarea = styled.textarea`
    flex-grow: 1;
    padding: 15px;
    border: 1px solid ${({ theme }) => theme.borderColor};
    background-color: ${({ theme }) => theme.inputBg};
    color: ${({ theme }) => theme.text};
    border-radius: 0 0 6px 6px;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
    font-size: 0.95em;
    line-height: 1.6;
    resize: none;
    transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
    overflow-y: auto;
    width: 100%;
    min-height: 100px;


    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.inputFocusBorder};
        box-shadow: ${({ theme }) => theme.inputFocusBoxShadow};
    }

    @media (max-width: 768px) {
        font-size: 0.9em;
    }
`;

const PreviewArea = styled.section`
    flex-basis: ${props => (props.isPreviewEditorHidden || props.isPreviewAreaMaximized) ? '100%' : '50%'};
    flex-grow: 1;
    display: block;
    border: 1px solid ${({ theme }) => theme.borderColor};
    border-radius: ${props => (props.isPreviewEditorHidden || props.isPreviewAreaMaximized) ? '0' : '6px'};
    padding: ${props => (props.isPreviewEditorHidden || props.isPreviewAreaMaximized) ? '20px' : '15px'};
    overflow-y: auto;
    background-color: ${({ theme }) => theme.markdownBg};
    color: ${({ theme }) => theme.text};
    word-wrap: break-word;
    transition: flex-basis 0.3s ease-in-out, padding 0.3s ease-in-out, border-radius 0.3s ease-in-out;
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
    text-align: center;
    color: ${({ theme }) => theme.text};
    font-size: 1.1em;
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    opacity: 0.7;
`;

const insertText = (textarea, textToInsert, selectInserted = false, prefix = "", suffix = "") => {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;
    const selectedText = currentText.substring(start, end);

    let newText;
    let newStart;
    let newEnd;

    if (selectedText) {
        newText = prefix + selectedText + suffix;
        textarea.setRangeText(newText, start, end, 'select');
        newStart = start + prefix.length;
        newEnd = newStart + selectedText.length;
    } else {
        newText = prefix + textToInsert + suffix;
        textarea.setRangeText(newText, start, start, 'end');
        newStart = start + prefix.length;
        newEnd = newStart + textToInsert.length;
    }

    if (selectInserted) {
        textarea.focus();
        textarea.setSelectionRange(newStart, newEnd);
    }
    return { start: newStart, end: newEnd };
};

const insertLine = (textarea, lineContent, placeholder = "テキスト") => {
    const start = textarea.selectionStart;
    const currentText = textarea.value;
    const textBeforeCursor = currentText.substring(0, start);

    const insertNewLineBefore = (start > 0 && !textBeforeCursor.endsWith('\n')) ? '\n' : '';
    const fullTextToInsert = insertNewLineBefore + lineContent + '\n';

    textarea.setRangeText(fullTextToInsert, start, start, 'end');
    textarea.focus();

    const insertedStart = start + insertNewLineBefore.length;

    const placeholderIndex = lineContent.indexOf(placeholder);
    if (placeholderIndex !== -1) {
        const selectionStart = insertedStart + placeholderIndex;
        const selectionEnd = selectionStart + placeholder.length;
        textarea.setSelectionRange(selectionStart, selectionEnd);
        return { start: selectionStart, end: selectionEnd };
    } else {
        const newCursorPos = insertedStart + lineContent.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        return { start: newCursorPos, end: newCursorPos };
    }
};

const getLineRange = (textarea) => {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;

    let lineStart = start;
    while (lineStart > 0 && value[lineStart - 1] !== '\n') {
        lineStart--;
    }

    let lineEnd = end;
    while (lineEnd < value.length && value[lineEnd] !== '\n') {
        lineEnd++;
    }

    return { lineStart, lineEnd };
};
const indentLine = (textarea, indentSize = 4) => { // indentSize を受け取る
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    const indent = ' '.repeat(indentSize);

    let lineStart = start;
    while (lineStart > 0 && value[lineStart - 1] !== '\n') {
        lineStart--;
    }

    if (start === end) {
        textarea.setRangeText(indent, lineStart, lineStart, 'end');
        textarea.selectionStart = textarea.selectionEnd = start + indent.length;
    } else {
        const selectedText = value.substring(lineStart, getLineRange(textarea).lineEnd);
        const indentedText = selectedText.split('\n').map(line => indent + line).join('\n');

        textarea.setRangeText(indentedText, lineStart, getLineRange(textarea).lineEnd, 'end');

        const newStart = start + indent.length;
        const newEnd = end + (indentedText.length - selectedText.length);
        textarea.setSelectionRange(newStart, newEnd);
    }
    textarea.focus();
};

const dedentLine = (textarea, indentSize = 4) => { 
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;

    let lineStart = start;
    while (lineStart > 0 && value[lineStart - 1] !== '\n') {
        lineStart--;
    }

    if (start === end) {
        const lineContent = value.substring(lineStart, start);
        const match = lineContent.match(/^ +/);

        if (match && match[0].length > 0) {
            const leadingSpaces = match[0];
            const removeSize = Math.min(indentSize, leadingSpaces.length);
            textarea.setRangeText('', lineStart, lineStart + removeSize, 'end');
            textarea.selectionStart = textarea.selectionEnd = start - removeSize;
        }
    } else {
        const selectedText = value.substring(lineStart, getLineRange(textarea).lineEnd);
        let totalRemoved = 0;
        const dedentedText = selectedText.split('\n').map(line => {
            const match = line.match(/^ +/);
            if (match && match[0].length > 0) {
                const leadingSpaces = match[0];
                const removeSize = Math.min(indentSize, leadingSpaces.length);
                totalRemoved += removeSize;
                return line.substring(removeSize);
            }
            return line;
        }).join('\n');

        textarea.setRangeText(dedentedText, lineStart, getLineRange(textarea).lineEnd, 'end');

        const newStart = Math.max(lineStart, start - indentSize);
        const newEnd = Math.max(lineStart, end - totalRemoved);
        textarea.setSelectionRange(newStart, newEnd);
    }
    textarea.focus();
};


const MainDisplay = ({
    activeNote,
    editingContent,
    handleContentChange,
    isPreviewEditorHidden,
    toggleEditorVisibility,
    indentSize, // 追加
}) => {
    const textareaRef = useRef(null);

    const isMac = useMemo(() => {
      if (typeof window === 'undefined') return false;
      return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    }, []);

    const handleToolbarClick = (type, payload = {}) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        textarea.focus();

        let commandExecuted = false;

        switch (type) {
            case 'undo':
                document.execCommand('undo', false, null);
                commandExecuted = true;
                break;
            case 'redo':
                document.execCommand('redo', false, null);
                commandExecuted = true;
                break;
            case 'heading':
                insertLine(textarea, `${'#'.repeat(payload.level)} テキスト`);
                break;
            case 'bold':
                insertText(textarea, "太字", true, "**", "**");
                break;
            case 'italic':
                insertText(textarea, "イタリック", true, "*", "*");
                break;
            case 'strikethrough':
                insertText(textarea, "取り消し線", true, "~~", "~~");
                break;
            case 'ul':
                insertLine(textarea, "- リストアイテム");
                break;
            case 'ol':
                insertLine(textarea, "1. リストアイテム");
                break;
            case 'blockquote':
                insertLine(textarea, "> 引用文");
                break;
            case 'code':
                insertText(textarea, "コード", true, "`", "`");
                break;
            case 'codeblock':
                insertLine(textarea, "```\nコードブロック\n```", "コードブロック");
                break;
            case 'link':
                insertText(textarea, "リンクテキスト", true, "[", "](URL)");
                break;
            case 'image':
                insertText(textarea, "画像説明", true, "![", "](画像URL)");
                break;
            case 'table':
                insertLine(textarea, "| ヘッダー1 | ヘッダー2 |\n|---|---|\n| 内容1   | 内容2   |");
                break;
            default:
                break;
        }

        if (!commandExecuted) {
            const event = new Event('input', { bubbles: true });
            textarea.dispatchEvent(event);
        } else {
            const event = new Event('input', { bubbles: true });
            textarea.dispatchEvent(event);
        }
    };

    const handleKeyDown = (event) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const { key, ctrlKey, shiftKey, metaKey } = event;

        const isModifierPressed = isMac ? metaKey : ctrlKey;

        if (key === 'Tab' && !isModifierPressed) {
            event.preventDefault();
            if (shiftKey) {
                dedentLine(textarea, indentSize);
            } else {
                indentLine(textarea, indentSize);
            }
            const inputEvent = new Event('input', { bubbles: true });
            textarea.dispatchEvent(inputEvent);
            return;
        }

        if (isModifierPressed && key === 'Enter' && !shiftKey) {
            event.preventDefault();
            const { lineEnd } = getLineRange(textarea);
            const insertPos = lineEnd;

            textarea.setRangeText('\n', insertPos, insertPos, 'end');
            textarea.selectionStart = textarea.selectionEnd = insertPos + 1;

            const inputEvent = new Event('input', { bubbles: true });
            textarea.dispatchEvent(inputEvent);
            return;
        }

         if (isModifierPressed && key === 'Enter' && shiftKey) {
            event.preventDefault();
            const { lineStart } = getLineRange(textarea);
            const insertPos = lineStart;

            textarea.setRangeText('\n', insertPos, insertPos, 'end');
            textarea.selectionStart = textarea.selectionEnd = insertPos;

            const inputEvent = new Event('input', { bubbles: true });
            textarea.dispatchEvent(inputEvent);
            return;
        }
    };


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
                <EditorWrapper isPreviewEditorHidden={isPreviewEditorHidden} isPreviewAreaMaximized={false}>
                    <Toolbar>
                        <ToolbarButton title="元に戻す (Ctrl/Cmd+Z)" onClick={() => handleToolbarClick('undo')}><FaUndo /></ToolbarButton>
                        <ToolbarButton title="やり直し (Ctrl/Cmd+Y)" onClick={() => handleToolbarClick('redo')}><FaRedo /></ToolbarButton>
                        <ToolbarButton title="見出し1" onClick={() => handleToolbarClick('heading', { level: 1 })}><FaHeading /></ToolbarButton>
                        <ToolbarButton title="太字 (Ctrl/Cmd+B)" onClick={() => handleToolbarClick('bold')}><FaBold /></ToolbarButton>
                        <ToolbarButton title="イタリック (Ctrl/Cmd+I)" onClick={() => handleToolbarClick('italic')}><FaItalic /></ToolbarButton>
                        <ToolbarButton title="引用" onClick={() => handleToolbarClick('blockquote')}><FaQuoteLeft /></ToolbarButton>
                        <ToolbarButton title="順序なしリスト" onClick={() => handleToolbarClick('ul')}><FaListUl /></ToolbarButton>
                        <ToolbarButton title="順序付きリスト" onClick={() => handleToolbarClick('ol')}><FaListOl /></ToolbarButton>
                        <ToolbarButton title="コード" onClick={() => handleToolbarClick('code')}><FaCode /></ToolbarButton>
                        <ToolbarButton title="リンク (Ctrl/Cmd+K)" onClick={() => handleToolbarClick('link')}><FaLink /></ToolbarButton>
                        <ToolbarButton title="画像" onClick={() => handleToolbarClick('image')}><FaImage /></ToolbarButton>
                        <ToolbarButton title="表" onClick={() => handleToolbarClick('table')}><FaTable /></ToolbarButton>
                    </Toolbar>
                    <EditorTextarea
                        ref={textareaRef}
                        value={editingContent}
                        onChange={handleContentChange}
                        onKeyDown={handleKeyDown}
                        placeholder="マークダウンでノートを記述..."
                    />
                </EditorWrapper>
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
