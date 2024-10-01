// 가족방, 게임에 사용할 참여가족 리스트 오른쪽 사이드에 위치할 예정
import { useEffect, useState } from 'react';
import callIcon from '@/assets/subway_call-2.png';
import discallIcon from '@/assets/subway_call-3.png';

import { useNavigate } from 'react-router-dom';
import { useVideoCallStore } from '@stores/videoCallStore';
import VideoToggleButton from '@components/feature/family_communication/VideoToggleButton';
import AudioToggleButton from '@components/feature/family_communication/AudioToggleButton';
import api from '@/util/api';
import { useFamilyStore } from '@stores/familyStore';
import CharacterTag from '@components/common/CharaterTag';

interface FamilyMemberListProps {
  isChattingRoom: boolean;
}

const FamilyMemberList = ({ isChattingRoom }: FamilyMemberListProps) => {
  const [familyList, setFamilyList] = useState([]);
  const { isChatting, setIsChatting, leaveSession } = useVideoCallStore();
  const { selectedFamilyId } = useFamilyStore();
  const nav = useNavigate();

  const handleClickCallBtn = () => {
    setIsChatting(!isChatting);
    if (isChatting) {
      leaveSession();
      nav('/chat');
    } else {
      nav('./call');
    }
  };

  useEffect(() => {
    setIsChatting(false);

    // 가족 리스트를 가져와서 구성원을 띄워준다.
    api.get(`/member/${selectedFamilyId}`).then((response) => {
      setFamilyList(response.data.result);
    });
  }, []);

  return (
    <>
      <div className="flex h-full flex-col w-1/4 p-4 border-solid border-l-2 border-l-[#999999]">
        {/* 상단 참여 가족 영역 */}
        <div className="flex items-start flex-col flex-grow overflow-y-auto mb-4">
          <h2 className="text-xl mb-4">가족구성원{`(${familyList.length})`}</h2>
          {familyList.map((family) => {
            return (
              <div key={family.familyMemberId}>
                <span className="mr-2">{family.userFamilyDto.name}</span>
                <CharacterTag character={family.role} />
              </div>
            );
          })}
        </div>

        {/* 가족대화방에서만 사용될 하단 버튼 영역 */}
        {isChattingRoom && (
          <div className="flex-none m-2">
            {/* 통화버튼 */}
            <div className="flex justify-center mb-2">
              {/* 채팅방/통화방 전환 */}
              <button
                onClick={handleClickCallBtn}
                className={`common-btn ${isChatting ? 'red-btn' : 'green-btn'}`}
              >
                <img
                  src={isChatting ? discallIcon : callIcon}
                  alt="call-icon"
                />
                {isChatting ? '연결끊기' : '연결하기'}
              </button>
            </div>
            {/* 카메라, 마이크 버튼 */}
            <div className="flex justify-evenly">
              <VideoToggleButton />
              <AudioToggleButton />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FamilyMemberList;
