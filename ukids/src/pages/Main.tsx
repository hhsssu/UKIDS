// Main.tsx

import { useNavigate } from 'react-router-dom';
import { useFamilyStore } from '@/stores/familyStore';
import LetterBox from '../components/feature/letter/LetterBox';
import FamilyTree from '../components/feature/family/FamilyTree';
import CalendarBox from '../components/feature/schedule/CalendarBox';
// import { useScheduleStore } from '../stores/scheduleStore';

const Main = () => {
  const nav = useNavigate();
  const { isFamilySelected } = useFamilyStore();
  // const { setSelectedDate } = useScheduleStore();

  const handleNavigation = (path: string) => {
    if (isFamilySelected()) {
      nav(path);
    } else {
      alert('가족방이 선택되지 않았습니다. 페이지 이동이 불가능합니다.');
      nav('/family');
    }
  };

  const onClickScheduleBox = () => {
    // 오늘 날짜로 넘어감
    // const today = new Date();
    // const formattedToday = `${today.getFullYear()}년 ${
    //   today.getMonth() + 1
    // }월 ${today.getDate()}일`;
    // setSelectedDate(formattedToday);
    handleNavigation('/schedule');
  };

  return (
    <>
      {/* 나무 부분 */}
      <section className="w-[470px] h-[576px] p-[15px] relative">
        <FamilyTree />
      </section>
      {/* 캘린더 & 편지함 부분 */}
      <section className="w-[409px]">
        <div className="main-page common-feature-box mb-[19px] p-[15px] h-[404px]">
          <CalendarBox onDateClick={onClickScheduleBox} height="374px" />
        </div>
        <div className="common-feature-box h-[153px] p-[15px]"
          onClick={() => handleNavigation('/letters')}
          style={{cursor: 'pointer'}}
        >
          <LetterBox path="/letters" />
        </div>
      </section>
    </>
  );
};

export default Main;
