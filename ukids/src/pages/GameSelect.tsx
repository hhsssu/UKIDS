import { useNavigate } from 'react-router-dom';
import quizImg from '../assets/game_quiz.png';
import callmynameImg from '../assets/game_callmyname.png';

const Game = () => {
  const nav = useNavigate();
  const onQuizClick = () => {
    nav('/quiz');
  };
  const onCallMyNameClick = () => {
    nav('/callmyname');
  };

  return (
    <div className="w-full flex justify-center">
      <button onClick={onQuizClick}>
        <img
          src={quizImg}
          alt="QuizButton"
          className="hover:border-solid border-8 border-[#FFBF33]"
        />
      </button>
      {/* <button onClick={onCallMyNameClick}>
        <img
          src={callmynameImg}
          alt="CallMyNameButton"
          className="half-feature-box hover:border-solid border-8 border-[#9F6AD5]"
        />
      </button> */}
    </div>
  );
};

export default Game;
