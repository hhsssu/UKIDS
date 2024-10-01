import { useNavigate } from 'react-router-dom';
import './button.css';

interface WhiteButtonProps {
  name: string;
  path: string;
  className?: string;
  type?: string;
  data?: any;
}

const WhiteButton = (props: WhiteButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log(props.data);
    navigate(props.path, {state: props.data});
  };

  if (props.name === '삭제') {
    return (
      <button onClick={handleClick} className="red-font white-btn common-btn">
        {props.name}
      </button>
    );
  } else {
    return (
      <button onClick={handleClick} className="list-btn common-btn gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="11"
          viewBox="0 0 8 14"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.03592 7L8 12.8335L6.80735 14L0.246953 7.58326C0.0888289 7.42856 0 7.21876 0 7C0 6.78124 0.0888289 6.57144 0.246953 6.41673L6.80735 0L8 1.16653L2.03592 7Z"
            fill="#777777"
          />
        </svg>
        {props.name}
      </button>
    );
  }
};

export default WhiteButton;
