import { Route, Routes } from 'react-router-dom';
import FamilyMemberList from '../components/common/FamilyMemberList';
import VideoCall from '../components/feature/family_communication/VideoCall';
import FamilyChatting from '../components/feature/family_communication/Chatting';

const FamilyCommunication = () => {
  return (
    <>
      <div className="feature-box flex flex-row h-full">
        {/* 좌측 영역 */}
        <Routes>
          <Route path="" element={<FamilyChatting />} />
          <Route path="call" element={<VideoCall />} />
        </Routes>

        {/* 우측 영역 */}
        <FamilyMemberList isChattingRoom={true} />
      </div>
    </>
  );
};

export default FamilyCommunication;
