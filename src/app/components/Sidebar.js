import React from 'react';
import styled from 'styled-components';
import {
    IoMdAddCircleOutline,
    IoMdTrash,
    IoMdMoon,
    IoMdSunny,
    IoMdCreate,
    IoMdCheckmarkCircleOutline,
    IoMdCloseCircleOutline,
} from 'react-icons/io';
import { IconButton } from './common/IconButton';

const NoteListItem = styled.li`
    padding: 10px 12px;
    cursor: pointer;
    border-bottom: 1px solid ${({ theme }) => theme.borderColor};
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.9em;
    transition: background-color 0.15s ease-in-out;
    word-break: break-word;
    min-height: 40px;

    &:last-child { border-bottom: none; }
    &:hover { background-color: ${({ theme }) => theme.sidebarHoverBg}; }

    ${props => props.isActive && !props.isEditing && `
        background-color: ${props.theme.sidebarActiveBg};
        font-weight: 600;
        color: ${props.theme.accentColor};
        &:hover { background-color: ${props.theme.sidebarActiveBg}; }
    `}
`;

const NoteTitleContainer = styled.div`
    flex-grow: 1;
    margin-right: 8px;
    display: flex;
    align-items: center;
`;

const NoteTitle = styled.span`
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
`;

const EditNoteTitleInput = styled.input`
    flex-grow: 1;
    padding: 4px 6px;
    border: 1px solid ${({ theme }) => theme.inputFocusBorder};
    background-color: ${({ theme }) => theme.inputBg};
    color: ${({ theme }) => theme.text};
    border-radius: 3px;
    font-size: 0.9em;
    margin-right: 5px;
    &:focus {
        outline: none;
        box-shadow: 0 0 0 1px ${({ theme }) => theme.inputFocusBorder};
    }
`;

const NoteActions = styled.div`
    display: flex;
    align-items: center;
    flex-shrink: 0;
`;

const ActionButton = styled(IconButton)` // IconButtonを継承して少し調整
    font-size: 1.2rem;
    padding: 4px;
    margin-left: 4px;
`;

const EditButton = styled(ActionButton)`
    color: ${({ theme }) => theme.accentColor};
    &:hover {
        color: ${({ theme }) => theme.text};
        background-color: ${({ theme }) => theme.sidebarHoverBg};
    }
`;

const SaveEditButton = styled(ActionButton)`
    color: ${({ theme }) => theme.accentColor};
    &:hover {
        background-color: rgba(40, 91, 167, 0.1);
    }
`;

const CancelEditButton = styled(ActionButton)`
    color: ${({ theme }) => theme.buttonDangerBg};
    &:hover {
        background-color: rgba(220, 53, 69, 0.1);
    }
`;

const StyledSidebar = styled.aside`
    width: 280px;
    flex-shrink: 0;
    border-right: 1px solid ${({ theme }) => theme.borderColor};
    padding: 15px;
    background-color: ${({ theme }) => theme.sidebarBg};
    color: ${({ theme }) => theme.sidebarText};
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, width 0.3s ease, height 0.3s ease;

    @media (max-width: 768px) {
        width: 100%;
        height: auto;
        max-height: 45vh;
        border-right: none;
        border-bottom: 1px solid ${({ theme }) => theme.borderColor};
    }
`;

const SidebarHeader = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    h2 {
        margin: 0;
        font-size: 1.25em;
    }
`;

const NewNoteForm = styled.form`
    display: flex;
    margin-bottom: 15px;
`;

const NewNoteInput = styled.input`
    flex-grow: 1;
    padding: 9px 12px;
    border: 1px solid ${({ theme }) => theme.inputBorder};
    background-color: ${({ theme }) => theme.inputBg};
    color: ${({ theme }) => theme.text};
    border-radius: 4px 0 0 4px;
    font-size: 0.9em;
    transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.inputFocusBorder};
        box-shadow: ${({ theme }) => theme.inputFocusBoxShadow};
    }
`;

const CreateNoteButton = styled.button`
    padding: 9px 12px;
    border: 1px solid ${({ theme }) => theme.buttonPrimaryBg};
    background-color: ${({ theme }) => theme.buttonPrimaryBg};
    color: ${({ theme }) => theme.buttonPrimaryText};
    cursor: pointer;
    border-radius: 0 4px 4px 0;
    font-size: 0.9em;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
    &:hover {
        background-color: ${({ theme }) => theme.buttonPrimaryHoverBg}; 
    }
    svg { font-size: 1.2em; }
`;

const NoteList = styled.ul`
    list-style: none; padding: 0; margin: 0; flex-grow: 1;
`;

const DeleteNoteButton = styled(IconButton)`
    font-size: 1.25rem;
    color: ${({ theme }) => theme.buttonDangerBg};
    padding: 5px;
    &:hover {
        color: ${({ theme }) => theme.buttonDangerText};
        background-color: ${({ theme }) => theme.buttonDangerHoverBg};
    }
`;

const SidebarNoNoteMessage = styled.div`
    text-align: center; color: ${({ theme }) => theme.text}; font-size: 0.9em;
    padding: 10px 0; opacity: 0.7;
`;


const Sidebar = ({
    notes,
    activeNoteId,
    newNoteTitle,
    setNewNoteTitle,
    handleCreateNote,
    handleSelectNote,
    handleDeleteNote,
    isDarkMode,
    toggleTheme,
    editingNoteId,
    editingNoteTitle,
    handleEditNoteTitleStart,
    handleEditingTitleChange,
    handleSaveNoteTitle,
    handleCancelEditNoteTitle,
}) => {
    const handleInputKeyDown = (e, noteId) => {
        if (e.key === 'Enter') {
            handleSaveNoteTitle(noteId);
        } else if (e.key === 'Escape') {
            handleCancelEditNoteTitle();
        }
    };

    return (
        <StyledSidebar>
            <SidebarHeader>
                <h2>ノート</h2>
                <IconButton
                    onClick={toggleTheme}
                    title={isDarkMode ? "ライトモード" : "ダークモード"}
                >
                    {isDarkMode ? <IoMdSunny /> : <IoMdMoon />}
                </IconButton>
            </SidebarHeader>
            <NewNoteForm onSubmit={handleCreateNote}>
                <NewNoteInput
                    type="text" value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    placeholder="新規ノート名..."
                />
                <CreateNoteButton type="submit">
                    <IoMdAddCircleOutline />
                </CreateNoteButton>
            </NewNoteForm>
            <NoteList>
                {notes.length === 0 && <SidebarNoNoteMessage>ノートがありません</SidebarNoNoteMessage>}
                {notes.map(note => (
                    <NoteListItem
                        key={note.id}
                        onClick={() => editingNoteId !== note.id && handleSelectNote(note.id)}
                        isActive={note.id === activeNoteId}
                        isEditing={editingNoteId === note.id}
                        title={editingNoteId === note.id ? editingNoteTitle : note.title}
                    >
                        <NoteTitleContainer>
                            {editingNoteId === note.id ? (
                                <EditNoteTitleInput
                                    type="text"
                                    value={editingNoteTitle}
                                    onChange={handleEditingTitleChange}
                                    onKeyDown={(e) => handleInputKeyDown(e, note.id)}
                                    autoFocus
                                    onBlur={() => setTimeout(() => {
                                    }, 100)}
                                />
                            ) : (
                                <NoteTitle>{note.title}</NoteTitle>
                            )}
                        </NoteTitleContainer>
                        <NoteActions>
                            {editingNoteId === note.id ? (
                                <>
                                    <SaveEditButton
                                        onClick={(e) => { e.stopPropagation(); handleSaveNoteTitle(note.id); }}
                                        title="保存"
                                    >
                                        <IoMdCheckmarkCircleOutline />
                                    </SaveEditButton>
                                    <CancelEditButton
                                        onClick={(e) => { e.stopPropagation(); handleCancelEditNoteTitle(); }}
                                        title="キャンセル"
                                    >
                                        <IoMdCloseCircleOutline />
                                    </CancelEditButton>
                                </>
                            ) : (
                                <>
                                    <EditButton
                                        onClick={(e) => { e.stopPropagation(); handleEditNoteTitleStart(note.id, note.title); }}
                                        title="タイトル編集"
                                    >
                                        <IoMdCreate />
                                    </EditButton>
                                    <DeleteNoteButton
                                        onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }}
                                        title="削除"
                                    >
                                        <IoMdTrash />
                                    </DeleteNoteButton>
                                </>
                            )}
                        </NoteActions>
                    </NoteListItem>
                ))}
            </NoteList>
        </StyledSidebar>
    );
};

export default Sidebar;