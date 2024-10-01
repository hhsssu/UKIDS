import { useNavigate } from 'react-router-dom';
import './gamepart.css';

interface GameButtonProps {
  name: string;
  path: string;
}

const CallMyNameButton = ({ name, path }: GameButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(path);
  };

  const nameArray = ['돌아가기', '준비 취소', '초기화'];

  const checkGray = () => {
    for (let i = 0; i < nameArray.length; i++) {
      if (nameArray[i] == name) {
        return true;
      }
    }
    return false;
  };

  return (
    <button
      onClick={handleClick}
      className={`rounded-full ${
        checkGray() ? 'game-btn-g' : 'game-btn-callmyname'
      } game-btn-common`}
    >
      {name}
    </button>
  );
};

export default CallMyNameButton;
