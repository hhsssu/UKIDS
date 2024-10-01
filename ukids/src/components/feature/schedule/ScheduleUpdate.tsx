import BlueButton from '@/components/common/BlueButton';
import WhiteButton from '@/components/common/WhiteButton';
import api from '@/util/api';
import { useScheduleStore } from '@/stores/scheduleStore';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UpdateScheduleForm {
  title: string;
  content: string;
  place: string;
  startTime: string;
  endTime: string;
}

const ScheduleUpdate = () => {
  const { scheduleDetail, setScheduleDetail } = useScheduleStore();
  const nav = useNavigate();
  const [updateForm, setUpdateForm] = useState<UpdateScheduleForm>({
    title: scheduleDetail.title,
    content: scheduleDetail.content,
    place: scheduleDetail.place,
    startTime: scheduleDetail.startTime,
    endTime: scheduleDetail.endTime,
  });
  const callUpdateSchedule = async () => {
    // console.log('update : ', updateForm);
    if (!updateForm.title || !updateForm.startTime || !updateForm.endTime) {
      alert('제목과 날짜를 입력해주세요.');
      return;
    }
    const { data } = await api.put('/schedule', {
      scheduleId: scheduleDetail.scheduleId,
      title: updateForm.title,
      content: updateForm.content,
      place: updateForm.place,
      startTime: updateForm.startTime,
      endTime: updateForm.endTime,
      familyId: scheduleDetail.familyId,
    });
    if (data.code == 201) {
      alert('일정 수정 성공');
      nav('/schedule/list');
      return;
    }
    alert('일정 수정 실패, 재시도해주세요.');
  };

  return (
    <div>
      <section className="flex justify-between">
        <WhiteButton name="목록" path="/schedule/list" />
        <BlueButton
          name="등록"
          onClick={callUpdateSchedule}
          path="/schedule/list"
        />
      </section>
      <section className="px-5 content-center">
        <div className="mt-3" style={{ borderBottom: '1px solid #ccc' }}>
          <label htmlFor="title">제목</label>
          <input
            id="title"
            type="text"
            value={updateForm.title}
            required
            placeholder="제목"
            className="p-2"
            onChange={(e) =>
              setUpdateForm({ ...updateForm, title: e.target.value })
            }
          />
        </div>
        <div className="mt-3" style={{ borderBottom: '1px solid #ccc' }}>
          <label htmlFor="place">장소</label>
          <input
            id="place"
            type="text"
            value={updateForm.place}
            placeholder="장소"
            className="p-2"
            onChange={(e) =>
              setUpdateForm({ ...updateForm, place: e.target.value })
            }
          />
        </div>
        <div className="mt-3" style={{ borderBottom: '1px solid #ccc' }}>
          <label htmlFor="date">시작 날짜</label>
          <input
            id="date"
            type="datetime-local"
            value={updateForm.startTime}
            placeholder="시작 날짜"
            required
            className="p-2"
            max={updateForm.endTime}
            onChange={(e) =>
              setUpdateForm({
                ...updateForm,
                startTime: e.target.value,
              })
            }
          />
        </div>
        <div className="mt-3" style={{ borderBottom: '1px solid #ccc' }}>
          <label htmlFor="date">종료 날짜</label>
          <input
            id="date"
            type="datetime-local"
            value={updateForm.endTime}
            placeholder="종료 날짜"
            required
            className="p-2"
            min={updateForm.startTime}
            onChange={(e) =>
              setUpdateForm({
                ...updateForm,
                endTime: e.target.value,
              })
            }
          />
        </div>
        <div className="mt-3" style={{ borderBottom: '1px solid #ccc' }}>
          <label htmlFor="alert">메모</label>
          <input
            id="content"
            type="text"
            value={updateForm.content}
            placeholder="메모할 내용을 입력하세요"
            className="p-2"
            onChange={(e) =>
              setUpdateForm({ ...updateForm, content: e.target.value })
            }
          />
        </div>
      </section>
    </div>
  );
};
export default ScheduleUpdate;
