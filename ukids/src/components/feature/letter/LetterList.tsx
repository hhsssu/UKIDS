import { useEffect, useState } from 'react';
import api from '@/util/api.ts';
import { Link, useParams } from 'react-router-dom';
import BlueButton from '@components/common/BlueButton';
import { LetterItem } from '@components/feature/letter/LetterItem';
import { Pagination } from '@components/feature/pagination/Pagination.tsx';
import '@components/feature/letter/letter.css';
import { useFamilyStore } from '@stores/familyStore';

interface Letter {
  letterId: number;
  content: string;
  createDate: string;
  familyName: string;
  fromUsername: string;
  toUsername: string;
  isRead: boolean;
}

export const LetterList = () => {
  const { selectedFamilyId } = useFamilyStore();

  const [letters, setLetters] = useState<Letter[]>([]);

  // 받은 편지함(false)인지 보낸 편지함(true)인지
  const [state, setState] = useState<boolean>(false);

  // 페이지네이션
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  // 페이지 당 게시글 개수
  const size: number = 15;

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const isExistLetterDiv = () => {
    // 받은 편지함
    if (!state) {
      if (letters.length === 0) {
        return (
          <div className="h-full flex justify-center items-center text-[30px] font-light text-[#8e8e8e] text-center">
            아직 받은 편지가 없어요!
            <br />
            먼저 편지를 쓰러 가볼까요?
          </div>
        );
      } else {
        return (
          <div className="h-full grid grid-cols-5 grid-rows-3 place-items-center auto-rows-max">
            {letters.map((item) => (
              <Link to={`/letters/${item.letterId}`}>
                <LetterItem key={item.letterId} letter={item} state={state} />
              </Link>
            ))}
          </div>
        );
      }
    } else {
      if (letters.length === 0) {
        return (
          <div className="h-full flex justify-center items-center text-[30px] font-light text-[#8e8e8e] text-center">
            아직 보낸 편지가 없어요!
            <br />
            먼저 편지를 쓰러 가볼까요?
          </div>
        );
      } else {
        return (
          <div className="h-full grid grid-cols-5 grid-rows-3 place-items-center auto-rows-max">
            {letters.map((item) => (
              <Link to={`/letters/${item.letterId}`} state={{ state: state }}>
                <LetterItem key={item.letterId} letter={item} state={state} />
              </Link>
            ))}
          </div>
        );
      }
    }
  };

  const getLetters = async () => {
    let url = '';
    // 받은 편지
    if (!state)
      url = `/letter/to/${selectedFamilyId}?page=${page}&size=${size}`;
    else url = `letter/from/${selectedFamilyId}?page=${page}&size=${size}`;
    const { data } = await api.get(url);
    setLetters(data.result.letters);
    setTotalPage(data.result.totalPages);
  };

  useEffect(() => {
    getLetters();
  }, [state, page]);

  return (
    <div className="feature-box flex flex-col items-center">
      {/* 상단 영역 */}
      <div className="h-[15%] w-[90%] flex justify-between items-center">
        <div>
          <button
            onClick={() => {
              setState(false);
              handlePageChange(1);
            }}
            className={`header-font ${!state && 'selected'}`}
          >
            받은 편지함
          </button>
          <span className="header-font"> | </span>
          <button
            onClick={() => {
              setState(true);
              handlePageChange(1);
            }}
            className={`header-font ${state && 'selected'}`}
          >
            보낸 편지함
          </button>
        </div>
        <BlueButton name="편지쓰기" path={`/letters/write`} />
      </div>

      {/* 본문 영역 */}
      <div className="h-[75%] w-[90%]">{isExistLetterDiv()}</div>

      {/* 하단 페이지 선택 버튼 */}
      <div className="h-[10%]">
        <Pagination
          totalPage={totalPage}
          size={size}
          countPerPage={3}
          currentPage={page}
          onPageChange={handlePageChange} // onPageChange 핸들러를 호출하도록 수정
        />
      </div>
    </div>
  );
};
