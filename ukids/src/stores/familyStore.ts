import { create } from 'zustand';
import api from '../util/api';

interface User {
  userId: number;
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
}

interface Family {
  familyId: number;
  name: string;
  code: string;
  representative: number;
  userFamilyDto: User;
}

interface Member {
  familyMemberId: number; // 가족 구성원의 ID
  role: string;
  userFamilyDto: User;
}

// 가족방 관련 상태 정의
interface FamilyState {
  family: Family;
  familyList: Family[];
  allFamilyList: Family[];
  applyFamilyList: Family[];
  member: Member[];
  pendingMember: Member[];
  error: string | null;
  // 가족방 정보
  fetchFamilyInfo: (familyId: number) => Promise<void>;
  // 가족방 생성
  createFamily: (name: string, password: string) => Promise<number>;
  // 가족방 찾기
  findFamily: (code: string) => Promise<void>;
  // 내가 속한 가족방 전체 리스트 조회
  fetchFamilyList: () => Promise<void>;
  // 가족방 수정
  updateFamily: (
    familyId: number,
    name: string,
    password: string,
    representative: number,
  ) => Promise<void>;
  // 가족방 비밀번호 확인
  checkedPassword: (familyId: number, password: string) => Promise<void>;
  // 가족방 삭제
  deleteFamily: (familyId: number, password: string) => Promise<void>;

  // 가족 id
  selectedFamilyId: number | null;
  setSelectedFamilyId: (familyId: number) => void;

  // 가족 선택 확인
  isFamilySelected: () => boolean;

  // 채팅방 id
  chatRoomId: number | null;

  // 승인 대기 리스트
  pendingMemberList: (familyId: number) => Promise<void>;

  // 가족 구성원 신청
  applyMember: (familyId: number) => Promise<void>;

  // 가족 구성원 승인
  approvedMember: (familyMemberId: number) => Promise<void>;

  // 가족 구성원 취소
  cancleMember: (familyMemberId: number) => Promise<void>;

  // 가족 구성원 거절
  decliedMember: (familyMemberId: number) => Promise<void>;

  // 가족 구성원 리스트
  fetchMemberList: (familyId: number) => Promise<void>;

  // 가족 역할 설정
  setMemberRole: (
    userId: number,
    familyRole: string,
    familyId: number,
  ) => Promise<void>;

  // 구성원 탈퇴
  deleteMember: (familyMemberId: number, type: boolean) => Promise<void>;
}

// familyStore 생성
export const useFamilyStore = create<FamilyState>((set) => ({
  // 초기 상태 설정
  family: {
    familyId: 0,
    name: '',
    code: '',
    representative: 0,
    userFamilyDto: {
      userId: 0,
      id: '',
      name: '',
      email: '',
      phone: '',
      birthDate: '',
    },
  },
  familyList: [],
  allFamilyList: [],
  member: [],
  applyFamilyList: [],
  pendingMember: [],
  error: null,
  selectedFamilyId: Number(localStorage.getItem('selectedFamilyId')) || null,
  chatRoomId: null,

  setSelectedFamilyId: (familyId: number) => {
    localStorage.setItem('selectedFamilyId', String(familyId));
    set({ selectedFamilyId: familyId });
  },

  // 가족 선택 확인하기
  isFamilySelected: () => {
    const familyId = localStorage.getItem('selectedFamilyId');
    return familyId !== null;
  },

  // 가족방 정보 가져오기
  fetchFamilyInfo: async (familyId: number) => {
    try {
      const response = await api.get(`/family/${familyId}`);
      const familyData: Family = response.data.result;
      set({
        family: familyData,
        error: null,
        selectedFamilyId: familyData.familyId,
      });
    } catch (error: any) {
      console.error('Error fetching family info', error);
      set({ error: error.message });
    }
  },

  // 가족방 생성
  createFamily: async (name: string, password: string): Promise<number> => {
    try {
      const response = await api.post(`/family`, { name, password });
      const newFamily: Family = response.data.result;
      // console.log('newFamily.familyId : ' + newFamily.familyId);
      set({
        family: newFamily,
        error: null,
        selectedFamilyId: newFamily.familyId,
      });

      // 가족방 생성 시 나무 자동 생성
      await api.post(`/tree`, { familyId: newFamily.familyId });
      // 대화방 생성
      const chatRoomResponse = await api.post(`/chat/room`, {
        familyId: newFamily.familyId,
      });
      // 채팅방 ID 추출
      const chatRoomId = chatRoomResponse.data.chatRoomId;
      // 채팅방 ID 상태에 저장
      set({ chatRoomId });

      // webRTC 세션 생성
      await api.post(`/webrtc?familyId=${newFamily.familyId}`);
      return chatRoomId;
    } catch (error: any) {
      console.error('Error creating family', error);
      set({ error: error.message });
      return 0;
    }
  },

  // 가족방 찾기
  findFamily: async (code: string) => {
    try {
      const response = await api.get(`/family/search/${code}`);
      const familyData: Family = response.data.result;
      set({
        family: familyData,
        error: null,
        selectedFamilyId: familyData.familyId,
      });
    } catch (error: any) {
      console.error('Error finding family', error);
      set({ error: error.message });
    }
  },

  // 내가 속한 가족방 전체 리스트 조회
  fetchFamilyList: async () => {
    try {
      const response = await api.get(`/family/all`);
      const familyList: Family[] = response.data.result;
      set({ familyList: familyList, error: null });
    } catch (error: any) {
      console.error('Error fetching family list', error);
      set({ error: error.message });
    }
  },

  // 가족방 수정
  updateFamily: async (
    familyId: number,
    name: string,
    password: string,
    representative: number,
  ) => {
    try {
      const response = await api.put(`/family`, {
        familyId,
        name,
        password,
        representative,
      });
      const updatedFamily = response.data.result;

      set((state) => ({
        family:
          state.family?.familyId === familyId ? updatedFamily : state.family,
        error: null,
      }));

      if (response.data.code === 201) {
        alert('가족방 정보가 수정되었습니다.');
      } else {
        alert('가족방 정보 수정에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('Error updating family', error);
      set({ error: error.message });
      alert('대표자만 수정이 가능합니다.');
    }
  },

  // 가족방 비밀번호 확인
  checkedPassword: async (familyId: number, password: string) => {
    try {
      const response = await api.post(`/family/pwcheck`, {
        familyId,
        password,
      });
      if (response.data.code !== 201) {
        alert('비밀번호가 일치하지 않습니다.');
      }
    } catch (error: any) {
      console.error('Error checking family password', error);
      set({ error: error.message });
    }
  },

  // 가족방 삭제
  deleteFamily: async (familyId: number, password: string) => {
    try {
      const response = await api.delete(`/family`, {
        data: {
          familyId,
          password,
        },
      });
      if (response.data.code === 200) {
        alert('가족방이 삭제되었습니다.');
        set((state) => ({
          familyList: state.familyList.filter(
            (fam) => fam.familyId !== familyId,
          ),
          error: null,
          selectedFamilyId:
            state.selectedFamilyId === familyId ? null : state.selectedFamilyId,
        }));
      }
    } catch (error: any) {
      console.error('Error deleting family', error);
      set({ error: error.message });
    }
  },

  // 승인 대기 리스트
  pendingMemberList: async (familyId: number) => {
    try {
      const response = await api.get(`member/approval/${familyId}`);
      const pendingMembers: Member[] = response.data.result;
      set({ pendingMember: pendingMembers, error: null });
    } catch (error: any) {
      console.error('Error fetching pending members', error);
      set({ error: error.message });
    }
  },

  // 가족 구성원 신청
  applyMember: async (familyId: number) => {
    try {
      const role = 'ROLE_NONE';
      const response = await api.post(`/member`, { familyId, role });
      if (response.data.code === 201) {
        // alert('가족 구성원 신청이 성공적으로 완료되었습니다.')
      }
    } catch (error: any) {
      console.error('Error applying for family membership', error);
      set({ error: error.message });
    }
  },

  // 가족 구성원 승인
  approvedMember: async (familyMemberId: number) => {
    try {
      const response = await api.put(`/member/${familyMemberId}`);
      if (response.data.code === 201) {
        // alert('구성원이 승인되었습니다.');
      }
    } catch (error: any) {
      console.error('Error approving family member', error);
      set({ error: error.message });
    }
  },

  // 가족 구성원 취소
  cancleMember: async (familyMemberId: number) => {
    try {
      const response = await api.delete(
        `/member/cancellation/${familyMemberId}`,
      );
      if (response.data.code === 201) {
        // alert('구성원 신청이 취소되었습니다.');
      }
    } catch (error: any) {
      console.error('Error approving family member', error);
      set({ error: error.message });
    }
  },

  // 가족 구성원 거절
  decliedMember: async (familyMemberId: number) => {
    try {
      const response = await api.delete(`/member/denial/${familyMemberId}`);
      if (response.data.code === 200) {
        // alert('구성원 신청이 거절되었습니다.');
      }
    } catch (error: any) {
      console.error('Error approving family member', error);
      set({ error: error.message });
    }
  },

  // 가족 구성원 리스트
  fetchMemberList: async (familyId: number) => {
    try {
      const response = await api.get(`/member/${familyId}`);
      const famMemberList: Member[] = response.data.result;
      set({ member: famMemberList, error: null });
    } catch (error: any) {
      console.error('Error approving family member', error);
      set({ error: error.message });
    }
  },

  // 가족 역할 설정
  setMemberRole: async (
    userId: number,
    familyRole: string,
    familyId: number,
  ) => {
    try {
      const response = await api.put(`/member/role`, {
        userId,
        familyRole,
        familyId,
      });
      if (response.data.code === 201) {
        alert('역할 설정이 완료되었습니다.');
      }
    } catch (error: any) {
      console.error('Error approving family member', error);
      set({ error: error.message });
    }
  },

  // 구성원 탈퇴
  deleteMember: async (familyMemberId: number, type: boolean) => {
    try {
      const response = await api.delete(`/member`, {
        data: {
          familyMemberId,
          type,
        },
      });
      if (response.data.code === 201) {
        // alert('탈퇴가 완료되었습니다.');
      }
    } catch (error: any) {
      console.error('Error approving family member', error);
      set({ error: error.message });
    }
  },
}));
