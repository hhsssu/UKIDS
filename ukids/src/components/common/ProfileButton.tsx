import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useFamilyStore } from '../../stores/familyStore';
import GrayButton from './GrayButton';
import './common.css';
import './button.css';

// 프로필 버튼 컴포넌트
interface UserProps {
  name: string;
}

const ProfileButton = ({ name }: UserProps) => {
  const nav = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const { userInfo, getUserInfo } = useAuthStore((state) => ({
    userInfo: state.userInfo,
    getUserInfo: state.getUserInfo,
  }));

  const {
    family,
    familyList,
    fetchFamilyList,
    selectedFamilyId,
    setSelectedFamilyId,
    fetchFamilyInfo,
    member,
    fetchMemberList,
  } = useFamilyStore((state) => ({
    family: state.family,
    familyList: state.familyList,
    fetchFamilyList: state.fetchFamilyList,
    selectedFamilyId: state.selectedFamilyId,
    setSelectedFamilyId: state.setSelectedFamilyId,
    fetchFamilyInfo: state.fetchFamilyInfo,
    member: state.member,
    fetchMemberList: state.fetchMemberList,
  }));

  // 현재 로그인된 사용자의 userId
  const currentUserId = userInfo?.userId;

  useEffect(() => {
    // 컴포넌트가 마운트될 때 유저 정보를 가져옴
    getUserInfo();
  }, [getUserInfo]);

  useEffect(() => {
    const loadFamilyList = async () => {
      if (userInfo) {
        await fetchFamilyList(); // familyList를 가져옴
      }
    };
    loadFamilyList();
  }, [userInfo, fetchFamilyList]);

  useEffect(() => {
    if (selectedFamilyId) {
      fetchFamilyInfo(selectedFamilyId);
      fetchMemberList(selectedFamilyId);
    }
  }, [selectedFamilyId, fetchFamilyInfo, fetchMemberList]);

  // 드롭다운 메뉴 열기/닫기
  const handleClick = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  // 가족방 만들기 버튼 클릭 시
  const onClickFamilyButton = () => {
    nav('/family');
    setDropdownOpen(false);
  };

  // 설정 버튼 클릭 시
  const onClickSettingButton = () => {
    nav('/setting/mypage');
    setDropdownOpen(false);
  };

  // 초대 버튼 클릭 시
  const onClickInviteButton = () => {
    alert(family.name + '의 초대코드는 ' + family.code + ' 입니다.');
    setDropdownOpen(false);
  };

  // 대표 여부 확인
  const isRepresentative = member.some(
    (mem) =>
      mem.userFamilyDto.userId === currentUserId &&
      mem.familyMemberId === family.representative,
  );

  // 가족방을 클릭했을 때
  const handleFamilyClick = (familyId: number) => {
    window.location.reload();
    // nav('/');

    const selectedFamily = familyList.find(
      (familyList) => familyList.familyId === familyId,
    );
    if (selectedFamily) {
      setSelectedFamilyId(familyId);
      nav('/main');
    } else {
      console.error('Family ID not found in the list:', familyId);
    }
    setDropdownOpen(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-5">
        <div className="inline-block profile-name">{name}</div>
        <button onClick={handleClick} className="profile-btn">
          <div className="flex">
            <div className="min-w-[120px] text-start truncate">
              {familyList.length > 0
                ? (selectedFamilyId !== null &&
                    familyList.find(
                      (familyList) => familyList.familyId === selectedFamilyId,
                    )?.name) ||
                  '가족방을 선택하세요!'
                : '가족방을 만들어보세요!'}
            </div>
            {/* 대표자 표시 */}
            {isRepresentative && (
              <span className="mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="17"
                  viewBox="0 0 21 17"
                  fill="none"
                >
                  <path
                    d="M20.9808 6.1733C20.9808 6.18346 20.9808 6.1927 20.9743 6.20286L18.8476 15.799C18.7822 16.1369 18.5991 16.4417 18.3301 16.6609C18.061 16.8802 17.7228 17.0001 17.3736 17H3.63015C3.28116 16.9999 2.94314 16.8799 2.67426 16.6607C2.40539 16.4414 2.2225 16.1367 2.15706 15.799L0.0304229 6.20286C0.0304229 6.1927 0.0257345 6.18346 0.0238592 6.1733C-0.0343447 5.85558 0.0146243 5.52783 0.163284 5.24012C0.311943 4.95241 0.552118 4.72056 0.847109 4.58C1.1421 4.43945 1.47569 4.39791 1.79689 4.46174C2.1181 4.52557 2.40927 4.69125 2.6259 4.93348L5.78304 8.28616L9.13991 0.868502C9.14007 0.865425 9.14007 0.862341 9.13991 0.859264C9.25995 0.602751 9.45206 0.385495 9.69352 0.233213C9.93498 0.080931 10.2157 0 10.5023 0C10.789 0 11.0697 0.080931 11.3112 0.233213C11.5526 0.385495 11.7448 0.602751 11.8648 0.859264C11.8646 0.862341 11.8646 0.865425 11.8648 0.868502L15.2217 8.28616L18.3788 4.93348C18.5959 4.69305 18.8867 4.52899 19.207 4.4662C19.5273 4.40341 19.8597 4.44533 20.1537 4.5856C20.4476 4.72586 20.6871 4.9568 20.8357 5.24336C20.9843 5.52991 21.0339 5.85642 20.9771 6.1733H20.9808Z"
                    fill="#FFE600"
                  />
                </svg>
              </span>
            )}
          </div>
          <div className="fill-black">▼</div>
        </button>
      </div>

      {isDropdownOpen && (
        <div className="shadow-lg rounded-lg profile-list">
          <ul className="py-2 text-sm text-gray-700 family-list-box">
            {familyList.map((familyList) => (
              <li
                key={familyList.familyId}
                className={`family-list hover:bg-gray-100`}
                onClick={() => handleFamilyClick(familyList.familyId)}
              >
                <span className="inline-block w-[120px] truncate">
                  {familyList.name}
                </span>
                {isRepresentative && (
                  <span className="mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="21"
                      height="17"
                      viewBox="0 0 21 17"
                      fill="none"
                    >
                      <path
                        d="M20.9808 6.1733C20.9808 6.18346 20.9808 6.1927 20.9743 6.20286L18.8476 15.799C18.7822 16.1369 18.5991 16.4417 18.3301 16.6609C18.061 16.8802 17.7228 17.0001 17.3736 17H3.63015C3.28116 16.9999 2.94314 16.8799 2.67426 16.6607C2.40539 16.4414 2.2225 16.1367 2.15706 15.799L0.0304229 6.20286C0.0304229 6.1927 0.0257345 6.18346 0.0238592 6.1733C-0.0343447 5.85558 0.0146243 5.52783 0.163284 5.24012C0.311943 4.95241 0.552118 4.72056 0.847109 4.58C1.1421 4.43945 1.47569 4.39791 1.79689 4.46174C2.1181 4.52557 2.40927 4.69125 2.6259 4.93348L5.78304 8.28616L9.13991 0.868502C9.14007 0.865425 9.14007 0.862341 9.13991 0.859264C9.25995 0.602751 9.45206 0.385495 9.69352 0.233213C9.93498 0.080931 10.2157 0 10.5023 0C10.789 0 11.0697 0.080931 11.3112 0.233213C11.5526 0.385495 11.7448 0.602751 11.8648 0.859264C11.8646 0.862341 11.8646 0.865425 11.8648 0.868502L15.2217 8.28616L18.3788 4.93348C18.5959 4.69305 18.8867 4.52899 19.207 4.4662C19.5273 4.40341 19.8597 4.44533 20.1537 4.5856C20.4476 4.72586 20.6871 4.9568 20.8357 5.24336C20.9843 5.52991 21.0339 5.85642 20.9771 6.1733H20.9808Z"
                        fill="#FFE600"
                      />
                    </svg>
                  </span>
                )}
              </li>
            ))}
          </ul>
          <button onClick={onClickFamilyButton} className="family-create-btn">
            가족방 만들기 +
          </button>
          <div className="flex justify-evenly mb-[20px]">
            <GrayButton name="로그아웃" path="/login" />
            <GrayButton name="설정" path="" onClick={onClickSettingButton} />
            <GrayButton name="초대" path="" onClick={onClickInviteButton} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileButton;
