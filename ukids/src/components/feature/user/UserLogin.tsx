import React, { useState } from 'react';
import { useAuthStore } from '@stores/authStore';
import { useNavigate } from 'react-router-dom';
import BlueButton from '@components/common/BlueButton';
import './user.css';
import '@components/common/common.css';

const UserLogin = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const userLogin = useAuthStore((state: any) => state.userLogin);
  const nav = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // 폼 제출 시 새로고침 되는 것을 방지
    try {
      await userLogin(id, password); // 로그인 API 요청
      nav('/main'); // 로그인 후 리디렉션할 페이지
    } catch (error) {
      console.error('로그인 실패:', error);
      alert(error);
    }
  };

  const onClickJoinButton = () => {
    nav('/join');
  };

  return (
    <>
      {/* 로그인 박스 */}
      <div className="common-feature-box p-[50px]">
        <form onSubmit={handleLogin}>
          <div>
            <input
              type="text"
              placeholder="아이디"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
              className="login-id-box px-5 font-semibold text-[#555555]"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-pw-box px-5 font-semibold text-[#555555]"
            />
          </div>
          <div className="mt-10 flex justify-center">
            <BlueButton name="로그인" type="submit" path="" />
          </div>
        </form>
        <div className="flex items-center mt-4 justify-center">
          {/* <button className="join-find-btn">아이디 찾기</button>
          <div className="dash-box mx-2"></div>
          <button className="join-find-btn">비밀번호 찾기</button>
          <div className="dash-box mx-2"></div> */}
          <button className="join-find-btn" onClick={onClickJoinButton}>
            회원가입
          </button>
        </div>
      </div>
    </>
  );
};

export default UserLogin;
