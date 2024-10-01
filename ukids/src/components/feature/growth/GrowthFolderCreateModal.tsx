import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/util/api.ts';
import { useFamilyStore } from '@/stores/familyStore';

interface ModalProps {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  renewFolderList: () => void;
}

export const GrowthFolderCreateModal = ({
  modalState,
  setModalState,
  renewFolderList,
}: ModalProps) => {
  const navigate = useNavigate();
  const { selectedFamilyId } = useFamilyStore();

  // 수정 : // 초기 값으로 빈 문자열 설정
  const [folderName, setFolderName] = useState<string>('');

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

  const createFolder = async () => {
    if (!folderName.trim()) {
      // 입력 유효성 검사
      alert('폴더 이름을 입력해주세요.');
      return;
    }

    const url = `/growth-folder`;

    const inputData = {
      familyId: selectedFamilyId,
      folderName: folderName,
    };

    const { data } = await api.post(url, inputData);

    renewFolderList();

    setModalState(!modalState);

    alert('폴더가 성공적으로 생성되었습니다.');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-top-container">
        <div className="modal-container">
          <div className="modal-header">
            <span className="content-title">성장일지 폴더 만들기</span>
            <span className="modal-close-button" onClick={onClickCloseButton}>
              X
            </span>
          </div>

          <div className="modal-content text-center">
            <p className="password-label">폴더 이름을 입력하세요. </p>

            <input
              id="foldername"
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="폴더 이름을 입력하세요" // 추가 : 입력 플레이스홀더
              className="password-input" // 추가 : css
            />
          </div>

          <div className="text-center">
            <button
              className="common-btn list-btn"
              style={{
                position: 'absolute',
                bottom: '30px',
                right: '30px',
                color: 'gray',
              }}
              onClick={createFolder}
            >
              등록
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
