import CallMyNameButton from './CallMyNameButton';
import './gamepart.css';

const CallMyNameResult = () => {
  return (
    <>
      <div className="feature-box">
        {/* 상단 */}
        <div className="h-[15%] flex justify-center items-center game-font callmyname-font-color">
          <h1>게임 결과</h1>
        </div>

        {/* 결과 창 */}
        <div className="h-[65%] flex justify-center items-center">
          <div className="w-[45rem] h-[20rem] bg-[#d9d9d9] rounded-[10px]"></div>
        </div>

        {/* 버튼 */}
        <div className="h-[15%] flex flex-row justify-center">
          <CallMyNameButton name="결과 기록" path="../history" />
          <CallMyNameButton name="메인으로" path="/game" />
        </div>
      </div>
    </>
  );
};

export default CallMyNameResult;
