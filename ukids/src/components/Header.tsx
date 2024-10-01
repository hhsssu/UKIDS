import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import ProfileButton from './common/ProfileButton';
import LoginButton from '../components/common/LoginButton';
import logo from '../assets/logo.png';

const Header = () => {
  const nav = useNavigate();
  const { token, userInfo, getUserInfo } = useAuthStore((state) => ({
    token: state.token,
    userInfo: state.userInfo,
    getUserInfo: state.getUserInfo,
  }));
  const [name, setName] = useState<string | undefined>(undefined);

  useEffect(() => {
    const UserName = async () => {
      if (!userInfo && token) {
        await getUserInfo(); // userInfo가 없고, 토큰이 있을 때만 호출
      }
      if (userInfo) {
        setName(userInfo.name);
      }
    };
    UserName();
  }, [userInfo, token, getUserInfo]);

  const handleLogoClick = () => {
    nav(`/`);
  };

  return (
    <div
      className="flex justify-between m-1 items-center mb-4"
      style={{ width: '100%' }}
    >
      {/* 부모 컨테이너를 전체 너비로 설정 */}
      {/* 로고 */}
      <button onClick={handleLogoClick} className="w-52">
        <img src={logo} alt="ukids-logo" width="230" />
      </button>
      {/* 로그인이 안되었으면 로그인/회원가입 버튼*/}
      {/* 로그인 완료 시 프로필 버튼 */}
      {/* 로그인 상태에 따른 조건부 렌더링 */}
      {!token ? ( // 토큰X -> 로그인X
        <LoginButton />
      ) : (
        //토큰 O -> 로그인 O
        <>
          <ProfileButton
            name={name || ''} // 사용자 이름이 없을 때 기본값
          />
        </>
      )}
    </div>
  );
};

export default Header;
