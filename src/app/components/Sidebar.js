import React from 'react';
import styled from 'styled-components';
import { IoMdAddCircleOutline, IoMdTrash, IoMdMoon, IoMdSunny } from 'react-icons/io';
import { IconButton } from './common/IconButton';

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

    &:last-child {
        border-bottom: none; 
    }
    &:hover {
        background-color: ${({ theme }) => theme.sidebarHoverBg};
    }

    ${props => props.isActive && `
        background-color: ${props.theme.sidebarActiveBg};
        font-weight: 600;
        color: ${props.theme.accentColor};
        &:hover { background-color: ${props.theme.sidebarActiveBg}; }
    `}
`;

const NoteTitle = styled.span`
    flex-grow: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; margin-right: 8px;
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
}) => {
    return (
        <StyledSidebar>
            <SidebarHeader>
                <h2>Toggle Note</h2>
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
                        onClick={() => handleSelectNote(note.id)}
                        isActive={note.id === activeNoteId}
                        title={note.title}
                    >
                        <NoteTitle>{note.title}</NoteTitle>
                        <DeleteNoteButton
                            onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }}
                            title="削除"
                        >
                            <IoMdTrash />
                        </DeleteNoteButton>
                    </NoteListItem>
                ))}
            </NoteList>
        </StyledSidebar>
    );
};

export default Sidebar;