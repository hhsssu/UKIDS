import { useState } from 'react';
import './gamepart.css';
import GamePageHeader from './GamePageHeader';
import api from '@/util/api';

const QuizQuestion = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(''); // 답변 입력 필드의 내용
  const [selectedOption, setSelectedOption] = useState(''); // OX 버튼의 선택 상태 ('O' or 'X')

  // 답변 입력 필드 변경 시 호출되는 함수
  const handleAnswerChange = (e: any) => {
    setAnswer(e.target.value); // 입력된 답변을 상태에 저장
    setSelectedOption(''); // OX 버튼 선택 해제
  };

  // OX 버튼 클릭 시 호출되는 함수
  const handleOptionClick = (option: any) => {
    setSelectedOption(option); // O 또는 X 선택 상태 업데이트
    setAnswer(''); // 답변 입력 필드 초기화
  };

  // 폼 제출 시 호출되는 함수
  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!question || (!answer && !selectedOption)) {
      alert('질문과 답변을 입력해주세요!');
      return;
    }

    let quizType = '';
    let ans = '';

    if (selectedOption) {
      ans = selectedOption;
      quizType = 'OX';
    } else {
      ans = answer;
      quizType = 'MULTIPLE_CHOICE';
    }

    api
      .post('/quiz-question', {
        question,
        answer: ans,
        quizType,
      })
      .then(() => {
        alert('퀴즈 등록 완료!');
        setQuestion('');
        setAnswer('');
        setSelectedOption('');
      })
      .catch((e: any) => {
        console.error(e);
      });
  };

  return (
    <>
      <div className="h-full feature-box flex flex-col items-center">
        {/* 헤더 */}
        <div className="h-[15%] w-[90%]">
          <GamePageHeader title="퀴즈 등록" />
        </div>

        {/* 본문 영역 */}
        <div className="h-full flex flex-col justify-center items-center">
          <div className="text-4xl">
            <form onSubmit={handleSubmit}>
              <div className="m-4">
                <label htmlFor="question">질문 </label>
                <input
                  type="text"
                  value={question}
                  name="question"
                  id="question"
                  placeholder="질문을 입력하세요!"
                  onChange={(e) => {
                    setQuestion(e.target.value);
                  }}
                  className="border-solid border-b-4 border-[#999] py-2 mx-2"
                />
              </div>
              <div className="m-4">
                <label htmlFor="question">답변 </label>
                <input
                  type="text"
                  value={answer}
                  name="question"
                  id="question"
                  onChange={handleAnswerChange}
                  placeholder="답변을 입력하세요!"
                  className="border-solid border-b-4 border-[#999] py-2 mx-2"
                />
                <button
                  type="button"
                  onClick={() => handleOptionClick('O')}
                  className={`quiz-O-btn ${
                    selectedOption === 'O' ? 'selected' : ''
                  }`}
                >
                  🞅
                </button>
                <button
                  type="button"
                  onClick={() => handleOptionClick('X')}
                  className={`quiz-X-btn ${
                    selectedOption === 'X' ? 'selected' : ''
                  }`}
                >
                  ✖
                </button>
              </div>

              {/* 버튼 영역 */}
              <div className="flex justify-center p-4 mt-32">
                <button
                  type="button"
                  className="game-btn-common game-btn-g"
                  onClick={() => {
                    setQuestion('');
                    setAnswer('');
                    setSelectedOption('');
                  }}
                >
                  초기화
                </button>
                <button className="game-btn-common game-btn-quiz" type="submit">
                  등록하기
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuizQuestion;
