import { useEffect, useState } from 'react';
import CallMyNameButton from './CallMyNameButton';
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

const CallMyNameHistory = () => {
  const [historyList, setHistoryList] = useState<History[]>([]);

  // 게임 기록 가져오기
  useEffect(() => {
    api.get('/result/{}').then((response) => {
      setHistoryList(response.data.result);

      // 테스트 코드
      setHistoryList(() => {
        return [
          {
            correctCounts: 4,
            totalCounts: 5,
            rank: 2,
            date: '2024-08-11',
            familyId: 2,
            familyName: '김가네',
            familyRepresentative: '김싸피',
          },
          {
            correctCounts: 2,
            totalCounts: 6,
            rank: 3,
            date: '2024-08-10',
            familyId: 4,
            familyName: '김가네',
            familyRepresentative: '김싸피',
          },
        ];
      });
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
                    <th className="text-center">우승자</th>
                    <th className="text-center">맞은 개수 / 문제 수</th>
                  </tr>
                </thead>
                <tbody>
                  {historyList.map((history: History, index) => {
                    return (
                      <tr key={index}>
                        <td className="text-center py-2">{index + 1}</td>
                        <td className="text-center py-2">{history.date}</td>
                        <td className="text-center py-2">
                          {history.familyRepresentative}
                        </td>
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
          <CallMyNameButton name="메인으로" path="/game" />
        </div>
      </div>
    </>
  );
};

export default CallMyNameHistory;
