import { useState, useRef, useEffect } from 'react';

import api from '@/util/api';

import { useFamilyStore } from '@/stores/familyStore';
import { useParams, useNavigate } from 'react-router-dom';


import BlueButton from '@components/common/BlueButton';
import WhiteButton from '@components/common/WhiteButton';


import { format } from 'date-fns';

// 추가
import closeIcon from '../../../assets/close.png';
import uploadIcon from '../../../assets/upload.png'; 
import './UploadAlbum.css';
import { Loading } from '@components/feature/loading/Loading';


interface Album {
  date: string;
  title: string;
}

interface Photo {
  file: File;
  caption: string;
}

interface UploadedPhoto {
  photoId: number;
  fileName: string;
  imgUrl: string;
  s3Name: string;
  caption: string;
}

interface Caption {
  captionId: number;
  content: string;
  photoId: number;
}

export const UpdateAlbum = () => {
  const today = new Date().toISOString().split('T')[0];
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Date>();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);
  const [deletePhotos, setDeletePhotos] = useState<UploadedPhoto[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [uploadedCaption, setUploadedCaption] = useState<Caption[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const { albumId } = useParams();

  const { selectedFamilyId } = useFamilyStore();

  // 수정: 이미지 검증을 추가함
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

  const handleAddPhoto = () => {
    if (selectedFile && caption) {
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

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
  };

  const uploadPhotos = async (albumData: any) => {
    // 삭제된 사진 없애기
    deletePhotos.map((photo) => {
      const s3Name = photo.s3Name.substring(6);
      const url = `/photo/uploaded/${s3Name}`;
      const { data } = api.delete(url);
    });

    // 삭제되지 않은 사진의 캡션 수정
    uploadedCaption.map((caption) => {
      const url = `/caption`;
      const inputData = {
        captionId: caption.captionId,
        photoId: caption.photoId,
        content: caption.content,
      };
      const { data } = api.put(url, inputData);
    });

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
      const photoIds = responses.map((res) => res.data.photoId);

      // 앨범 정보 변경
      const inputData = {
        albumId: albumId,
        familyId: selectedFamilyId,
        title: title,
        date: format(date as Date, 'yyyy-MM-dd'),
      };
      api.put(`/album`, inputData);

      alert('수정 완료!');
    } catch (error) {
      console.error('사진 업로드 실패:', error);
      alert('앨범 수정에 실패했습니다.');
    }finally{
      setLoading(false);
    }

    navigate(`/albums/${albumId}`);
  };

  const updateAlbum = async () => {
    if (photos.length === 0 && uploadedPhotos.length === 0) {
      alert('사진을 등록해 주세요.');
      return;
    }
    if (!date) {
      alert('날짜를 선택해주세요.');
      return;
    }
    if(!confirm('수정하시겠습니까?')){
      return ;
    }
    setLoading(true);
    const url = `/album/${albumId}`;
    const { data } = await api.get(url);
    uploadPhotos(data.result);
  };

  const getUploadedPhotos = async () => {
    const url = `/photo/all/${albumId}`;

    const { data } = await api.get(url);

    setUploadedPhotos(data.result.photoList);
    setDate(data.result.album.date);
    setTitle(data.result.album.title);

    for (let i = 0; i < data.result.photoList.length; i++) {
      const urlCaption = `/caption/${data.result.photoList[i].photoId}`;
      const resp = await api.get(urlCaption);
      setUploadedCaption((prevCaption) => [...prevCaption, resp.data.result]);
    }
  };

  const deletePrevPhoto = (photo: UploadedPhoto, index: any) => {
    setUploadedPhotos((prevUploadedPhotos) =>
      prevUploadedPhotos.filter((_, i) => i !== index),
    );
    setDeletePhotos((prevDeletePhoto) => [...prevDeletePhoto, photo]);
    setUploadedCaption((prevUploadedCaptions) =>
      prevUploadedCaptions.filter((_, i) => i !== index),
    );
  };

  useEffect(() => {
    getUploadedPhotos();
  }, []);

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
          value={date}
          onChange={(e) => handleDateChange(e.target.value)}
          className="date-input"
          />
        </div>

        <div>
          <BlueButton name="수정" path="/" onClick={updateAlbum}/>
        </div>

      </div>
      {/* 여기까지 둘째 줄 */}



      {/* 셋째 줄 */}
      <div className="third-container">


          {/* 파일 업로드 */}
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

      <div className="preview-box">
          {uploadedPhotos.map((photo, index) => (
                <div key={index} className="photo-card">
                  <img
                    src={closeIcon}
                    alt="Delete Icon"
                    className="delete-icon"
                    crossOrigin="anonymous"
                    onClick={() => deletePrevPhoto(photo, index)}
                  />
                  <img
                    src={photo.imgUrl}
                    alt={`Preview ${index}`}
                    crossOrigin="anonymous"
                    className="photo-card-img"
                  />
                  {/* <p>{photo.caption}?</p> */}

                  <div className="caption-area">
                    <input
                      type="text"
                      value={uploadedCaption[index]?.content}
                      onChange={(e) => {
                        setUploadedCaption((prevCaptions) =>
                          prevCaptions.map((caption, i) =>
                            i === index
                              ? { ...caption, content: e.target.value }
                              : caption,
                          ),
                        );
                      }}
                      style={{ width: '323px' }}
                      // className="outline-none rounded-md"
                      maxLength={50}
                    />
                  </div>


                  
                </div>
            ))}
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
            />
            <div className="caption-area"> 
            <input
              type="text"
              value={photo.caption}
              onChange={(e) =>
                setPhotos((prevPhotos) =>
                  prevPhotos.map((photo, i) =>
                    i === index ? { ...photo, caption: e.target.value } : photo,
                  ),
                )
              }
              style={{ width: '310px' }}
              className="outline-none rounded-md"
              maxLength={50}
            />
          </div>


          </div>

        ))}
      </div>
      {loading && <Loading />}
    </div>
  );
};
