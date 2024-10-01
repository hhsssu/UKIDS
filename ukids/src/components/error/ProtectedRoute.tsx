import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

// 로그인 안한 상태에서 진입금지인 곳 만들기
const ProtectedRoute = () => {
  const token = useAuthStore((state) => state.token);
  const nav = useNavigate();

  useEffect(() => {
    if (!token) {
      nav('/login');
    }
  }, [token, nav]);
  return token ? <Outlet /> : null; // 로그인 상태일 때만 Outlet 렌더링
};

// 로그인 된 상태에서 Home, Login, Join 페이지 진입하려고 했을 때, 무조건 /main으로 진입하도록 함
const PublicRoute = () => {
  const token = useAuthStore((state) => state.token);
  const nav = useNavigate();

  useEffect(() => {
    if (token) {
      nav('/main');
    }
  }, [token, nav]);

  return <Outlet />; // 로그인 안했을 때만 Outlet 렌더링
};

export { ProtectedRoute, PublicRoute };
