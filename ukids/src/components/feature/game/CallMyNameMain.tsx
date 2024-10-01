import { useNavigate } from 'react-router-dom';
import GameBackButton from '../../common/WhiteBackButton';
import gameExplain from '@/assets/game_explain.png';
import './gamepart.css';

const CallMyNameMain = () => {
  const nav = useNavigate();

  const onClickStart = () => {
    // 준비방으로 이동
    nav('./ready');
  };
  const onClickHistory = () => {
    // 결과 기록으로 이동
    nav('./history');
  };

  return (
    <>
      <div className="w-[80%] flex flex-col justify-between">
        {/* 빈 div */}
        <div className="h-[1rem]"></div>

        {/* 윗 부분 */}
        <div className="flex flex-row justify-between">
          <GameBackButton path={'/game'} />
          <img src={gameExplain} alt="설명" className="" />
        </div>

        {/* 본 영역 */}
        <div className="flex justify-between items-center w-full">
          <button
            className="callmyname-select-box game-font callmyname-font-color"
            onClick={onClickStart}
          >
            게임 시작
          </button>
          <button
            className="callmyname-select-box game-font callmyname-font-color"
            onClick={onClickHistory}
          >
            결과 기록
          </button>
        </div>
        {/* 빈 div */}
        <div className="h-[2rem]"></div>
      </div>
    </>
  );
};

export default CallMyNameMain;
