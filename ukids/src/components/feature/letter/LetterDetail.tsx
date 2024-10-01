import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import api from '@/util/api';
import BlueButton from '@components/common/BlueButton';
import WhiteBackButton from '../../common/WhiteBackButton';
import '@components/feature/letter/letter.css';

interface Letter {
  content: string;
  createDate: string;
  familyName: string;
  fromUsername: string;
  toUsername: string;
  toUserId: number;
  fromUserId: number;
  isRead: boolean;
}

export const LetterDetail = () => {
  const location = useLocation();
  const state = location.state?.state;
  const { letterId } = useParams();

  const [letter, setLetter] = useState<Letter>();

  const getLetter = async () => {
    const url = `/letter/${letterId}`;

    const { data } = await api.get(url);

    setLetter(data.result);
  };

  useEffect(() => {
    console.log(state);
    getLetter();
  }, []);

  return (
    <div className="feature-box flex flex-col items-center">
      {/* 상단 영역 */}
      <div className="h-[15%] w-[90%] flex justify-between items-center">
        <WhiteBackButton path="/letters" />
        {!state ? (
          <BlueButton
            name="답장하기"
            path={`/letters/write/${letter?.fromUserId}`}
          />
        ) : (
          <div></div>
        )}
      </div>

      {/* 본문 영역 */}
      <div className="w-[90%] h-[100%]">
        {/* To. 사람, 가족방, 날짜 띄워주는 영역 */}
        <div className="h-[15%]">
          <div className="h-full text-[30px] grid grid-cols-3">
            <div></div>
            <div className="flex justify-center items-center">
              To. {letter?.toUsername}
            </div>
            <div className="text-[16px] flex flex-row justify-end items-end mb-2">
              <span>{letter?.familyName}</span>
              <span className="ml-2">{letter?.createDate}</span>
            </div>
          </div>
        </div>

        {/* 편지 내용 */}
        <div className="h-[80%]">
          <textarea
            className="textarea-with-lines w-full h-full"
            value={letter?.content}
            disabled
          />
        </div>
      </div>
    </div>
  );
};
