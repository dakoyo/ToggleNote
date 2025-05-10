import { createGlobalStyle } from 'styled-components';
import { MarkdownPreviewWrapper } from '../components/MarkdownPreview'; // 後で作成

export const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        background-color: ${({ theme }) => theme.body};
        color: ${({ theme }) => theme.text};
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        box-sizing: border-box;
        transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
    }

    *, *::before, *::after {
        box-sizing: inherit;
    }

    .spoiler-text {
        background-color: ${({ theme }) => theme.spoilerBg};
        color: ${({ theme }) => theme.spoilerTextHidden};
        padding: 0.1em 0.4em;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s, color 0.2s;
    }
    .spoiler-text:hover {
        opacity: 0.8;
    }
    .spoiler-text.revealed {
        background-color: ${({ theme }) => theme.spoilerBgRevealed};
        color: inherit;
    }

    ${MarkdownPreviewWrapper} {
        h1, h2, h3, h4, h5, h6 {
            margin-top: 1.2em;
            margin-bottom: 0.6em;
            padding-bottom: 0.3em;
            border-bottom: 1px solid ${({ theme }) => theme.borderColor};
            color: ${({ theme }) => theme.text};
        }
        h1 { font-size: 2em; }
        h2 { font-size: 1.6em; }
        h3 { font-size: 1.3em; }

        p {
            margin-bottom: 1em;
              line-height: 1.7;
        }
        ul, ol {
            margin-bottom: 1em;
            padding-left: 2em;
        }
        li > p { margin-bottom: 0.4em; }
        pre {
            background-color: ${({ theme }) => theme.markdownPreBg};
            color: ${({ theme }) => theme.text};
            padding: 1em;
            border-radius: 6px;
            overflow-x: auto;
            font-size: 0.9em;
            line-height: 1.5;
            border: 1px solid ${({ theme }) => theme.borderColor};
        }
        code {
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
            background-color: ${({ theme }) => theme.markdownCodeBg};
            color: ${({ theme }) => theme.text};
            padding: 0.2em 0.4em;
            margin: 0 0.1em;
            font-size: 85%;
            border-radius: 3px;
        }
        pre > code {
            padding: 0;
            margin: 0;
            font-size: 100%;
            background-color: transparent; border-radius: 0; border: none;
        }
        blockquote {
            border-left: 0.25em solid ${({ theme }) => theme.markdownBlockquoteBorder};
            padding: 0.5em 1em;
            margin-left: 0; margin-right: 0;
            color: ${({ theme }) => theme.markdownBlockquoteText};
            background-color: ${({ theme }) => theme.markdownCodeBg};
        }
        table {
            border-collapse: collapse; margin-bottom: 1em; width: auto; display: block; overflow: auto;
        }
        th, td {
            border: 1px solid ${({ theme }) => theme.markdownTableBorder}; padding: 0.5em 0.8em; 
        }
        th {
            font-weight: 600; background-color: ${({ theme }) => theme.markdownTableHeaderBg};
        }
        img {
            max-width: 100%;
            border-radius: 4px;
        }
        a {
            color: ${({ theme }) => theme.accentColor}; text-decoration: none;
            &:hover { text-decoration: underline; }
        }
        hr {
            border: 0;
            height: 1px;
            background-color: ${({ theme }) => theme.borderColor};
            margin: 1.5em 0;
        }
    }
`;