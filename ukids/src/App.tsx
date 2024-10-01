import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Join from './pages/Join';
import Schedule from './pages/Schedule';
import Letters from './pages/Letters';
import Albums from './components/feature/album/Albums';
import AlbumDetail from './components/feature/album/AlbumDetail';
import UploadAlbum from './components/feature/album/UploadAlbum';
import PaintingDiary from './pages/PaintingDiary';
import GrowthDiary from './pages/GrowthDiary';
import GrowthFolder from './pages/GrowthFolder';
import GameSelect from './pages/GameSelect';
import Quiz from './pages/Quiz';
import CallMyName from './pages/CallMyName';
import FamilyVideoCall from './pages/FamilyCommunication';
import Setting from './pages/Setting';
import Notfound from './pages/Notfound';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/common/Sidebar';
import Main from './pages/Main';
import FamilyCreateFind from './pages/FamliyCreateFind';
import { ProtectedRoute, PublicRoute } from './components/error/ProtectedRoute';
import { useEffect } from 'react';
import { UpdateAlbum } from './components/feature/album/UpdateAlbum';

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
    location.pathname === '/' ||
    location.pathname === '/login' ||
    location.pathname === '/join' ||
    location.pathname.startsWith('/family');

  // flex css 제거
  const removeFlexClass =
    location.pathname === '/' ||
    location.pathname === '/family' ||
    location.pathname === '/login' ||
    location.pathname === '/join' ||
    location.pathname === '/family/create' ||
    location.pathname === '/family/find';

  // 배경색 변경 (회색 그라데이션)
  // useEffect(() => {
  //   if (
  //     location.pathname === '/' ||
  //     location.pathname === '/login' ||
  //     location.pathname === '/join'
  //   ) {
  //     document.body.style.backgroundColor = '#fff';
  //   }
  // }, [location.pathname]);

  return (
    <div className="-webkit-user-select:none -moz-user-select:none -ms-user-select:none user-select:none">
      <Header />
      <div
        className={
          removeFlexClass ? 'h-[600px]' : 'h-[600px] flex justify-between'
        }
      >
        {!hideSidebar && <Sidebar />}
        <Routes>
          {/* 로그인 했으면 진입 금지 */}
          <Route element={<PublicRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/join" element={<Join />} />
          </Route>
          {/* 로그인 안했으면 진입 금지 */}
          <Route element={<ProtectedRoute />}>
            <Route path="/family/*" element={<FamilyCreateFind />} />
            <Route path="/main" element={<Main />} />
            <Route path="/schedule/*" element={<Schedule />}></Route>
            <Route path="/letters/*" element={<Letters />} />
            <Route path="/albums" element={<Albums />} />
            {/* 앨범 중첩 라우팅 */}
            <Route path="/albums/:albumId" element={<AlbumDetail />} />
            <Route path="/albums/upload" element={<UploadAlbum />} />
            <Route path="/albums/update/:albumId" element={<UpdateAlbum />} />
            <Route path="/paintdiary/*" element={<PaintingDiary />} />
            <Route path="/growthdiary/*" element={<GrowthDiary />} />
            <Route path="/growthfolder/*" element={<GrowthFolder />} />
            <Route path="/chat/*" element={<FamilyVideoCall />} />
            <Route path="/game" element={<GameSelect />}></Route>
            <Route path="/quiz/*" element={<Quiz />} />
            <Route path="/callmyname/*" element={<CallMyName />} />
            <Route path="/setting/*" element={<Setting />} />
            <Route path="*" element={<Notfound />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

export default App;
