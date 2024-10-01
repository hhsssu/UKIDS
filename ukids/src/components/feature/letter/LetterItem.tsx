import openLetterImg from '@/assets/openLetter.png';
import letterImg from '@/assets/letterImg.png';
import sendLetter from '@/assets/sendLetter.png';
import '@components/feature/letter/letter.css';

interface Letter {
  letterId: number;
  content: string;
  createDate: string;
  familyName: string;
  fromUsername: string;
  toUsername: string;
  read: boolean;
}

interface LetterProps {
  letter: Letter;
  state: boolean;
}

export const LetterItem = ({ letter, state }: LetterProps) => {
  const letterImgTag = () => {
    if (!state) {
      if (!letter.read) {
        return (
          <div>
            <img className="letterImg" src={letterImg} alt="" />
          </div>
        );
      } else {
        return (
          <div>
            <img className="letterReadImg" src={openLetterImg} alt="" />
          </div>
        );
      }
    } else {
      return <img className="letterImg" src={sendLetter} alt="" />;
    }
  };

  const letterState = () => {
    if (!state) {
      return <div>From. {letter.fromUsername}</div>;
    } else {
      return <div>To. {letter.toUsername}</div>;
    }
  };

  return (
    <div>
      {letterImgTag()}
      <div>{letter.createDate}</div>
      {letterState()}
    </div>
  );
};
