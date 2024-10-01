import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFamilyStore } from '@/stores/familyStore';
import { useTreeStore } from '@/stores/treeStore';
import api from '@/util/api';
import BlueButton from '@components/common/BlueButton';
import WhiteBackButton from '@components/common/WhiteBackButton';
import { jwtDecode } from 'jwt-decode';
import { Loading } from '@components/feature/loading/Loading';

// interface Letter {
//   content: string;
//   createDate: string;
//   familyName: string;
//   fromUsername: string;
//   toUsername: string;
//   toUserId: number;
//   isRead: boolean;
// }

interface UserFamilyDto {
  userId: number;
  name: string;
  birthDate?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
  role: string;
}

interface Member {
  familyMemberId: number;
  userFamilyDto: UserFamilyDto;
}

interface JwtPayload {
  userId: string;
}

const day = new Date();
const month = day.getMonth() + 1;
const date = day.getDate();
const today = `${day.getFullYear()}-${month < 10 ? '0' + month : month}-${
  date < 10 ? '0' + date : date
}`;

export const LetterWrite = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const [currentUserId, setCurrentUserId] = useState(-1);

  const { fromUserId } = useParams();

  const { selectedFamilyId } = useFamilyStore();

  const { updateTreeExp } = useTreeStore();

  const [members, setMembers] = useState<Member[]>([]);

  const [familyName, setFamilyName] = useState('');

  const [toMember, setToMember] = useState<UserFamilyDto>();

  const [toUser, setToUser] = useState<UserFamilyDto>();

  const [dropCheck, setDropCheck] = useState<boolean>(false);

  const [content, setContent] = useState<string>();

  const getUserInfo = async () => {
    const url = `/user/${fromUserId}`;

    const { data } = await api.get(url);
    console.log(data);

    setToMember(data.result);
  };

  const getMembers = async () => {
    const url = `/member/${selectedFamilyId}`;

    const { data } = await api.get(url);
    console.log(data);
    setMembers(data.result);
  };

  const getToUser = async (userId: number) => {
    const url = `/user/${userId}`;
    const { data } = await api.get(url);

    setToUser(data.result);

    setDropCheck(false);
  };

  const sendLetter = async () => {
    const url = `/letter`;
    let inputData = null;
    if (toMember) {
      console.log('답장');
      inputData = {
        // 가족 ID 전역에서 가져올 수 있도록 수정
        familyId: selectedFamilyId,
        content: content,
        toUserId: toMember.userId,
      };
    } else {
      console.log('편지작성');
      if (!toUser) {
        alert('편지 받을 사람을 선택해주세요.');
        return;
      }

      inputData = {
        // 가족 ID 전역에서 가져올 수 있도록 수정
        familyId: selectedFamilyId,
        content: content,
        toUserId: toUser.userId,
      };
    }

    if (!confirm('작성하시겠습니까?')) return;
    setLoading(true);
    const { data } = await api.post(url, inputData);

    // 편지 작성 시 나무 경험치 증가
    updateTreeExp(selectedFamilyId, 75);

    navigate('/letters');

    console.log(data);
  };

  useEffect(() => {
    getMembers();
    if (fromUserId != undefined) {
      getUserInfo();
    }

    api.get(`/family/${selectedFamilyId}`).then((response: any) => {
      setFamilyName(response.data.result.name);
    });

    setCurrentUserId(
      Number.parseInt(
        jwtDecode<JwtPayload>(localStorage.getItem('token')!).userId,
      ),
    );
  }, []);

  return (
    <div className="feature-box flex flex-col items-center">
      {/* 상단 영역 */}
      <div className="h-[15%] w-[90%] flex justify-between items-center">
        <WhiteBackButton path="/letters" />
        <BlueButton name="보내기" path="/" onClick={sendLetter} />
      </div>

      {/* 본문 영역 */}
      <div className="w-[90%] h-[100%]">
        {/* 보낼 사람 선택 영역 */}
        <div className="h-[15%]">
          {fromUserId != undefined ? (
            <div>{toMember?.name}</div>
          ) : (
            <div className="h-full text-[30px] grid grid-cols-3">
              <div></div>
              <div className="flex flex-row justify-center items-center">
                <div onClick={() => setDropCheck(!dropCheck)}>
                  To. {toUser != null ? toUser.name : `선택해주세요`}
                </div>
                <div className="m-4 text-[20px]">{dropCheck ? '▲' : '▼'}</div>
              </div>
              {dropCheck && (
                <ul className="absolute left-[310px] top-[130px] w-[15rem] text-center bg-[#333] text-stone-50">
                  {members.map((item) => {
                    if (item.userFamilyDto.userId === currentUserId) return;
                    return (
                      <li
                        key={item.userFamilyDto.userId}
                        onClick={() => getToUser(item.userFamilyDto.userId)}
                        className="border-solid border-2 border-white"
                      >
                        {item.userFamilyDto.name}
                      </li>
                    );
                  })}
                </ul>
              )}
              <div className="text-[16px] flex flex-row justify-end items-end mb-2">
                <span>{familyName}</span>
                <span className="ml-2">{today}</span>
              </div>
            </div>
          )}
        </div>

        {/* 메세지 입력 영역 */}
        <div className="h-[80%]">
          <textarea
            className="textarea-with-lines w-full h-full"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      </div>

      {loading && <Loading />}
    </div>
  );
};
