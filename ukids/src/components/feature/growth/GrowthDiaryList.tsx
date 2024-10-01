import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

import api from '@/util/api.ts';

import { GrowthDiaryItem } from '@/components/feature/growth/GrowthDiaryItem';

import BlueButton from '@components/common/BlueButton';
import WhiteButton from '@components/common/WhiteButton';

import { Modal } from '@components/feature/modal/Modal';
import { Pagination } from '@components/feature/pagination/Pagination.tsx';

import './GrowthDiaryList.css';

interface Diary {
  recordId: number;
  writerId: number;
  title: string;
  content: string;
  date: string;
  imageUrl: string;
}

export const GrowthDiaryList = () => {
  const { folderId } = useParams();

  const [modalState, setModalState] = useState<boolean>(false);
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const content = '성장일지 폴더 삭제';
  const navigate = useNavigate();

  // 페이지네이션
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const size: number = 8;

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const getDiaryList = async () => {
 
    const url = `/growth-record/all/${folderId}?page=${page}&size=${size}`;

    const { data } = await api.get(url);

    setDiaries(data.result.growthRecords);
    setTotalPage(data.result.totalPage);
  };

  const onModalOpen = () => {
    setModalState(!modalState);
  };

  const deleteFolder = async () => {
    if (diaries.length !== 0) {
      alert('비어있는 폴더만 삭제 가능합니다!');
      return;
    }
    const url = `/growth-folder/${folderId}`;

    const { data } = await api.delete(url);

    navigate(`/growthfolder`);
  };

  useEffect(() => {
    getDiaryList();
  }, [folderId, page]);

  return (
    <div className="feature-box">
      {/* 목록 */}
      <div style={{ position: 'absolute', top: '27px', left: '30px' }}>
        <WhiteButton name="폴더 목록" path="/growthfolder" />
      </div>

      {/*만들기*/}
      <div style={{ marginLeft: '664px', marginTop: '27px' }}>
        <BlueButton name="만들기" path={`/growthdiary/write/${folderId}`} />
      </div>

      {/* 삭제 */}
      <span className="home-modal-open-Button" onClick={onModalOpen}>
        <button
          className="common-btn red-font"
          style={{ position: 'absolute', top: '27px', right: '30px' }}
        >
          폴더 삭제
        </button>
      </span>

      {/* 게시글 없을 때 */}
      {diaries.length === 0 ? (
        <div className="nothing-message">
          아직 성장일지가 없어요!
          <br />
          성장일지를 만들러 가볼까요?
        </div>
      ) : (
        <div className='lists-container-growth'>

          <div className="growth-container">
            {diaries.map((item) => (
            
              <Link to={`/growthdiary/diary/${item.recordId}?folderId=${folderId}`}>
                
                <GrowthDiaryItem
                  className="growth-item"
                  key={item.recordId}
                  title={item.title}
                  date={item.date}
                  imageUrl={item.imageUrl}
                />
              
              </Link>
            ))}
            </div>
                
          
            <div className="growth-page-box">
              <Pagination
                totalPage={totalPage}
                size={size}
                countPerPage={10}
                currentPage={page}
                onPageChange={handlePageChange} // onPageChange 핸들러를 호출하도록 수정
              />
            </div>
        </div>
      )}

            <div>
                  {modalState && (
                    <Modal
                      content={content}
                      modalState={modalState}
                      setModalState={setModalState}
                      deleteElement={deleteFolder}
                    />
                  )}
            </div>

    </div>
  );
};
