import React from 'react';
import styled from 'styled-components';
import { IconButton } from './IconButton'; // IconButtonを再利用するなら
import { IoMdClose } from 'react-icons/io'; // 閉じるアイコン

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000; // 他の要素より手前に表示
`;

const ModalContent = styled.div`
    background-color: ${({ theme }) => theme.body};
    padding: 25px 30px;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    min-width: 300px;
    max-width: 90%;
    position: relative;
    color: ${({ theme }) => theme.text};
`;

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid ${({ theme }) => theme.borderColor};

    h3 {
        margin: 0;
        font-size: 1.2em;
        color: ${({ theme }) => theme.text};
    }
`;

const ModalBody = styled.div`
    margin-bottom: 20px;
    font-size: 1em;
    line-height: 1.5;
`;

const ModalFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
`;

const ModalButton = styled.button`
    padding: 8px 15px;
    border-radius: 5px;
    font-size: 0.9em;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;

    &.primary {
        background-color: ${({ theme }) => theme.buttonPrimaryBg};
        color: ${({ theme }) => theme.buttonPrimaryText};
        border: 1px solid ${({ theme }) => theme.buttonPrimaryBg};
        &:hover {
            background-color: ${({ theme }) => theme.buttonPrimaryHoverBg};
        }
    }

    &.secondary {
        background-color: transparent;
        color: ${({ theme }) => theme.text};
        border: 1px solid ${({ theme }) => theme.borderColor};
        &:hover {
            background-color: ${({ theme }) => theme.sidebarHoverBg}; // 少し色をつける
        }
    }
`;


const AlertModal = ({ isOpen, title, message, onClose, onConfirm, showConfirmButton = false, confirmText = "OK" }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <ModalOverlay onClick={onClose}> {/* 背景クリックで閉じる */}
            <ModalContent onClick={(e) => e.stopPropagation()}> {/* モーダル内クリックは伝播させない */}
                <ModalHeader>
                    <h3>{title || "通知"}</h3>
                    <IconButton onClick={onClose} title="閉じる" style={{ fontSize: '1.3rem', padding: '4px' }}>
                        <IoMdClose />
                    </IconButton>
                </ModalHeader>
                <ModalBody>
                    {message}
                </ModalBody>
                <ModalFooter>
                    {showConfirmButton && onConfirm && (
                        <ModalButton className="primary" onClick={() => { onConfirm(); onClose(); }}>
                            {confirmText}
                        </ModalButton>
                    )}
                    {!showConfirmButton && ( // 確認ボタンがない場合はOKボタンで閉じる
                        <ModalButton className="primary" onClick={onClose}>
                            OK
                        </ModalButton>
                    )}
                    {showConfirmButton && ( // 確認ダイアログ風にするならキャンセルボタンも
                        <ModalButton className="secondary" onClick={onClose}>
                            キャンセル
                        </ModalButton>
                    )}
                </ModalFooter>
            </ModalContent>
        </ModalOverlay>
    );
};

export default AlertModal;