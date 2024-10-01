// 페이지 목표
// 앞선 페이지로-> 앨범id를 전달, 해당 앨범의 전체 사진을 조회.
// api get /api/photo/all/{albumId}



import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '../../../stores/authStore';
import { useNavigate } from 'react-router-dom';

import api from '@/util/api';

import WhiteButton from '@components/common/WhiteButton';

import { Modal } from '@components/feature/modal/Modal.tsx';

import './AlbumDetail.css';
import '../../common/common.css';
import './UploadAlbum.css';


// 1. 사진 한 장
interface Photo {
  photoId: number;
  fileName: string;
  imgUrl: string;
  caption: string;
}

// 2. 앨범 하나 (여러 사진으로 구성됨)
interface Album {
  albumId: number; // 앨범 구분 번호
  date: string; // 날짜
  title: string; // 제목
  photos: Photo[]; // 앨범 속 사진들 (배열)
}

const AlbumDetail: React.FC = () => {
  // 현재 URL에서 albumId 추출
  const { albumId } = useParams<{ albumId: string }>();
  const [modalState, setModalState] = useState<boolean>(false);
  const content = '앨범 삭제';
  const navigate = useNavigate();

  // 상태관리 : 앨범 하나
  const [album, setAlbum] = useState<Album | null>(null);

  const token = useAuthStore((state) => state.token);

  const onModalOpen = () => {
    setModalState(!modalState);
  };

  // 네비게이션 함수(수정, 삭제 할 때 사용)

  // 앨범안의 모든 사진 가져오기
  useEffect(() => {
    const fetchAlbumDetails = async () => {
      try {
        const response = await api.get(`/photo/all/${albumId}`);

        if (response.data.result) {
          setAlbum({
            albumId: response.data.result.album.albumId,
            date: response.data.result.album.date,
            title: response.data.result.album.title,
            photos: response.data.result.photoList,
          });
        }
      } catch (error) {
        console.error('앨범을 불러오는 데 실패했습니다', error);
      }
    };

    fetchAlbumDetails();
  }, [albumId]);

  // 앨범 정보가 아직 없을 경우 (주소 직접 입력했을시)
  if (!album) {
    return <div>로딩 중...</div>;
  }

  const deleteAlbum = async () => {
    const url = `/album/${albumId}`;

    const { data } = await api.delete(url);

    navigate('/albums');
  };

  return (
    <div className="feature-box">

      {/* 맨 윗줄 */}
      <div className="input-border-box">
          {/* 제목 */}
          <div className="title-input">{album.title}</div>
      </div>
          

      {/* 둘째 줄 */}
      <div className="second-container">
        
        {/* 목록 */}
        <div><WhiteButton name="목록" path="/albums"/></div>

        {/* 날짜 */}
        <div className="date-input" style={{ marginLeft: '100px' }}>{album.date}</div>


        {/* 수정 삭제 */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link to={`/albums/update/${albumId}`}>
          <button className="common-btn gray-btn" style={{ marginRight: '10px' }}>수정</button>
        </Link>


        <span className="home-modal-open-Button" onClick={onModalOpen}>
          <button className="common-btn red-font" onClick={onModalOpen}>
            삭제
          </button>
        </span>
        </div>


      </div>
      {/* 둘째줄 끝 */}





      {/* 하단 내용 영역 */}
      <div className="photos-container">

          
          {album.photos.map((photo, index) => (
            <div key={index} className="photo-container">
              
                <img
                  src={photo.imgUrl}
                  alt={`Photo ${index + 1}`}
                  crossOrigin="anonymous"
                />
                <p>{photo.caption}</p>
              
            </div>
          ))}
        
        </div>
        
        {/* 삭제 모달 */}
        <div>
          {modalState && (
            <Modal
              content={content}
              modalState={modalState}
              setModalState={setModalState}
              deleteElement={deleteAlbum}
            />
          )}
        </div>



      
    </div>

  );
};

export default AlbumDetail;
