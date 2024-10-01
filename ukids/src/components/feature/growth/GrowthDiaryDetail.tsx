import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import api from '@/util/api';
import { Modal } from '@components/feature/modal/Modal.tsx';
import { useNavigate, Link } from 'react-router-dom';
import BlueButton from '@components/common/BlueButton';
import WhiteButton from '@components/common/WhiteButton';

interface Diary {
  folderId: number;
  recordId: number;
  writerId: number;
  title: number;
  content: number;
  date: string;
  imageName: string;
  imageUrl: string;
}

export const GrowthDiaryDetail = () => {
  // 현재 디테일 페이지의 folderId url 에서 가져오기 (목록버튼에서 활용)
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const folderId = queryParams.get('folderId');

  const { recordId } = useParams();

  const [diary, setDiary] = useState<Diary>();
  const [modalState, setModalState] = useState<boolean>(false);
  const content = '자녀성장일지 삭제';

  const navigate = useNavigate();

  const onModalOpen = () => {
    setModalState(!modalState);
  };

  const getGrowthDiary = async () => {
    const url = `/growth-record/${[recordId]}`;

    // const inputData = {
    //     recordId: recordId,
    //     familyId: 11
    // }

    const { data } = await api.get(url);

    setDiary(data.result);
  };

  const deleteDiary = async () => {
    const url = `/growth-record/${recordId}`;

    const { data } = await api.delete(url);

    navigate(`/growthdiary/folder/${diary?.folderId}`);
  };

  useEffect(() => {
    getGrowthDiary();
  }, []);

  return (
    <div>
      {/* 날짜 */}
      <div
        style={{
          width: '200px', // 너비 조정
          height: '40px', // 높이 조정
          marginLeft: '350px',
          fontSize: '29px', // 글자 크기 조정
          padding: '5px 10px', // 내부 여백 추가
          borderRadius: '15px', // 모서리 둥글게 처리
          marginTop: '27px',
          fontFamily: 'Ownglyph_ryuttung-Rg',
        }}
      >
        {diary?.date}
      </div>

      <div style={{ position: 'absolute', top: '27px', left: '30px' }}>
        <WhiteButton name="목록" path={`/growthdiary/folder/${folderId}`} />
      </div>

      <Link to={`/growthdiary/update/${recordId}?folderId=${folderId}`}>
        <button
          className="common-btn gray-btn"
          style={{ position: 'absolute', top: '27px', right: '120px' }}
        >
          수정
        </button>
      </Link>

      {/* 삭제 고치기 */}
      <span className="home-modal-open-Button" onClick={onModalOpen}>
        <button
          className="common-btn red-font"
          style={{ position: 'absolute', top: '27px', right: '30px' }}
        >
          삭제
        </button>
      </span>

      {/* 
            <BlueButton name="수정" path={`/growthdiary/update/${recordId}`} />
            <BlueButton name="삭제" path="/" onClick={onModalOpen} />
            */}

      <div className="container">
        {/* 그림 등록 네모 박스  */}
        <div className="image-box">
          <label className="input-file-box" htmlFor="fileUpload">
            {/* 이미지 */}
            <div>
              <img src={diary?.imageUrl} alt="" crossOrigin="anonymous" />
            </div>
          </label>
        </div>

        <div>
          {/* 글자 입력창  */}
          <div className="title-content">
            <input
              type="text"
              id="title"
              value={diary?.title}
              placeholder="제목"
            />

            <textarea
              className="grwoth-input"
              value={diary?.content}
            ></textarea>
          </div>
        </div>
      </div>

      {/* <div>{diary?.date}</div>
                <div><img src={diary?.imageUrl} alt="" /></div>
                <div>{diary?.content}</div> */}

      <div>
        {modalState && (
          <Modal
            content={content}
            modalState={modalState}
            setModalState={setModalState}
            deleteElement={deleteDiary}
          />
        )}
      </div>
    </div>
  );
};
