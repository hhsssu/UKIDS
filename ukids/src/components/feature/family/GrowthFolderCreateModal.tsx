import { useEffect, useState } from 'react';
import api from '@/util/api.ts';

interface ModalProps {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GrowthFolderCreateModal = ({
  modalState,
  setModalState,
}: ModalProps) => {
  const [folderName, setFolderName] = useState<string>();

  const onClickCloseButton = () => {
    setModalState(!modalState);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModalState(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [setModalState]);

  if (!modalState) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-top-container">
        <div className="modal-container">
          <div className="modal-header">
            <span>폴더 생성</span>
            <span className="modal-close-button" onClick={onClickCloseButton}>
              X
            </span>
          </div>

          <div className="text-center mt-5">
            생성할 폴더 이름을 입력해주세요
          </div>

          <div className="modal-content text-center">
            <label htmlFor="foldername"></label>
            <input
              id="foldername"
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />
          </div>

          <div className="text-center">
            <button>생성</button>
          </div>
        </div>
      </div>
    </div>
  );
};
