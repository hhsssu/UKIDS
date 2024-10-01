import WhiteBackButton from '@components/common/WhiteBackButton';
import '@components/feature/game/gamepart.css';

interface GamePageHeader {
  title: string;
}

const GamePageHeader = ({ title }: GamePageHeader) => {
  return (
    <>
      {/* 헤더 내부 그리드 */}
      <div className="head-grid">
        {/* 좌측 상단 버튼 */}
        <WhiteBackButton path={'../'} />
        {/* 제목 */}
        <p className="text-5xl font-[ONE-Mobile-POP]">{title}</p>
        {/* 빈 div로 오른쪽 여백 맞추기 + 상하여백주기 */}
        <div className="my-11"></div>
      </div>
    </>
  );
};

export default GamePageHeader;
