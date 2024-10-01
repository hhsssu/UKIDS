import { create } from 'zustand';
import api from '@/util/api';
import ScheduleDetail from '../components/feature/schedule/ScheduleDetail';

interface Store {
  events: Event[];
  setEvents: (
    scheduleShortList: ScheduleShort[] | undefined,
    familyName: string,
  ) => void;
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
  scheduleDetail: ScheduleDetail | null;
  setScheduleDetail: (scheduleId: number) => Promise<void>;
  monthScheduleList: MonthScheduleList | null;
  setMonthScheduleList: (month: number, familyId: number) => Promise<void>;
  dateScheduleList: DateScheduleList | null;
  setDateScheduleList: (date: string, familyId: number) => Promise<void>;
}

interface Event {
  id: string;
  title: string;
  allDay: boolean;
  start: string;
  end?: string;
  color: string;
  textColor: string;
  extendedProps: {
    place?: string;
    family: string;
  };
}

interface ScheduleDetail {
  scheduleId: number;
  title: string;
  content: string;
  place: string;
  startTime: string;
  endTime: string;
  familyId: number;
  familyName: string;
}

interface ScheduleShort {
  scheduleId: number;
  title: string;
  place: string;
  startTime: string;
  endTime: string;
}

interface MonthScheduleList {
  month: number;
  scheduleList: ScheduleShort[];
  familyId: number;
  familyName: string;
}

interface DateScheduleList {
  date: string;
  scheduleList: ScheduleShort[];
  familyId: number;
  familyName: string;
}

export const useScheduleStore = create<Store>((set, get) => ({
  events: [],
  setEvents: (
    scheduleShortList: ScheduleShort[] | undefined,
    familyName: string,
  ) => {
    if (!scheduleShortList) {
      return;
    }
    const events: Event[] = scheduleShortList.map((schedule) => ({
      id: String(schedule.scheduleId),
      title: schedule.title,
      start: schedule.startTime.split('T')[0],
      end: schedule.endTime.split('T')[0],
      color: '#3788d8',
      textColor: '#ffffff',
      extendedProps: {
        place: schedule.place,
        family: familyName,
      },
    }));

    set({ events });
  },
  selectedDate: null,
  setSelectedDate: (date) => set({ selectedDate: date }),
  // eventData: null,
  // setEventData: (events) => set({ eventData: events }),
  scheduleDetail: null,
  setScheduleDetail: async (scheduleId: number) => {
    if (scheduleId) {
      const { data } = await api.get(`/schedule/${scheduleId}`);
      const scheduleDetail: ScheduleDetail = {
        scheduleId: data.result.scheduleId,
        title: data.result.title,
        content: data.result.content,
        place: data.result.place,
        startTime: data.result.startTime,
        endTime: data.result.endTime,
        familyId: data.result.family.familyId,
        familyName: data.result.family.familyName,
      };

      set({ scheduleDetail });
    }
  },
  monthScheduleList: null,
  setMonthScheduleList: async (month: number, familyId: number) => {
    if (month != null && familyId != null) {
      const { data } = await api.get(
        `/schedule/month/${familyId}?month=${month}`,
      );
      const monthScheduleList: MonthScheduleList = {
        scheduleList: data.result.scheduleList,
        familyId: data.result.family.familyId,
        familyName: data.result.family.familyName,
        month: month,
      };
      set({ monthScheduleList });
    }
  },
  dateScheduleList: null,
  setDateScheduleList: async (date: string, familyId: number) => {
    if (date != null && familyId != null) {
      const { data } = await api.get(`/schedule/date/${familyId}?date=${date}`);
      const dateScheduleList: DateScheduleList = {
        scheduleList: data.result.scheduleList,
        familyId: data.result.family.familyId,
        familyName: data.result.family.familyName,
        date: date,
      };
      set({ dateScheduleList });
    }
  },
}));
