import { useEffect, useState } from 'react';
import api from '@/util/api';
import { useNavigate } from 'react-router-dom';
import GamePageHeader from './GamePageHeader';
import './gamepart.css';

import writeAns from '@/assets/write_ans.png';
import deleteAns from '@/assets/delete_ans.png';
import checkIcon from '@/assets/game_checkbox.png';

interface Question {
  quizQuestionId: number;
  question: string;
  answer: string;
  quizType: string;
}

const QuizQnA = () => {
  const [questionList, setQuestionList] = useState([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [answer, setAnswer] = useState<string>('');

  // 페이지 이동
  const nav = useNavigate();
  const onClick = () => {
    nav('../question');
  };

  // 답변 수정한거 서버로 보내고 리스트 갱신
  const editSubmit = (quizQuestion: any) => {
    api
      .put('/quiz-question', {
        quizQuestionId: quizQuestion.quizQuestionId,
        question: quizQuestion.question,
        answer: answer,
        quizType: quizQuestion.quizType,
      })
      .then(() => {
        loadingQuestionList();
        setIsEditing(null); // 편집 모드 종료
      })
      .catch((e: any) => {
        console.error(e);
      });
  };

  // 답변 핸들러
  const handleWriteAns = (question: Question) => {
    setIsEditing(question.quizQuestionId); // 현재 편집 중인 질문 ID 설정
    setAnswer(question.answer || ''); // 기존 답변을 state에 저장

    if (question.quizType === 'OX') {
      // 퀴즈타입이 OX일 때는 OX 버튼 선택
    }
  };

  // 질문목록 불러오기
  const loadingQuestionList = () => {
    api
      .get(`/quiz-question`)
      .then((response: any) => {
        setQuestionList(response.data.result.quizQuestions);
      })
      .catch((error: any) => {
        console.error(error);
      });
  };

  // 질문 삭제
  const handleDeleteQuestion = (quizQuestionId: number) => {
    api
      .delete(`/quiz-question/${quizQuestionId}`)
      .then(loadingQuestionList())
      .catch((error: any) => {
        console.error(error);
      });
  };

  // 처음 접속 시 질문 목록 불러오기
  useEffect(() => {
    loadingQuestionList();
  }, []);

  useEffect(() => {
    loadingQuestionList();
  }, [questionList.length]);

  return (
    <>
      <div className="h-full feature-box flex flex-col items-center">
        {/* 헤더 */}
        <div className="h-[15%] w-[90%]">
          <GamePageHeader title="질문 목록" />
        </div>

        {/* 질문 목록 */}
        <div className="h-[65%] w-full overflow-y-auto">
          {/* 테이블 영역 */}
          <div className="flex justify-center">
            {questionList.length !== 0 ? (
              <table className="w-[90%]">
                <thead>
                  <tr className="border-solid border-b-4 border-[#777777]">
                    <th className="text-center py-3">번호</th>
                    <th className="text-center">질문</th>
                    <th className="text-center">답변</th>
                    <th className="text-center">수정/삭제</th>
                  </tr>
                </thead>
                <tbody>
                  {questionList.map((question: Question, index) => {
                    return (
                      <tr key={question.quizQuestionId}>
                        <td className="text-center py-2">{index + 1}</td>
                        <td className="text-center py-2">
                          {question.question}
                        </td>
                        <td className="text-center py-2">
                          {isEditing === question.quizQuestionId ? (
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                editSubmit(question);
                              }}
                              className="flex justify-center"
                            >
                              {question.quizType === 'OX' ? (
                                <div>
                                  <button
                                    type="button"
                                    onClick={() => setAnswer('O')}
                                    className={`quiz-O-btn ${
                                      answer === 'O' ? 'selected' : ''
                                    }`}
                                  >
                                    🞅
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setAnswer('X')}
                                    className={`quiz-X-btn ${
                                      answer === 'X' ? 'selected' : ''
                                    }`}
                                  >
                                    ✖
                                  </button>
                                </div>
                              ) : (
                                <input
                                  type="text"
                                  value={answer}
                                  onChange={(e) => setAnswer(e.target.value)}
                                  className="border border-gray-300 rounded"
                                />
                              )}
                              <button type="submit" className="m-2">
                                <img src={checkIcon} alt="submit" />
                              </button>
                            </form>
                          ) : (
                            <>
                              <span className="">{question.answer}</span>
                            </>
                          )}
                        </td>
                        <td className="flex justify-center items-center py-2">
                          {/* 수정버튼 */}
                          <button onClick={() => handleWriteAns(question)}>
                            <img src={writeAns} alt="edit" />
                          </button>
                          {/* 질문 삭제 버튼 */}
                          <button
                            onClick={() =>
                              handleDeleteQuestion(question.quizQuestionId)
                            }
                            className="m-2"
                          >
                            <img src={deleteAns} alt="delete" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="text-3xl">질문이 없습니다...!</div>
            )}
          </div>
        </div>

        {/* 버튼 */}
        <div className="h-[15%] flex justify-center">
          <button onClick={onClick} className="game-btn-quiz game-btn-common">
            퀴즈 더 내러가기
          </button>
        </div>
      </div>
    </>
  );
};

export default QuizQnA;
