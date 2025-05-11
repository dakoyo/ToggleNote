import React, { useState, useEffect, useMemo } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { getCookie, setCookie } from './utils/cookie';
import { lightTheme, darkTheme } from './styles/theme';
import { GlobalStyle } from './styles/GlobalStyle';
import Sidebar from './components/Sidebar';
import MainDisplay from './components/MainDisplay';
import AlertModal from './components/common/AlertModal';
import SettingsModal from './components/SettingsModal';

const AppContainer = styled.div`
    display: flex;
    height: 100vh;
    overflow: hidden;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const DEFAULT_INDENT_SIZE = 4;

export default function App() {
    const [notes, setNotes] = useState([]);
    const [activeNoteId, setActiveNoteId] = useState(null);
    const [newNoteTitle, setNewNoteTitle] = useState('');
    const [editingContent, setEditingContent] = useState('');

    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = getCookie('ToggleNote-Theme');
        if (savedTheme) return savedTheme === 'dark';
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    const [isPreviewEditorHidden, setIsPreviewEditorHidden] = useState(false);

    const [alertInfo, setAlertInfo] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null,
        showConfirmButton: false,
        confirmText: 'OK',
        cancelText: '閉じる',
    });

    const [editingNoteId, setEditingNoteId] = useState(null);
    const [editingNoteTitle, setEditingNoteTitle] = useState('');
    const [originalTitleBeforeEdit, setOriginalTitleBeforeEdit] = useState('');

    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [indentSize, setIndentSize] = useState(() => {
        const savedIndentSize = getCookie('ToggleNote-IndentSize');
        if (savedIndentSize) {
            const parsedSize = parseInt(savedIndentSize, 10);
            if (!isNaN(parsedSize) && parsedSize >= 1 && parsedSize <= 8) {
                return parsedSize;
            }
        }
        return DEFAULT_INDENT_SIZE;
    });

    useEffect(() => {
        const savedNotes = getCookie('ToggleNote-Notes');
        if (savedNotes) {
            try {
                const parsedNotes = JSON.parse(savedNotes);
                setNotes(parsedNotes);
                if (parsedNotes.length > 0) {
                    const lastActiveId = getCookie('ToggleNote-LastActiveNoteId');
                    const noteToActivate = parsedNotes.find(n => n.id === lastActiveId) || parsedNotes[0];
                    setActiveNoteId(noteToActivate.id);
                }
            } catch (error) { console.error("Cookie parse error (notes):", error); setNotes([]); }
        }
    }, []);

    useEffect(() => {
        setCookie('ToggleNote-Notes', JSON.stringify(notes), 365);
    }, [notes]);

    useEffect(() => {
        if (activeNoteId) setCookie('ToggleNote-LastActiveNoteId', activeNoteId, 365);
    }, [activeNoteId]);

    useEffect(() => {
        setCookie('ToggleNote-Theme', isDarkMode ? 'dark' : 'light', 365);
        document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    useEffect(() => {
        setCookie('ToggleNote-IndentSize', indentSize.toString(), 365);
    }, [indentSize]);

    useEffect(() => {
        if (activeNoteId && !editingNoteId) {
            const currentNote = notes.find(note => note.id === activeNoteId);
            if (currentNote) {
                 setEditingContent(currentNote.content);
            }
        } else if (!activeNoteId) {
            setEditingContent('');
        }
    }, [activeNoteId, notes, editingNoteId]);


    const showAlert = (title, message, onConfirmCallback = null, showConfirm = false, confirmBtnText = 'OK', cancelBtnText = '閉じる') => {
        setAlertInfo({
            isOpen: true,
            title: title,
            message: message,
            onConfirm: onConfirmCallback,
            showConfirmButton: showConfirm,
            confirmText: confirmBtnText,
            cancelText: cancelBtnText,
        });
    };

    const closeAlert = () => {
        setAlertInfo(prev => ({ ...prev, isOpen: false }));
    };

    const handleCreateNote = (e) => {
        e.preventDefault();
        if (editingNoteId) {
            showAlert(
                "編集中",
                "タイトル編集中です。変更を破棄して新しいノートを作成しますか？",
                () => {
                    setEditingNoteId(null);
                    setEditingNoteTitle('');
                    setOriginalTitleBeforeEdit('');
                    proceedWithCreateNote();
                },
                true,
                "作成",
                "キャンセル"
            );
            return;
        }
        proceedWithCreateNote();
    };

    const proceedWithCreateNote = () => {
        if (!newNoteTitle.trim()) {
            showAlert('エラー', 'ノートのタイトルを入力してください。');
            return;
        }
        const newNote = {
            id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title: newNoteTitle.trim(),
            content: `# ${newNoteTitle.trim()}\n\nここにノートを書こう！\n\n||これは秘密のテキストです||`
        };
        const updatedNotes = [...notes, newNote];
        setNotes(updatedNotes);
        setActiveNoteId(newNote.id);
        setNewNoteTitle('');
    };

    const handleSelectNote = (id) => {
        if (editingNoteId && editingNoteId !== id) {
            showAlert(
                "編集中",
                "タイトル編集中です。変更を破棄して別のノートを選択しますか？",
                () => {
                    setEditingNoteId(null);
                    setEditingNoteTitle('');
                    setOriginalTitleBeforeEdit('');
                    setActiveNoteId(id);
                },
                true,
                "選択",
                "キャンセル"
            );
            return;
        } else if (editingNoteId === id) {
            return;
        }
        setActiveNoteId(id);
    };

    const handleContentChange = (e) => {
        const newContent = e.target.value;
        setEditingContent(newContent);
        setNotes(prevNotes =>
            prevNotes.map(note =>
                note.id === activeNoteId ? { ...note, content: newContent } : note
            )
        );
    };


    const handleDeleteNote = (idToDelete) => {
        if (editingNoteId === idToDelete) {
            showAlert("エラー", "編集中はノートを削除できません。編集を完了またはキャンセルしてください。");
            return;
        }
        showAlert(
            "ノート削除の確認",
            `ノート「${notes.find(n=>n.id === idToDelete)?.title || ''}」を本当に削除しますか？この操作は元に戻せません。`,
            () => {
                const newNotes = notes.filter(note => note.id !== idToDelete);
                setNotes(newNotes);
                if (activeNoteId === idToDelete) {
                    setActiveNoteId(newNotes.length > 0 ? newNotes[0].id : null);
                }
            },
            true,
            "削除"
        );
    };

    const activeNote = useMemo(() => notes.find(note => note.id === activeNoteId), [notes, activeNoteId]);

    const toggleTheme = () => setIsDarkMode(!isDarkMode);
    const toggleEditorVisibility = () => setIsPreviewEditorHidden(!isPreviewEditorHidden);

    const handleEditNoteTitleStart = (noteId, currentTitle) => {
        if (editingNoteId && editingNoteId !== noteId) {
            showAlert(
                "編集中",
                "別のタイトルを編集中です。現在の変更を破棄して新しい編集を開始しますか？",
                () => {
                    setEditingNoteId(noteId);
                    setEditingNoteTitle(currentTitle);
                    setOriginalTitleBeforeEdit(currentTitle);
                },
                true,
                "編集開始",
                "キャンセル"
            );
            return;
        }
        setEditingNoteId(noteId);
        setEditingNoteTitle(currentTitle);
        setOriginalTitleBeforeEdit(currentTitle);
    };

    const handleEditingTitleChange = (e) => {
        setEditingNoteTitle(e.target.value);
    };

    const handleSaveNoteTitle = (noteId) => {
        if (!editingNoteTitle.trim()) {
            showAlert("エラー", "タイトルは空にできません。元のタイトルに戻しますか？", () => {
                setEditingNoteTitle(originalTitleBeforeEdit);
            }, true, "元に戻す");
            return;
        }
        setNotes(prevNotes =>
            prevNotes.map(note =>
                note.id === noteId ? { ...note, title: editingNoteTitle.trim() } : note
            )
        );
        setEditingNoteId(null);
        setEditingNoteTitle('');
        setOriginalTitleBeforeEdit('');
    };

    const handleCancelEditNoteTitle = () => {
        setEditingNoteId(null);
        setEditingNoteTitle('');
        setOriginalTitleBeforeEdit('');
    };

    const handleOpenSettings = () => {
        setIsSettingsModalOpen(true);
    };

    const handleCloseSettings = () => {
        setIsSettingsModalOpen(false);
    };

    const handleSaveSettings = (newIndentSize) => {
        setIndentSize(newIndentSize);
    };

    const currentTheme = isDarkMode ? darkTheme : lightTheme;

    return (
        <ThemeProvider theme={currentTheme}>
            <GlobalStyle />
            <AppContainer>
                <Sidebar
                    notes={notes}
                    activeNoteId={activeNoteId}
                    newNoteTitle={newNoteTitle}
                    setNewNoteTitle={setNewNoteTitle}
                    handleCreateNote={handleCreateNote}
                    handleSelectNote={handleSelectNote}
                    handleDeleteNote={handleDeleteNote}
                    isDarkMode={isDarkMode}
                    toggleTheme={toggleTheme}
                    editingNoteId={editingNoteId}
                    editingNoteTitle={editingNoteTitle}
                    handleEditNoteTitleStart={handleEditNoteTitleStart}
                    handleEditingTitleChange={handleEditingTitleChange}
                    handleSaveNoteTitle={handleSaveNoteTitle}
                    handleCancelEditNoteTitle={handleCancelEditNoteTitle}
                    handleOpenSettings={handleOpenSettings}
                />
                <MainDisplay
                    activeNote={activeNote}
                    editingContent={editingContent}
                    handleContentChange={handleContentChange}
                    isPreviewEditorHidden={isPreviewEditorHidden}
                    toggleEditorVisibility={toggleEditorVisibility}
                    indentSize={indentSize}
                />
            </AppContainer>
            <AlertModal
                isOpen={alertInfo.isOpen}
                title={alertInfo.title}
                message={alertInfo.message}
                onClose={closeAlert}
                onConfirm={alertInfo.onConfirm}
                showConfirmButton={alertInfo.showConfirmButton}
                confirmText={alertInfo.confirmText}
                cancelText={alertInfo.cancelText}
            />
            <SettingsModal
                isOpen={isSettingsModalOpen}
                onClose={handleCloseSettings}
                currentIndentSize={indentSize}
                onSave={handleSaveSettings}
            />
        </ThemeProvider>
    );
}