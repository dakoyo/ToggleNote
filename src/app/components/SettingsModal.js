import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${({ theme }) => theme.modalBg};
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; /* AlertModalより少し低くするか、AlertModalとz-indexを調整 */
`;

const ModalContent = styled.div`
    background-color: ${({ theme }) => theme.modalContentBg};
    color: ${({ theme }) => theme.text};
    padding: 25px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    max-width: 500px;
    width: 90%;
    border: 1px solid ${({ theme }) => theme.modalContentBorder};
    display: flex;
    flex-direction: column;
`;

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    h3 {
        margin: 0;
        font-size: 1.4em;
        color: ${({ theme }) => theme.modalTitleColor};
    }
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    font-size: 1.5em;
    cursor: pointer;
    color: ${({ theme }) => theme.text};
    opacity: 0.7;
    &:hover {
        opacity: 1;
    }
`;

const ModalBody = styled.div`
    margin-bottom: 20px;
`;

const SettingItem = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    label {
        margin-right: 15px;
        font-size: 1em;
        color: ${({ theme }) => theme.modalLabelColor};
        min-width: 100px;
    }
    input {
        flex-grow: 1;
        padding: 8px 10px;
        border: 1px solid ${({ theme }) => theme.modalInputBorder};
        background-color: ${({ theme }) => theme.modalInputBg};
        color: ${({ theme }) => theme.text};
        border-radius: ${({ theme }) => theme.modalButtonBorderRadius};
        font-size: 1em;
        &:focus {
            outline: none;
            border-color: ${({ theme }) => theme.modalInputFocusBorder};
            box-shadow: ${({ theme }) => theme.modalInputFocusBoxShadow};
        }
    }
`;

const ModalFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
`;

const ModalButton = styled.button`
    padding: 10px 20px;
    border: none;
    border-radius: ${({ theme }) => theme.modalButtonBorderRadius};
    cursor: pointer;
    font-size: 1em;
    transition: background-color 0.2s ease;
`;

const SaveButton = styled(ModalButton)`
    background-color: ${({ theme }) => theme.modalButtonPrimaryBg};
    color: ${({ theme }) => theme.modalButtonPrimaryText};
    &:hover {
        background-color: ${({ theme }) => theme.modalButtonPrimaryHoverBg};
    }
`;

const CancelButton = styled(ModalButton)`
    background-color: ${({ theme }) => theme.modalButtonSecondaryBg};
    color: ${({ theme }) => theme.modalButtonSecondaryText};
    &:hover {
        background-color: ${({ theme }) => theme.modalButtonSecondaryHoverBg};
    }
`;


const SettingsModal = ({
    isOpen,
    onClose,
    currentIndentSize,
    onSave,
}) => {
    const [modalIndentSize, setModalIndentSize] = useState(currentIndentSize);

    // 親コンポーネントから設定値が変更された場合に、モーダル内のstateを更新
    useEffect(() => {
        setModalIndentSize(currentIndentSize);
    }, [currentIndentSize]);

    const handleSaveClick = () => {
        const size = parseInt(modalIndentSize, 10);
        if (isNaN(size) || size < 1 || size > 8) { // 例: 1から8の範囲でバリデーション
            alert('インデントサイズは1〜8の整数で入力してください。'); // または showAlert を使う
            return;
        }
        onSave(size);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <ModalOverlay onClick={onClose}> {/* オーバーレイクリックで閉じる */}
            <ModalContent onClick={(e) => e.stopPropagation()}> {/* コンテンツクリックで閉じない */}
                <ModalHeader>
                    <h3>設定</h3>
                    <CloseButton onClick={onClose}>×</CloseButton>
                </ModalHeader>
                <ModalBody>
                    <SettingItem>
                        <label htmlFor="indent-size">インデントサイズ (スペース数)</label>
                        <input
                            id="indent-size"
                            type="number"
                            min="1"
                            max="8"
                            value={modalIndentSize}
                            onChange={(e) => setModalIndentSize(e.target.value)}
                        />
                    </SettingItem>
                    {/* 将来的な設定項目をここに追加 */}
                </ModalBody>
                <ModalFooter>
                    <CancelButton onClick={onClose}>キャンセル</CancelButton>
                    <SaveButton onClick={handleSaveClick}>保存</SaveButton>
                </ModalFooter>
            </ModalContent>
        </ModalOverlay>
    );
};

export default SettingsModal;