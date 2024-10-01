import { useScheduleStore } from '../../../stores/scheduleStore';
import { useNavigate } from 'react-router-dom';
import '../../common/common.css';
import { useFamilyStore } from '@/stores/familyStore.ts';
import { useEffect } from 'react';
import plus from '@/assets/plus.png';

const ScheduleBox = () => {
  const {
    selectedDate,
    setSelectedDate,
    setDateScheduleList,
    dateScheduleList,
  } = useScheduleStore();
  const nav = useNavigate();
  const onClickAlbumButton = () => {
    // 앨범 페이지로 이동
    nav('/albums');
  };
  const onClickPaintButton = () => {
    // 그림일기 페이지로 이동
    nav('/paintdiary');
  };

  const onClickScheduleListButton = () => {
    //  일정 리스트 조회 페이지로 이동
    nav('/schedule/list');
  };

  const { selectedFamilyId } = useFamilyStore();

  useEffect(() => {
    if (selectedDate && selectedFamilyId) {
      setDateScheduleList(selectedDate, selectedFamilyId);
      // console.log('date schedule : ', dateScheduleList);
    }
  }, [selectedFamilyId, setDateScheduleList, setSelectedDate]);

  return (
    <>
      <h1 className="title-style">{selectedDate}</h1>
      <section className="flex justify-between mt-8">
        <button className="half-pre-box" onClick={onClickAlbumButton}>
          <div className="title-style">앨범</div>
          <div className="flex justify-center">
            <img src={plus} alt="앨범 이미지" crossOrigin="anonymous" />
          </div>
        </button>
        <button className="half-pre-box" onClick={onClickPaintButton}>
          <div className="title-style">그림일기</div>
          <div className="flex justify-center">
            <img src={plus} alt="그림일기 이미지" crossOrigin="anonymous" />
          </div>
        </button>
      </section>
      <section className="pre-box mt-8 p-5">
        <div className="flex justify-between mb-1">
          <div className="title-style">일정</div>
          <button
            style={{ marginRight: '10px' }}
            onClick={onClickScheduleListButton}
          >
            더보기
          </button>
        </div>

        <div className="schedule-list">
          {selectedDate && dateScheduleList && dateScheduleList.scheduleList ? (
            dateScheduleList.scheduleList.map((value, index) => (
              <div key={index} style={{ margin: '5px' }}>
                <p style={{ fontWeight: '600' }}>
                  <div className="circle-color mr-2"></div>
                  {value.title}
                </p>
                {value.place && (
                  <p style={{ marginLeft: '18px' }}>장소: {value.place}</p>
                )}
                <hr />
              </div>
            ))
          ) : (
            <div>
              <p className="mt-2" style={{ color: '#999' }}>
                해당 날짜에 일정이 없습니다.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ScheduleBox;
