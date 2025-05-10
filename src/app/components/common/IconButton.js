import styled from 'styled-components';

export const IconButton = styled.button`
    background: none;
    border: none;
    color: ${({ theme }) => theme.iconColor};
    font-size: 1.6rem;
    cursor: pointer;
    padding: 6px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out;
    &:hover {
        background-color: ${({ theme }) => theme.iconHoverBg};
        color: ${({ theme }) => theme.text};
    }
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;