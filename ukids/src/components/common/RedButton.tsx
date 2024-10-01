// 가족해체(red, big) 등 부정
import { useNavigate } from 'react-router-dom';
import './button.css';

interface RedButtonProps {
  name: string;
  path: string;
  className?: string;
  type?: string;
  onClick?: () => void;
}

const RedButton = (props: RedButtonProps) => {
  const nav = useNavigate();

  const handleClick = () => {
    nav(props.path);
  };

  return (
    <button onClick={handleClick} className="common-btn red-btn">
      {props.name}
    </button>
  );
};

export default RedButton;
