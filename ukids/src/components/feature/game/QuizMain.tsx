// import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameBackButton from '../../common/WhiteBackButton';
import gameExplain from '@/assets/game_explain.png';
import './gamepart.css';

const QuizMain = () => {
  const nav = useNavigate();

  const onClickStart = () => {
    // 준비방으로 이동
    nav('ready');
  };
  const onClickQnAList = () => {
    // 질문 목록으로 이동
    nav('qna');
  };
  const onClickHistory = () => {
    // 결과 기록으로 이동
    nav('history');
  };

  return (
    <>
      <div className="w-[80%] flex flex-col justify-between">
        {/* 빈 div */}
        <div className="h-[1rem]"></div>

        {/* 윗 부분 */}
        <div className="flex flex-row justify-between">
          <GameBackButton path={'/game'} />
          <div className="hover-container m-4" id="hover-effect">
            <img src={gameExplain} alt="설명" />
            <div className="hover-text-left">
              가족들에게 알리고 싶은 나에 대한 퀴즈를 내고 서로 맞춰보아요!
              <br />
              좋아하는 과자나 음료수 같이 사소한 것도 좋아요.
              <br />
              "질문 목록" → "퀴즈 더 내러가기" 버튼을 클릭하면 돼요
              <br />
              질문을 하나라도 등록해야 게임을 시작할 수 있어요!
            </div>
          </div>
        </div>

        {/* 본 영역 */}
        <div className="flex justify-between items-center w-full px-4">
          <button
            className="quiz-select-box game-font quiz-font-color"
            onClick={onClickStart}
          >
            퀴즈 시작
          </button>
          <button
            className="quiz-select-box game-font quiz-font-color"
            onClick={onClickQnAList}
          >
            질문 목록
          </button>
          <button
            className="quiz-select-box game-font quiz-font-color"
            onClick={onClickHistory}
          >
            결과 기록
          </button>
        </div>
        {/* 빈 div */}
        <div className="h-[8rem]"></div>
      </div>
    </>
  );
};

export default QuizMain;
