import { useEffect } from 'react';
import { useScheduleStore } from '@/stores/scheduleStore';
import { useNavigate } from 'react-router-dom';
import WhiteButton from '../../common/WhiteButton';
import '../../common/common.css';
import { useFamilyStore } from '@/stores/familyStore.ts';

const ScheduleList = () => {
  const { selectedFamilyId } = useFamilyStore();

  const {
    selectedDate,
    setSelectedDate,
    dateScheduleList,
    setDateScheduleList,
    setScheduleDetail,
  } = useScheduleStore();
  const nav = useNavigate();
  const onClickCreateButton = () => {
    // 스케줄 등록 페이지로 이동
    nav('/schedule/new');
  };
  const onClickDetail = (scheduleId: number) => {
    // console.log('list schedule id : ', scheduleId);
    if (scheduleId) {
      nav(`/schedule/detail/${scheduleId}`);
    }
  };

  useEffect(() => {
    setDateScheduleList(selectedDate, selectedFamilyId);
    // console.log('date schedule : ', dateScheduleList);
  }, [selectedFamilyId, setSelectedDate, setDateScheduleList]);

  return (
    <div className="schedule-box">
      <section className="flex justify-between">
        <WhiteButton name="이전" path="/schedule" />
        <button className="plus-btn" onClick={onClickCreateButton}>
          +
        </button>
      </section>
      {selectedDate && (
        <div className="schedule-list">
          <p className="title-style mt-3 mb-3">{selectedDate}</p>{' '}
          {dateScheduleList && dateScheduleList.scheduleList ? (
            dateScheduleList.scheduleList.map((value, index) => (
              <div
                key={index}
                style={{ margin: '15px 5px', cursor: 'pointer' }}
                onClick={() => onClickDetail(value.scheduleId)}
              >
                <p style={{ fontWeight: '600' }}>
                  <div
                    className="circle-color"
                    style={{ marginRight: '10px' }}
                  ></div>
                  {value.title}
                </p>
                {value.place && (
                  <p style={{ marginLeft: '20px' }}>장소 : {value.place}</p>
                )}
                <p style={{ marginLeft: '20px' }}>
                  시작 일시 : {value.startTime.split('T').join(' ')}
                </p>
                <p style={{ marginLeft: '20px' }}>
                  종료 일시 : {value.endTime.split('T').join(' ')}
                </p>
              </div>
            ))
          ) : (
            <p className="mt-2" style={{ color: '#999' }}>
              해당 날짜에 일정이 없습니다.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ScheduleList;
