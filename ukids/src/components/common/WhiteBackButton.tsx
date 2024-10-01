import { useNavigate } from 'react-router-dom';

interface BtnProps {
  path: string;
}

const WhiteBackButton = ({ path }: BtnProps) => {
  const nav = useNavigate();
  const onClick = () => {
    nav(path);
  };

  return (
    <button
      className="game-white-btn text-[#777777] font-medium text-sm"
      onClick={onClick}
    >
      {`< 이전`}
    </button>
  );
};

export default WhiteBackButton;
