// 메인에 보여질 편지함 컴포넌트
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/util/api';
import { useFamilyStore } from '../../../stores/familyStore';

interface letterBoxProps {
  path: string;
}
const LetterBox = ({ path }: letterBoxProps) => {
  const nav = useNavigate();

  const handleClick = () => {
    nav(path);
  };

  const { selectedFamilyId } = useFamilyStore();

  const [openLetter, setOpenLetter] = useState(0);
  const [totalLetter, setTotalLetter] = useState(0);

  useEffect(() => {
    // 받은 편지 총 개수 가져오기
    api.get(`letter/receiveCount/${selectedFamilyId}`).then((response: any) => {
      setTotalLetter(response.data.result);
    });

    // 읽은 편지 총 개수 가져오기
    api.get(`letter/readCount/${selectedFamilyId}`).then((response: any) => {
      setOpenLetter(response.data.result);
    });
  }, []);

  return (
    <button type="button" className="w-[100%] h-[100%]">
      <div className="title-style">💕 편지함 ✉</div>
      <section>
        <div>📫 안 읽은 편지: {totalLetter - openLetter}통</div>
        <div>📬 받은 편지: {totalLetter}통</div>
      </section>
    </button>
  );
};

export default LetterBox;
