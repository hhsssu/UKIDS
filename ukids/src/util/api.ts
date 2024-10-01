// API 모듈화
import axios from 'axios';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: 'https://i11b306.p.ssafy.io/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 토큰이 있는 경우 Authorization 헤더 설정
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default api;
