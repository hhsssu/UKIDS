import { react } from '@vitejs/plugin-react';
import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';
import api from '../util/api';
import axios from 'axios';

interface User {
  userId: number;
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  birthDate: string;
}

interface AuthState {
  token: string | null;
  setToken: (token: string | null) => void;

  ukidsURL: string;
  error: string | null;

  // 로그인
  userLogin: (id: string, password: string) => Promise<void>;

  // 회원정보조회
  userInfo: User | null;
  getUserInfo: () => Promise<void>;
  repUserInfo: User | null;
  getRepUserInfo: (userId: number) => Promise<void>;

  // 회원가입
  joinUser: (form: {
    id: string;
    password: string;
    name: string;
    birthDate: string;
    email?: string;
    phone?: string;
    profileImage?: string;
  }) => Promise<void>;

  // 회원정보 수정
  updateUser: (form: {
    id: string;
    password: string;
    name: string;
    birthDate: string;
    email: string;
    phone: string;
    profileImage: string;
  }) => Promise<void>;

  // 비밀번호 확인(수정 페이지)
  checkPassword: (password: string) => Promise<void>;

  // 회원 탈퇴
  deleteUser: () => Promise<void>;

  // id 중복 검사
  checkedId: (id: string) => Promise<boolean>;

  // email 중복 검사
  checkedEmail: (email: string) => Promise<boolean>;

  // 전화번호 중복 검사
  checkedPhone: (phone: string) => Promise<void>;
}

// 자동 로그아웃 테스트
// localStorage.setItem(
//   'token',
//   'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsImlkIjoidXNlcjEiLCJuYW1lIjoi6rmA7Iu47ZS8IiwicGhvbmUiOiIwMTAtMTIxMi0xMjEyIiwiZW1haWwiOiJ3d3dAYXNzZGYuY29tIiwiaWF0IjoxNzIzMDgwMjUwLCJleHAiOjE3MjMwODM4NTB9.HRFEqm_i66m4JOa5yUEFlNHb7BQkuvV8mW_a-wnc2Sk',
// );
const ukidsURL = `https://i11b306.p.ssafy.io`;

export const useAuthStore = create<AuthState>((set, get) => ({
  // 초기 토큰 값: localStorage에서 불러옴
  token: localStorage.getItem('token'),

  // 토큰 설정 함수
  setToken: (token: string | null) => {
    // 상태 업데이트
    set({ token });

    // 토큰 담김
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  },

  // 기본 값들
  ukidsURL: ukidsURL,
  error: null,

  /***** 로그인 *****/
  userLogin: async (id, password) => {
    try {
      // 로그인 API 요청
      const response = await axios.post(`${ukidsURL}/api/user/login`, {
        id,
        password,
      });

      const { result } = response.data;
      const token = result;
      if (token) {
        const setToken = get().setToken;
        setToken(token); // 로그인 성공하여 토큰 저장
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`; // 새로운 토큰 설정
      } else {
        throw new Error('토큰이 응답에 포함되어 있지 않습니다.');
      }
    } catch (error) {
      console.error('로그인 실패:', error);
      throw new Error('로그인에 실패했습니다. 아이디와 비밀번호를 확인하세요.');
    }
  },

  /***** 회원 정보 관리 *****/
  userInfo: null,
  repUserInfo: null,

  // 회원정보 조회
  getUserInfo: async () => {
    // 현재 토큰 가져오기
    const setToken = get().setToken;
    try {
      const token = get().token;

      if (token) {
        // 토큰 디코딩
        const decodedToken: User = jwtDecode(token);
        const userId = decodedToken.userId; // 토큰에서 userId 추출
        // console.log('디코딩!!!!!!!!!!' + decodedToken + userId);
        const response = await api.get(`/user/${userId}`);
        const userData = response.data.result;

        set({ userInfo: userData });
      } else {
        throw new Error('토큰 없음');
      }
    } catch (error: any) {
      console.error('Error fetching user info', error);
      // 자동 로그아웃 처리
      localStorage.removeItem('token');
      setToken(null);
      alert('로그인한지 1시간이 경과되어 자동 로그아웃 됩니다.');
    }
  },

  getRepUserInfo: async (userId) => {
    try {
      const response = await api.get(`/user/${userId}`);
      const userData = response.data.result;

      set({ repUserInfo: userData });
      // console.log(response.data);
    } catch (error) {
      console.error('대표자 정보 가져오기 실패:', error);
    }
  },

  // 회원가입 API
  joinUser: async (form) => {
    try {
      const response = await api.post('/user/signup', {
        id: form.id,
        password: form.password,
        name: form.name,
        birthDate: form.birthDate,
        email: form.email,
        phone: form.phone,
        role: 'ROLE_USER',
      });

      if (response.data.code === 201) {
        // alert(response.data.result); // '회원 생성 완료' 메시지 표시
        alert('회원가입이 완료되었습니다!');
      }
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert('회원가입에 실패했습니다.' + error);
    }
  },

  // 회원정보 수정
  updateUser: async (form) => {
    try {
      const token = get().token;
      if (token) {
        const response = await api.put(
          '/user',
          {
            id: form.id,
            password: form.password,
            name: form.name,
            birthDate: form.birthDate,
            email: form.email,
            phone: form.phone,
            profileImage: form.profileImage,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.data.code === 201) {
          const newToken = response.data.result;
          get().setToken(newToken); // 토큰 재생성 및 설정
          alert('회원정보가 성공적으로 수정되었습니다.');
        }
      }
    } catch (error) {
      console.error('회원정보 수정 실패:', error);
      alert('회원정보 수정에 실패했습니다.');
    }
  },

  // 비밀번호 확인
  checkPassword: async (password: string): Promise<void> => {
    try {
      const token = get().token;
      if (token) {
        const response = await api.post(
          '/user/pwcheck',
          { password },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.data.result === '비밀번호 일치') {
          alert('비밀번호가 일치합니다.');
        } else {
          alert('비밀번호가 일치하지 않습니다.');
        }
      }
    } catch (error) {
      console.error('비밀번호 확인 실패:', error);
      // alert('비밀번호 확인에 실패했습니다.');
    }
  },

  // 회원 탈퇴
  deleteUser: async () => {
    try {
      const token = get().token;
      if (token) {
        const decodedToken: User = jwtDecode(token);
        const userId = decodedToken.userId;

        const response = await api.delete(`/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.code === 200) {
          alert('회원 탈퇴가 완료되었습니다. 이용해주셔서 감사합니다.');
          get().setToken(null); // 토큰 제거
        }
      }
    } catch (error) {
      console.error('회원 탈퇴 실패:', error);
      alert('회원 탈퇴에 실패했습니다.');
    }
  },

  // ID 중복 검사
  checkedId: async (id: string): Promise<boolean> => {
    try {
      const response = await api.get(`/user/id/${id}`);
      if (response.data.result === 'id 중복 없음') {
        return true;
      } else {
        // alert('이미 사용 중인 ID입니다.');
        return false;
      }
    } catch (error) {
      console.error('ID 중복 검사 실패:', error);
      return false;
    }
  },

  // 이메일 중복 검사
  checkedEmail: async (email: string): Promise<boolean> => {
    try {
      const response = await api.get(`/user/email?email=${email}`);
      if (response.data.result === 'email 중복 없음') {
        // alert('사용 가능한 이메일입니다.');
        return true;
      } else {
        // alert('이미 사용 중인 이메일입니다.');
        return false;
      }
    } catch (error) {
      console.error('이메일 중복 검사 실패:', error);
      return false;
    }
  },

  // 전화번호 중복 검사
  checkedPhone: async (phone: string): Promise<boolean> => {
    try {
      const response = await api.get(`/user/phone?phone=${phone}`);
      if (response.data.result === 'phone 중복 없음') {
        // alert('사용 가능한 전화번호입니다.');
        return true;
      } else {
        // alert('이미 사용 중인 전화번호입니다.');
        return false;
      }
    } catch (error) {
      console.error('전화번호 중복 검사 실패:', error);
      alert('전화번호 중복 검사에 실패했습니다.');
    }
  },
}));
