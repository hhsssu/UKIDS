import FullCalendar from '@fullcalendar/react'; // FullCalendar React component
import dayGridPlugin from '@fullcalendar/daygrid'; // DayGrid 플러그인 (달력에 날짜를 표시하는 데 사용)
import interactionPlugin from '@fullcalendar/interaction'; // 상호작용 플러그인 (클릭 등의 이벤트 처리를 위해 필요)
import koLocale from '@fullcalendar/core/locales/ko'; // 한국어 로케일 (날짜 형식 및 텍스트를 한국어로 표시)
import { DateClickArg } from '@fullcalendar/interaction'; // DateClickArg 타입 (날짜 클릭 이벤트의 정보 타입)
import { useScheduleStore } from '../../../stores/scheduleStore';
import { useFamilyStore } from '@/stores/familyStore.ts';
// zustand를 사용한 상태 관리 store
import { useEffect, useRef, useState } from 'react'; // React의 useEffect 훅
import './schedule.css'; // CSS 스타일 파일
import { useNavigate } from 'react-router-dom';

interface CalendarBoxProps {
  onDateClick?: () => void;
  height?: string;
}

export default function CalendarBox({
  onDateClick,
  height = '550px',
}: CalendarBoxProps) {
  // zustand store에서 상태와 상태 업데이트 함수 가져오기
  const {
    selectedDate,
    setSelectedDate,
    monthScheduleList,
    setMonthScheduleList,
    setDateScheduleList,
    events,
    setEvents,
  } = useScheduleStore();
  const { selectedFamilyId } = useFamilyStore();
  const nav = useNavigate();
  const [month, setMonth] = useState<string>();

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };
  useEffect(() => {
    // 컴포넌트가 마운트될 때 호출되는 비동기 함수
    const fetchEvents = async () => {
      try {
        // 오늘 날짜 설정
        const today = new Date();
        const formattedDate = formatDate(today);
        setSelectedDate(formattedDate);

        // console.log('today month : ', today.getMonth());
        setMonthScheduleList(today.getMonth() + 1, selectedFamilyId);
        setEvents(
          monthScheduleList?.scheduleList,
          monthScheduleList?.familyName,
        );
      } catch (error) {
        console.error('Error fetching events:', error); // 오류 처리
      }
    };

    fetchEvents(); // API 호출
  }, []);

  // 클릭한 날짜에 해당하는 이벤트를 찾아서 설정하는 함수
  const handleDateClick = (info: DateClickArg) => {
    const date = new Date(info.dateStr); // 클릭한 날짜를 문자열로 가져옴
    const formattedDate = formatDate(date);
    // console.log('click dates : ', formattedDate);
    // const formattedToday = formatDate(date); // 오늘 날짜 포맷팅
    setSelectedDate(formattedDate);

    // 클릭한 날짜에 해당하는 이벤트를 필터링
    setMonthScheduleList(date.getMonth() + 1, selectedFamilyId);
    setDateScheduleList(formattedDate, selectedFamilyId);
    setEvents(monthScheduleList?.scheduleList, monthScheduleList?.familyName);

    if (onDateClick) onDateClick();
  };

  const goCreateSchedule = () => {
    nav('/schedule/new');
  };

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]} // 사용할 플러그인 설정
        initialView="dayGridMonth" // 초기 뷰를 월간 뷰로 설정
        locale={koLocale} // 한국어 로케일 설정
        firstDay={0} // 주의 시작 요일을 일요일(0)로 설정
        weekends={true} // 주말을 표시
        fixedWeekCount={false} // 고정된 주 수를 사용하지 않음
        height={height} // 캘린더의 높이 설정 - 여기에서 height props 사용
        displayEventTime={true}
        customButtons={{
          createButton: {
            text: '일정 추가하기',
            click: function () {
              goCreateSchedule();
            },
          },
        }}
        selectable={true} // 날짜 선택 기능 활성화
        headerToolbar={{
          start: 'title', // 툴바의 시작 부분에 제목 표시
          end: 'today, prev, next', // 툴바의 끝 부분에 이전/다음 버튼 표시
        }}
        footerToolbar={{
          right: 'createButton',
        }}
        eventTextColor="#fff" // 이벤트 텍스트 색상 설정
        titleFormat={function (date) {
          const year = date.date.year;
          const month = date.date.month + 1; // 월은 0부터 시작하므로 +1
          return `${year}년 ${month}월`; // 제목 포맷 (예: 2024년 8월)
        }}
        dayCellContent={(arg) => {
          return arg.date.getDate().toString(); // 날짜 셀의 내용으로 날짜 숫자만 표시
        }}
        dateClick={handleDateClick} // 날짜 클릭 이벤트 핸들러
        events={events} // 캘린더에 표시할 이벤트 목록
      />
    </div>
  );
}
