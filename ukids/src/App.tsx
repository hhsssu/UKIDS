import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Join from './pages/Join';
import Schedule from './pages/Schedule';
import Letters from './pages/Letters';
import Albums from './pages/Albums';
import PaintingDiary from './pages/PaintingDiary';
import GrowthDiary from './pages/GrowthDiary';
import Game from './pages/Game';
import FamilyChatting from './pages/FamilyChatting';
import FamilyVideoCall from './pages/FamilyVideoCall';
import Setting from './pages/Setting';
import Notfound from './pages/Notfound';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/common/Sidebar';

// 1. Home "/" : 가장 기본 페이지 (로그인 전)
// 1-1. FamilyHome "/:familyId" : 로그인 후 메인 페이지
// 2. Login "/login" : 로그인
// 3. Join "/join" : 회원가입
// 4. Schedule "/schedule" : 일정 관리
// 5. Letters "/letters" : 편지함
// 6. Albums "/albums" : 사진 앨범
// 7. PaintDiary "/paintdiary" : 그림일기
// 8. GrowthDiary "/growthdiary" : 성장일지
// 9. FamilyChatting "/chat" : 가족 채팅방
// 10. FamilyVideoCall "/chat/call" : 가족 통화
//    => 채팅방 내의 통화여서 추후 사라질지도?
// 11. Game "/game" : 게임
// 11-1. QuizGame "/game/quiz" : 가족 퀴즈 게임
// 11-2. CallMyNameGame "/game/callmyname" : 콜마이네임 게임
// 12. Setting "/setting" : 설정 (회원정보, 가족정보 모두 수정(=마이페이지))
// 13. Notfound "/잘못된 주소" : 잘못된 주소 입력 시

const App = () => {
  const location = useLocation();

  // 로그인 안한 로그인, 회원가입, 홈, 가족방 생성/찾기는 사이드바X
  const hideSidebar =
    location.pathname === '/login' || location.pathname === '/join';

  const removeFlexClass =
    location.pathname === '/login' || location.pathname === '/join';

  return (
    <div className="">
      <Header />
      <div className={removeFlexClass ? '' : 'flex justify-between'}>
        {!hideSidebar && <Sidebar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Join" element={<Join />} />
          <Route path="/schedule/*" element={<Schedule />} />
          <Route path="/letters" element={<Letters />} />
          <Route path="/albums" element={<Albums />} />
          <Route path="/paintdiary" element={<PaintingDiary />} />
          <Route path="/growthdiary" element={<GrowthDiary />} />
          <Route path="/chat" element={<FamilyChatting />} />
          <Route path="/chat/call" element={<FamilyVideoCall />} />
          <Route path="/game" element={<Game />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="*" element={<Notfound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
