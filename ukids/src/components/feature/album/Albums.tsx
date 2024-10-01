// 1. 로그인 사용자가 선택한 '가족'에 해당하는 전체 앨범들을 조회
// api get, /api/album/all/{familyId}
// 주의: 전체 앨범에는 페이지 정보(current page, total page)가 있음
// 한번에 최대 5개임

// 하나의 album = 여러개의 photo로 구성
// albumId -> photos 조회
// api get, /api/photo/all/{albumId}

// 여러개의 album들을 조회

// 2. 클릭시 앨범 상세 페이지로 이동
// 상세 페이지(/albums/{albumId})


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/util/api';


import { useAuthStore } from '@/stores/authStore';
import { useFamilyStore } from '@/stores/familyStore';

import BlueButton from '@components/common/BlueButton';

import './Albums.css';
import '@components/common/common.css';

import { Pagination } from '@components/feature/pagination/Pagination.tsx';

import diaryIcon from '../../../assets/diary.png'; 




// 1. 사진 한 장
interface Photo {
  photoId: number;
  fileName: string;
  imgUrl: string;
  caption: string;
}

// 2. 앨범 하나 (여러 사진으로 구성)
interface Album {
  albumId: number; 
  date: string;  
  title: string;  
  photos: Photo[]; // 앨범 속 사진들 (배열)
}

interface AlbumPhotosResponse {
  result: {
    size: number;
    currentPage: number;
    totalPage: number;
    album: Album; 
    photoList: Photo[];
  };
}

const Albums: React.FC = () => {
  // const navigate = useNavigate();
  const [albums, setAlbums] = useState<Album[]>([]);
  const token = useAuthStore((state) => state.token);

  const { selectedFamilyId } = useFamilyStore();

  // 페이지네이션
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  // 페이지 당 게시글 개수
  const size: number = 3;

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const fetchAlbums = async () => {
    try {
      // 불러온 전체 album에 페이지가 있음
      // 첫 페이지 데이터를 불러와서 전체 페이지 수 확인
      let response = await api.get(
        `/album/all/${selectedFamilyId}?page=${page}&size=${size}`,
      );

      // 전체 페이지 (예: 3)
      setTotalPage(response.data.result.totalPage);
      let allAlbums = response.data.result.albumResponseDtoList;

      // 2페이지 ~ total page 데이터 불러오기

      // for (let page = 2; page <= totalPages; page++) {
      //   response = await api.get(`/album/all/${selectedFamilyId}?page=${page}`);
      //   allAlbums = allAlbums.concat(response.data.result.albumResponseDtoList);
      // }

      // 전달받은 데이터를 albums에 저장
      // 이렇게 하면 albumId, title, date 세 정보만 저장됨
      // 사진은 albumId -> photo all 통해서 가져와야함
      // 이하 코드 참조

      // setAlbums(allAlbums);

      const albumsWithPhotos = await Promise.all(
        allAlbums.map(async (album: any): Promise<Album> => {
          const photosResponse = await api.get<AlbumPhotosResponse>(
            `/photo/all/${album.albumId}`,
          );
          return {
            ...album,
            photos: photosResponse.data.result.photoList, // 타입 에러가 해결되어야 합니다.
          };
        }),
      );

      // const albumsWithPhotos = await Promise.all(allAlbums.map(async (album: any): Promise<Album> => {
      //   const photosResponse = await axios.get<AlbumPhotosResponse>(`https://i11b306.p.ssafy.io/api/photo/all/${album.albumId}`, {
      //     headers: { 'Authorization': `Bearer ${token}` }
      //   });
      //   return {
      //     ...album,
      //     photos: photosResponse.data.result.photoList // 타입 에러가 해결되어야 합니다.
      //   };
      // }));

      setAlbums(albumsWithPhotos);
    } catch (error) {
      console.error('앨범 데이터를 불러오기 실패', error);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);
  useEffect(() => {
    if (token && selectedFamilyId) {
      fetchAlbums();
    }
  }, [token, selectedFamilyId]);

  // 페이지가 변할 때
  useEffect(() => {
    fetchAlbums();
  }, [page]);

  return (
    <div className="feature-box">

      {/* 메인 글자 */}
      <div className="main-label">
        앨범
      </div>
      
      {/* 메인 오른쪽 : 만들기 버튼 */}
      <div style={{ marginLeft: '764px', marginTop: '33px' }}>
        <BlueButton name=" 만들기" path="/albums/upload" />
      </div>


      {/* 이하 내용물 영역 */}

      {/* 게시글이 없을 때  */}
      {albums.length === 0 ? (
        <div className="nothing-message">
          아직 앨범이 없어요!
          <br/>
          앨범을 만들러 가볼까요?
        </div>
        ) : (
        <div className='lists-container'>

            <div  className='lists-first-container'>
    

                {albums.map((album) => (
                  
                  <div className='album-one'>
                  <Link
                    key={album.albumId}
                    to={`/albums/${album.albumId}`}
                    
                  >

                    <div className="album-one-date">{album.date}</div>
                      {album.photos && album.photos.length > 0 ? (
                        <img
                          src={album.photos[0].imgUrl}
                          alt={`사진: ${album.title}`}
                          crossOrigin="anonymous"
                        />
                      ) : (
                        <div className="no-photo">
                          <img src={diaryIcon} alt="사진 없음" />
                        </div>
                      )}
                      {/* <div className="album-item-date">{album.date}</div> */}
                      <div className="album-one-title">{album.title}</div>
                  </Link>
                  
                  </div>
                ))}

            </div>

                          <div className="page-box">
                              <Pagination
                                totalPage={totalPage}
                                size={size}
                                countPerPage={10}
                                currentPage={page}
                                onPageChange={handlePageChange} // onPageChange 핸들러를 호출하도록 수정
                                className="page-number"
                              />
                          </div>


        </div>

         
        
      )}
    </div>
    
  );
};

export default Albums;
