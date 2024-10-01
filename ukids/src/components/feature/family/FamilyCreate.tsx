import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFamilyStore } from '@stores/familyStore';
import BlueButton from '@components/common/BlueButton';

const FamilyCreate = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const createFamily = useFamilyStore((state: any) => state.createFamily);

  const handleCreateFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    //
    setError('');
    if (password != confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    // 가족방 생성 API 요청
    await createFamily(name, password);
    alert('가족방이 생성되었습니다.');
    window.location.replace('/main');
  };

  return (
    <div className="common-feature-box w-[1000px] h-[576px] my-0 mx-auto">
      <p className="big-title-style text-center text-[#FFBF33] my-10 pt-16">
        가족방 생성
      </p>

      <form className="join-form w-[450px]" onSubmit={handleCreateFamily}>
        <div className="mb-7">
          {/* <label htmlFor="id">가족방 이름</label> */}
          <input
            type="text"
            id="familyname"
            placeholder="가족방 이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-box px-5 py-7 font-semibold text-[#555555]"
          />
        </div>
        <div className="mb-7">
          {/* <label htmlFor="name">가족방 비밀번호</label> */}
          <input
            type="password"
            id="familypassword"
            placeholder="가족방 비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-box px-5 py-7 font-semibold text-[#555555]"
          />
        </div>
        <div className="mb-7">
          {/* <label htmlFor="familypwConfirm">비밀번호 확인</label> */}
          <input
            type="password"
            id="familypwConfirm"
            placeholder="가족방 비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-box px-5 py-7 font-semibold text-[#555555]"
          />
          <div className="pl-2 text-sm">
            <div className="text-[#F03F2F] ">{error ? error : ''}</div>
          </div>
        </div>
        <div className="mx-auto my-5 w-1/2">
          <BlueButton name="방 만들기" type="submit" path="" />
        </div>
      </form>
    </div>
  );
};

//////////////////////////////////////////////////////

const FamilyCreateButton = () => {
  const nav = useNavigate();
  const onClickFamilyCreateButton = () => {
    nav('create');
  };

  return (
    <button
      onClick={onClickFamilyCreateButton}
      className="family-btn common-feature-box relative w-[400px] h-[480px] mt-11 flex items-center justify-center"
    >
      <div className="absolute z-10 mb-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="270"
          height="270"
          viewBox="0 0 158 158"
          fill="none"
        >
          <path
            d="M81.4688 29.625C82.7783 29.625 84.0341 30.1452 84.9601 31.0712C85.8861 31.9971 86.4062 33.253 86.4062 34.5625V71.5938H123.438C124.747 71.5938 126.003 72.1139 126.929 73.0399C127.855 73.9659 128.375 75.2217 128.375 76.5312V81.4688C128.375 82.7783 127.855 84.0341 126.929 84.9601C126.003 85.8861 124.747 86.4062 123.438 86.4062H86.4062V123.438C86.4062 124.747 85.8861 126.003 84.9601 126.929C84.0341 127.855 82.7783 128.375 81.4688 128.375H76.5312C75.2217 128.375 73.9659 127.855 73.0399 126.929C72.1139 126.003 71.5938 124.747 71.5938 123.438V86.4062H34.5625C33.253 86.4062 31.9971 85.8861 31.0712 84.9601C30.1452 84.0341 29.625 82.7783 29.625 81.4688V76.5312C29.625 75.2217 30.1452 73.9659 31.0712 73.0399C31.9971 72.1139 33.253 71.5938 34.5625 71.5938H71.5938V34.5625C71.5938 33.253 72.1139 31.9971 73.0399 31.0712C73.9659 30.1452 75.2217 29.625 76.5312 29.625H81.4688Z"
            fill="rgb(54, 213, 241)"
            fillOpacity="0.4"
          />
        </svg>
      </div>
      <div className="z-20 big-title-style mt-5">가족방 만들기</div>
    </button>
  );
};

export { FamilyCreate, FamilyCreateButton };
