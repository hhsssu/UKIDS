// ScheduleCreate.tsx 일정 등록
import BlueButton from '@/components/common/BlueButton';
import WhiteButton from '@/components/common/WhiteButton';
import api from '@/util/api';
import { useFamilyStore } from '@/stores/familyStore.ts';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CreateScheduleForm {
  title: string;
  content: string;
  place: string;
  startTime: string;
  endTime: string;
}

const ScheduleCreate = () => {
  const { selectedFamilyId } = useFamilyStore();
  const nav = useNavigate();

  const [createForm, setCreateForm] = useState<CreateScheduleForm>({
    title: '',
    content: '',
    place: '',
    startTime: '',
    endTime: '',
  });

  const callCreateSchedule = async () => {
    // console.log('create schedule : ', createForm);
    if (!createForm.title || !createForm.startTime || !createForm.endTime) {
      alert('제목과 날짜를 입력해주세요.');
      return;
    }
    const { data } = await api.post('/schedule', {
      title: createForm.title,
      content: createForm.content,
      place: createForm.place,
      startTime: createForm.startTime,
      endTime: createForm.endTime,
      familyId: selectedFamilyId,
    });
    // console.log('post : ', data);
    if (data.code == 201) {
      alert('일정 등록 성공');
      nav('/schedule/list');
      return;
    }
    alert('일정 등록 실패, 재시도해주세요.');
  };

  return (
    <div>
      <section className="flex justify-between">
        <WhiteButton name="목록" path="/schedule/list" />
        <BlueButton
          name="등록"
          onClick={callCreateSchedule}
          path="/schedule/list"
        />
      </section>
      <section className="px-5 content-center">
        <div className="mt-3" style={{ borderBottom: '1px solid #ccc' }}>
          <label htmlFor="title">제목</label>
          <input
            id="title"
            type="text"
            value={createForm.title}
            required
            placeholder="제목을 입력하세요"
            className="p-2"
            style={{
              width: '300px',
              fontFamily: 'Pretendard',
              fontWeight: '400',
              fontSize: '1rem',
              border: 'none',
            }}
            onChange={(e) =>
              setCreateForm({ ...createForm, title: e.target.value })
            }
          />
        </div>
        <div className="mt-3" style={{ borderBottom: '1px solid #ccc' }}>
          <label htmlFor="place">장소</label>
          <input
            id="place"
            type="text"
            value={createForm.place}
            placeholder="장소를 입력하세요"
            className="p-2"
            style={{
              textAlign: 'center',
              width: '300px',
              padding: '10px',
              marginLeft: '20px',
            }}
            onChange={(e) =>
              setCreateForm({ ...createForm, place: e.target.value })
            }
          />
        </div>
        <div className="mt-3" style={{ borderBottom: '1px solid #ccc' }}>
          <label htmlFor="date">시작 날짜</label>
          <input
            id="date"
            type="datetime-local"
            value={createForm.startTime}
            placeholder="시작 날짜"
            className="p-2"
            required
            max={createForm.endTime}
            onChange={(e) =>
              setCreateForm({
                ...createForm,
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
            defaultValue={createForm.startTime}
            value={createForm.endTime}
            placeholder="종료 날짜"
            required
            className="p-2"
            min={createForm.startTime}
            onChange={(e) =>
              setCreateForm({
                ...createForm,
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
            value={createForm.content}
            placeholder="메모할 내용을 입력하세요"
            className="p-2"
            style={{ textAlign: 'center', width: '300px', marginLeft: '20px' }}
            onChange={(e) =>
              setCreateForm({ ...createForm, content: e.target.value })
            }
          />
        </div>
      </section>
    </div>
  );
};
export default ScheduleCreate;
