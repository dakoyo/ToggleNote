import React, { useState, useEffect, useMemo } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { getCookie, setCookie } from './utils/cookie';
import { lightTheme, darkTheme } from './styles/theme';
import { GlobalStyle } from './styles/GlobalStyle';
import Sidebar from './components/Sidebar';
import MainDisplay from './components/MainDisplay';
import AlertModal from './components/common/AlertModal'; // 新しくインポート

const AppContainer = styled.div`
    display: flex;
    height: 100vh;
    overflow: hidden;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

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
        if (activeNoteId) {
            const currentNote = notes.find(note => note.id === activeNoteId);
            if (currentNote) setEditingContent(currentNote.content);
        } else {
            setEditingContent('');
        }
    }, [activeNoteId, notes]);

    const showAlert = (title, message, onConfirmCallback = null, showConfirm = false) => {
        setAlertInfo({
            isOpen: true,
            title: title,
            message: message,
            onConfirm: onConfirmCallback,
            showConfirmButton: showConfirm,
        });
    };

    const closeAlert = () => {
        setAlertInfo(prev => ({ ...prev, isOpen: false }));
    };


    const handleCreateNote = (e) => {
        e.preventDefault();
        if (!newNoteTitle.trim()) { showAlert('ノートのタイトルを入力してください。'); return; }
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

    const handleSelectNote = (id) => setActiveNoteId(id);

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
        if (showAlert(
            "ノート削除の確認",
            "本当にこのノートを削除しますか？この操作は元に戻せません。",
            () => { // onConfirm コールバック
                const newNotes = notes.filter(note => note.id !== idToDelete);
                setNotes(newNotes);
                if (activeNoteId === idToDelete) {
                    setActiveNoteId(newNotes.length > 0 ? newNotes[0].id : null);
                }
            },
            true
        )) {
            const newNotes = notes.filter(note => note.id !== idToDelete);
            setNotes(newNotes);
            if (activeNoteId === idToDelete) {
                setActiveNoteId(newNotes.length > 0 ? newNotes[0].id : null);
            }
        }
    };

    const activeNote = useMemo(() => notes.find(note => note.id === activeNoteId), [notes, activeNoteId]);

    const toggleTheme = () => setIsDarkMode(!isDarkMode);
    const toggleEditorVisibility = () => setIsPreviewEditorHidden(!isPreviewEditorHidden);

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
                />
                <MainDisplay
                    activeNote={activeNote}
                    editingContent={editingContent}
                    handleContentChange={handleContentChange}
                    isPreviewEditorHidden={isPreviewEditorHidden}
                    toggleEditorVisibility={toggleEditorVisibility}
                />
            </AppContainer>
            <AlertModal
                isOpen={alertInfo.isOpen}
                title={alertInfo.title}
                message={alertInfo.message}
                onClose={closeAlert}
                onConfirm={alertInfo.onConfirm}
                showConfirmButton={alertInfo.showConfirmButton}
                confirmText="削除" // handleDeleteNote の場合
            />
        </ThemeProvider>
    );
}