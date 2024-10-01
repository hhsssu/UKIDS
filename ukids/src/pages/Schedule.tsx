import { Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';

import CalendarBox from '../components/feature/schedule/CalendarBox';
import ScheduleBox from '../components/feature/schedule/ScheduleBox';
import ScheduleList from '../components/feature/schedule/ScheduleList';
import ScheduleDetail from '../components/feature/schedule/ScheduleDetail';
import ScheduleCreate from '../components/feature/schedule/ScheduleCreate';
import ScheduleUpdate from '../components/feature/schedule/ScheduleUpdate';
import '../components/feature/schedule/schedule.css';

const Schedule = () => {
  const [scheduleId, setScheduleId] = useState<string>();

  useEffect(() => {
    // console.log('path: ', location.pathname);
    const segments = location.pathname.split('/').filter(Boolean);
    setScheduleId(segments[segments.length - 1]);
  }, []);

  return (
    <>
      <div className="half-feature-box p-[20px] schedule-page">
        <CalendarBox />
      </div>
      <div className="half-feature-box items-center p-[20px]">
        <Routes>
          <Route path="" element={<ScheduleBox />} />
          <Route path="list" element={<ScheduleList />} />
          <Route path="detail/:scheduleId" element={<ScheduleDetail />} />
          <Route path="new" element={<ScheduleCreate />} />
          <Route path="edit/:scheduleId" element={<ScheduleUpdate />} />
          {/* 주소창에 스케줄id 입력해서 진입한다고 했을 때, 현재 패밀리 아이디의 스케줄이 아니면 잘못된 접근이라고 해야함. */}
        </Routes>
      </div>
    </>
  );
};

export default Schedule;
