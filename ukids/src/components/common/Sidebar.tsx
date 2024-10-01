import { useNavigate } from 'react-router-dom';
import { useFamilyStore } from '@/stores/familyStore';
import album from '../../assets/album.png';
import paint from '../../assets/painting.png';
import growth from '../../assets/growth.png';
import chat from '../../assets/chat.png';
import game from '../../assets/game.png';

const Sidebar = () => {
  const nav = useNavigate();
  const { isFamilySelected } = useFamilyStore();

  const handleNavigation = (path: string) => {
    if (isFamilySelected()) {
      nav(path);
    } else {
      alert('가족방이 선택되지 않았습니다. 페이지 이동이 불가능합니다.');
      nav('/family');
    }
  };

  return (
    <div className="sidebar">
      <div
        className="cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110"
        onClick={() => handleNavigation('/albums')}
      >
        <img width="97" height="91" src={album} alt="사진 앨범" />
        <div className="sidebar-text">사진 앨범</div>
      </div>
      <div
        className="cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110"
        onClick={() => handleNavigation('/paintdiary')}
      >
        <img width="71" height="97" src={paint} alt="그림 일기" />
        <div className="sidebar-text">그림 일기</div>
      </div>
      <div
        className="cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110"
        onClick={() => handleNavigation('/growthfolder')}
      >
        <img width="70" height="95" src={growth} alt="성장 일지" />
        <div className="sidebar-text">성장 일지</div>
      </div>
      <div
        className="cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110"
        onClick={() => handleNavigation('/chat')}
      >
        <img width="73" height="78" src={chat} alt="대화방" />
        <div className="sidebar-text">대화방</div>
      </div>
      <div
        className="cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110"
        onClick={() => handleNavigation('/game')}
      >
        <img width="68" height="99" src={game} alt="게임" />
        <div className="sidebar-text">게임</div>
      </div>
    </div>
  );
};

export default Sidebar;
