import { useEffect, useState } from 'react';
import api from '@/util/api';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

import BlueButton from '@components/common/BlueButton';
import WhiteButton from '@components/common/WhiteButton';

import { Loading } from '@components/feature/loading/Loading';

interface Diary {
  title: string;
  content: string;
  date: string;
  file: File | null;
  imageName: string;
  imageUrl: string;
}

export const GrowthDiaryUpdate = () => {
  const [loading, setLoading] = useState<boolean>(false);
  // 안됨
  // const {folderId} = useParams();
  const today = new Date().toISOString().split('T')[0];

  // url 직접 추출
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const folderId = queryParams.get('folderId');

  // 추가 : 이미지 미리보기 URL 상태
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { recordId } = useParams();
  const [imageName, setImageName] = useState();
  const [imageCheck, setImageCheck] = useState<boolean>(false);
  const navigate = useNavigate();

  const [diary, setDiary] = useState<Diary>({
    file: null, // File은 null로 초기화
    content: '',
    date: '',
    title: '',
    imageName: '',
    imageUrl: '',
  });

  const getDiary = async () => {
    const url = `/growth-record/${recordId}`;

    const { data } = await api.get(url);

    setDiary(data.result);
    setImageName(data.result.imageName);
    setPreviewUrl(data.result.imageUrl);
  };

  const updateDiary = async () => {
    if (diary.title == '') {
      alert('제목을 입력해주세요');
      return;
    } else if (diary.content == '') {
      alert('내용을 입력해주세요');
      return;
    } else if (diary.date == '') {
      alert('날짜를 선택해주세요');
      return;
    }
    if (!confirm('수정하시겠습니까?')) return;

    setLoading(true);

    const formData = new FormData();
    formData.append('date', diary.date);
    formData.append('content', diary.content);
    formData.append(`title`, diary.title);
    // 이미지 수정
    if (diary.file) {
      formData.append('multipartFile', diary.file);
    }

    const url = `/growth-record/${recordId}`;
    const { data } = await api.put(url, formData, {
      headers: {
        'Content-Type': undefined,
      },
    });

    alert('수정 완료!');

    // 수정: 현재의 폴더 아이디도 함께 전달
    navigate(`/growthdiary/diary/${recordId}?folderId=${folderId}`);
  };

  const changeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imgFile = e.target.files?.item(0);
    const fileType = imgFile?.type;

    if (!fileType?.includes('image') || fileType?.includes('image/gif')) {
      alert('이미지(.gif 제외) 파일만 업로드 할 수 있습니다.');
      return;
    }
    if (imgFile && imgFile.size > 1024 ** 2 * 10) {
      alert('파일 크기는 10MB를 초과할 수 없습니다.');
      return;
    }
    if (imgFile) setDiary({ ...diary, file: imgFile });

    // if (e.target.files?.item(0))
    //   setDiary({ ...diary, file: e.target.files?.item(0) });

    // 추가 : 이미지 미리보기
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result as string);
    };
    fileReader.readAsDataURL(e.target.files[0]);
  };

  useEffect(() => {
    getDiary();
  }, []);

  return (
    <div>
      {/* 날짜 선택 */}
      <div>
        <input
          type="date"
          value={diary.date}
          max={today}
          onChange={(e) => setDiary({ ...diary, date: e.target.value })}
          style={{
            width: '230px', // 너비 조정
            height: '40px', // 높이 조정
            marginLeft: '350px',
            fontSize: '29px', // 글자 크기 조정
            padding: '5px 10px', // 내부 여백 추가
            borderRadius: '15px', // 모서리 둥글게 처리
            marginTop: '27px',
            fontFamily: 'Ownglyph_ryuttung-Rg', // 폰트 바꾸기
          }}
        />
      </div>

      {/* 상단 목록, 등록 버튼 */}

      <div style={{ position: 'absolute', top: '27px', left: '30px' }}>
        <WhiteButton
          name="목록"
          path={`/growthdiary/diary/${recordId}?folderId=${folderId}`}
        />
      </div>

      <div style={{ position: 'absolute', top: '27px', right: '30px' }}>
        <BlueButton name="수정" path="/" onClick={updateDiary} />
      </div>

      {/* <BlueButton name="등록" path="/" onClick={updateDiary} /> */}

      <div className="container">
        {/* 그림 등록 네모 박스  */}
        <div className="image-box">
          <label className="input-file-box" htmlFor="fileUpload">
            <span>+</span>
            {/* 이미지 미리보기 */}
            {previewUrl && (
              <img src={previewUrl} alt="Preview" crossOrigin="anonymous" />
            )}
            <input
              required
              className="hidden"
              id="fileUpload"
              type="file"
              accept="image/*"
              onChange={changeImage}
            />
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
              onChange={(e) => setDiary({ ...diary, title: e.target.value })}
              required
            />

            <textarea
              className="grwoth-input"
              value={diary?.content}
              placeholder="내용을 입력하세요..."
              onChange={(e) => setDiary({ ...diary, content: e.target.value })}
            ></textarea>
          </div>
        </div>
      </div>

      {loading && <Loading />}
    </div>
  );
};
