import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import UserUpdate from '../components/feature/user/UserUpdate';
import FamilyUpdate from '../components/feature/family/FamilyUpdate';
import FamilyMemberUpdate from '../components/feature/family/FamilyMemberUpdate';
import '../components/common/common.css';

const MyPage = () => {
  const location = useLocation();
  // const [activeButton, setActiveButton] = useState('');
  const nav = useNavigate();

  const handleClick = (path: string) => {
    // setActiveButton(path); // 클릭된 버튼의 경로를 상태로 저장
    nav(path);
  };

  // 현재 경로에 맞는 버튼의 클래스를 설정
  const getButtonClass = (path: string) => {
    return location.pathname === `/setting/${path}` ? 'active' : '';
  };

  return (
    <>
      <div className="feature-box px-[15px] py-[40px]">
        <section className="flex">
          <div className="setting-menu-box">
            <div className="w-full text-end">
              <button
                className={`mr-2 setting-menu-btn ${getButtonClass('mypage')}`}
                onClick={() => handleClick('mypage')}
              >
                개인 정보 수정
              </button>
            </div>
            <div className="w-full text-end">
              <button
                className={`mr-2 setting-menu-btn ${getButtonClass('family')}`}
                onClick={() => handleClick('family')}
              >
                가족 정보 수정
              </button>
            </div>
            <div className="w-full text-end">
              <button
                className={`mr-2 setting-menu-btn ${getButtonClass('member')}`}
                onClick={() => handleClick('member')}
              >
                가족 구성원 수정
              </button>
            </div>
          </div>
          <section className="setting-box">
            <Routes>
              <Route path="mypage" element={<UserUpdate />} />
              <Route path="family" element={<FamilyUpdate />} />
              <Route path="member" element={<FamilyMemberUpdate />} />
            </Routes>
          </section>
        </section>
      </div>
    </>
  );
};

export default MyPage;
