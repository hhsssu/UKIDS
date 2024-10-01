// ScheduleDetail.tsx 일정 상세 컴포넌트
import WhiteButton from '../../common/WhiteButton';
import GrayButton from '../../common/GrayButton';
import { useScheduleStore } from '@/stores/scheduleStore';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import trash from '@/assets/trash.png';
import api from '@/util/api';

const ScheduleDetail = () => {
  const { scheduleId } = useParams();
  const { scheduleDetail, setScheduleDetail } = useScheduleStore();
  const nav = useNavigate();

  useEffect(() => {
    // console.log('schedule detail id : ', scheduleId);
    if (scheduleId) setScheduleDetail(scheduleId);
    // console.log('get schedules : ', scheduleDetail);
  }, [scheduleId]);

  const deleteSchedule = async () => {
    if (!scheduleId) return;
    const { data } = await api.delete(`/schedule/${scheduleId}`);
    // console.log('일정 삭제 : ', data);
    if (data.code == 200) {
      alert('일정 삭제 성공');
      nav('/schedule/list');
      return;
    }
    alert('일정 삭제 실패');
  };

  return (
    <>
      {scheduleDetail && (
        <div>
          <section className="flex justify-between">
            <WhiteButton name="목록" path="/schedule/list" />
            <GrayButton name="수정" path={`/schedule/edit/${scheduleId}`} />
          </section>
          <section className="px-5 content-center">
            <div className="mt-3" style={{ borderBottom: '1px solid #ccc' }}>
              <label>제목</label>
              <p className="p-2">{scheduleDetail.title}</p>
            </div>
            <div className="mt-3" style={{ borderBottom: '1px solid #ccc' }}>
              <label>장소</label>
              <p className="p-2">{scheduleDetail.place}</p>
            </div>
            <div className="mt-3" style={{ borderBottom: '1px solid #ccc' }}>
              <label>시작 일시</label>
              <p className="p-2">
                {scheduleDetail.startTime.split('T').join(' ')}
              </p>
            </div>
            <div className="mt-3" style={{ borderBottom: '1px solid #ccc' }}>
              <label>종료 일시</label>
              <p className="p-2">
                {scheduleDetail.endTime.split('T').join(' ')}
              </p>
            </div>
            <div className="mt-3" style={{ borderBottom: '1px solid #ccc' }}>
              <label>메모</label>
              <p className="p-2">{scheduleDetail.content}</p>
            </div>
          </section>
          <section className="flex justify-center">
            <img
              src={trash}
              alt="삭제"
              style={{ width: '40px', cursor: 'pointer', marginTop: '120px' }}
              onClick={() => deleteSchedule()}
            />
          </section>
        </div>
      )}
    </>
  );
};
export default ScheduleDetail;
