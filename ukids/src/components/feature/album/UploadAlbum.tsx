import { useState, useRef } from 'react';

import api from '@/util/api';

import { useFamilyStore } from '@/stores/familyStore';
import { useTreeStore } from '@/stores/treeStore';
import { useNavigate } from 'react-router-dom';

import BlueButton from '@components/common/BlueButton';
import WhiteButton from '@components/common/WhiteButton';

import './UploadAlbum.css';


import { format } from 'date-fns';

import { Loading } from '@components/feature/loading/Loading';

// x 아이콘 
import closeIcon from '../../../assets/close.png'; 
import uploadIcon from '../../../assets/upload.png'; 


interface Photo {
  file: File;
  caption: string;
}

const UploadAlbum = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // const [selectedFile, setSelectedFile] = useState<Photo | null>(null);
  
  // const [previewUrl, setPreviewUrl] = useState<string | null>(null);


  const [caption, setCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);


  const { selectedFamilyId } = useFamilyStore();
  const { updateTreeExp } = useTreeStore();



  // 이미지 검증 과정 추가

  // const handleFileChange = (event: any) => {
  //   if (event.target.files.length > 0) {
  //     setSelectedFile(event.target.files[0]);
  //   }
  // };

  // 이미지 검증을 추가함
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imgFile = e.target.files?.item(0);
    const fileType = imgFile?.type;

    // 이미지 파일 유형 검증 (GIF 제외)
    if (!fileType?.includes('image') || fileType?.includes('image/gif')) {
      alert('이미지(.gif 제외) 파일만 업로드 할 수 있습니다.');
      return;
    }

    // 파일 크기 검증 (10MB 제한)
    if (imgFile && imgFile.size > (1024 ** 2 * 10)) {
      alert('파일 크기는 10MB를 초과할 수 없습니다.');
      return;
    }

    if (imgFile) {
      setSelectedFile(imgFile);

      // 이미지 미리보기 생성
      // const fileReader = new FileReader();
      // fileReader.onload = () => {
      //   setPreviewUrl(fileReader.result as string);
      // };
      // fileReader.readAsDataURL(imgFile);
    }
  };



  







  const handleDateChange = async (selectedDate) => {
    setDate(selectedDate); // 선택된 날짜 상태 업데이트
    const formattedDate = format(new Date(selectedDate), 'yyyy-MM-dd');
  
    try {
      // 해당 날짜의 앨범 존재 여부를 확인
      const response = await api.get(`/album/all/${selectedFamilyId}`);
      const albums = response.data.result.albumResponseDtoList;
  
      // 해당 날짜에 앨범이 이미 존재하는지 확인
      const albumExists = albums.some(album => album.date === formattedDate);
      if (albumExists) {
        alert('해당 날짜에 만든 앨범이 이미 존재해! 다른 날짜를 선택해봐!');
      }
    } catch (error) {
      console.error('앨범 조회 실패:', error);
      alert('가족을 선택해야 앨범을 만들 수 있어!');
    }
  };
  

  

  const handleAddPhoto = () => {
    // 사진과 캡션이 모두 없을 때
    if (!selectedFile && !caption) {
        alert("사진과 캡션을 등록해주세요.");
    }
    // 캡션이 없을 때
    else if (!caption) {
        alert("캡션을 등록해주세요.");
    }
    // 사진이 없을 때
    else if (!selectedFile) {
        alert("사진을 등록해주세요.");
    }
    // 사진과 캡션이 모두 있을 때
    else {
        setPhotos((prevPhotos) => [
            ...prevPhotos,
            { file: selectedFile, caption },
        ]);
        setSelectedFile(null);
        setCaption('');
    }
};

  
  const handleDeletePhoto = (index: any) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  // 클릭 이벤트 핸들러 내에서 안전하게 click 메소드 호출
  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

 

  const createAlbum = async () => {
    if (!date) {
      alert('날짜를 선택해주세요.');
      return null; // 날짜가 선택되지 않았으면 null을 반환하고 함수 종료
    }

    const formattedDate = format(new Date(date), 'yyyy-MM-dd');

    try {
      // 먼저 해당 날짜에 앨범이 있는지 확인
      const existingAlbumResponse = await api.get(`/album/all/${selectedFamilyId}`);

      if (existingAlbumResponse.data && existingAlbumResponse.data.date === formattedDate) {
        alert('해당 날짜의 앨범이 이미 존재해요!');
        return null; // 이미 앨범이 존재하므로 null을 반환하고 함수 종료
      }



    
      const response = await api.post('/album', {
        title,
        date: formattedDate,
        familyId: selectedFamilyId,
      });
      return {
        albumId: response.data.albumId,
        familyId: selectedFamilyId,
        date: formattedDate,
      };
    } catch (error) {
      setLoading(false);
      console.error('앨범 생성 실패:', error);
      alert('앨범 생성에 실패했습니다.');
      return null;
    }
  };

  const uploadPhotos = async (albumData: any) => {
    try {
      const responses = await Promise.all(
        photos.map((photo) => {
          const formData = new FormData();
          formData.append('multipartFile', photo.file);
          formData.append('caption', photo.caption);
          formData.append('familyId', selectedFamilyId);
          formData.append('date', albumData.date);

          return api.post('/photo', formData, {
            headers: {
              'Content-Type': undefined,
            },
          });
        }),
      );
      // 응답에서 사진 ID 추출 (응답 형식에 따라 수정 필요)
      const photoIds = responses.map((res: any) => res.data.photoId);
      updateTreeExp(selectedFamilyId, 25);
      alert('모든 사진이 성공적으로 업로드되었습니다!');
    } catch (error) {
      console.error('사진 업로드 실패:', error);
      alert('사진 업로드에 실패했습니다.');
    } finally{
      setLoading(false);
    }
  };

  const uploadAlbum = async () => {
    if (photos.length === 0) {
      alert('사진을 등록해 주세요.');
      return;
    }
    if (!date) {
      alert('날짜를 선택해주세요.');
      return;
    }

    if(!confirm('등록하시겠습니까?')){
      return;
    }

    const albumData = await createAlbum();
    if (albumData) {
      setLoading(true);
      await uploadPhotos(albumData);
      setPhotos([]);
      setTitle('');
      navigate('/albums'); // 성공 시 앨범 목록 페이지로 이동
      // setDate(new Date());
    }
  };

  return (
    <div className="feature-box">

        {/* 맨 윗줄 */}
        <div className="input-border-box">
          <input
            type="text"
            value = {title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            className="title-input"
          />
        </div>



        {/* 둘째 줄 */}
        <div className="second-container">

          <div>
            <WhiteButton name="목록" path="/albums" />
          </div>

          <div>
          <input
          type="date"
          onChange={(e) => handleDateChange(e.target.value)}
          className="date-input"
          />
          </div>
          
          <div>
            <BlueButton name="등록" path="/" onClick={uploadAlbum}/>
          </div>


        </div>
        {/* 여기까지 둘째 줄 */}





        {/* 셋째 줄 */}
        <div className="third-container">


                    {/* 왼쪽 영역 */}
                    <div
                      className="file-button"
                      onClick={handleFileClick}
                      aria-label="파일 선택"
                      title="파일 선택">
                        

                          
                        <span className="file-button-icon">
                          <img src={uploadIcon} alt="Upload" style={{ verticalAlign: 'middle'}} />
                        </span>

                            <input
                              type="file"
                              onChange={handleFileChange}
                              ref={fileInputRef}
                              className="hidden"
                            />
                    </div>




                  <div className="left-container">


                    <div className="file-photo-container">

                            {selectedFile && (
                              <img
                                src={URL.createObjectURL(selectedFile)}
                                crossOrigin="anonymous"
                                alt="Selected"/>
                            )}

                    </div>
                    
                 
                      <div className="caption-area">
                        <input
                          type="text"
                          value={caption}
                          onChange={(e) => setCaption(e.target.value)}
                          placeholder=" ㄴ 사진 캡션을 작성하세요."
                          style={{ width: '310px' }}
                          className="outline-none rounded-md"
                          maxLength={50}
                        />
                      </div>
                    

                    <button className="register-button" onClick={handleAddPhoto}>
                      앨범에 넣기
                    </button>
                  
                  </div>
                </div>
                




                {/* 오른쪽 영역 */}
                <div className="preview-box">
                  {photos.map((photo, index) => (
                    <div key={index} className="photo-card">
                      <img
                        src={closeIcon}
                        alt="Delete Icon"
                        className="delete-icon"
                        crossOrigin="anonymous"
                        onClick={() => handleDeletePhoto(index)}
                      />
                      <img
                        src={URL.createObjectURL(photo.file)}
                        alt={`Preview ${index}`}
                        crossOrigin="anonymous"
                        className="photo-card-img"
                        // className="w-full h-auto rounded"
                      />
                      <p>{photo.caption}</p>
                    </div>
                  ))}
               </div>
   
   
               {loading && <Loading />}
    </div>
  );
};

export default UploadAlbum;
