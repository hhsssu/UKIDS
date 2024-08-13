import { useEffect, useState } from 'react';
import QuizButton from './QuizButton';
import GamePageHeader from './GamePageHeader';
import api from '../../../util/api';
import './gamepart.css';

interface History {
  correctCounts: number;
  totalCounts: number;
  rank: number;
  date: string;
  familyId: number;
  familyName: string;
  familyRepresentative: string;
}

const QuizHistory = () => {
  const [historyList, setHistoryList] = useState<History[]>([]);

  // 게임 기록 가져오기
  useEffect(() => {
    api.get('/quiz').then((response) => {
      console.log(response.data);
      setHistoryList(response.data.result.quizResults);
    });
  }, []);

  return (
    <>
      <div className="feature-box h-full">
        {/* 헤더 */}
        <div className="h-[15%] flex items-center">
          <GamePageHeader title="게임 결과 기록" />
        </div>

        {/* 본문 영역 */}
        <div className="h-[65%] overflow-y-auto">
          {/* 테이블 영역 */}
          <div className="flex justify-center">
            {historyList.length !== 0 ? (
              <table className="w-[80%]">
                <thead>
                  <tr className="border-solid border-b-4 border-[#777777]">
                    <th className="text-center py-3">번호</th>
                    <th className="text-center">날짜</th>
                    <th className="text-center">내 순위</th>
                    <th className="text-center">맞은 개수 / 문제 수</th>
                  </tr>
                </thead>
                <tbody>
                  {historyList.map((history: History, index) => {
                    return (
                      <tr key={index}>
                        <td className="text-center py-2">{index + 1}</td>
                        <td className="text-center py-2">{history.date}</td>
                        <td className="text-center py-2">{history.rank}</td>
                        <td className="text-center py-2">
                          {history.correctCounts} / {history.totalCounts}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="flex items-center text-3xl">
                게임 기록이 없습니다!
              </div>
            )}
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="h-[15%] flex justify-center p-4">
          <QuizButton name="메인으로" path="/game" />
        </div>
      </div>
    </>
  );
};

export default QuizHistory;