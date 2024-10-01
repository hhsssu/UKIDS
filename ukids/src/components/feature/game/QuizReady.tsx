import { useState, useEffect } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@stores/authStore';
import { useFamilyStore } from '@stores/familyStore';
import CharacterTag from '@components/common/CharaterTag';
import ImageSlider from '@components/common/ImageSlider';
import ReadyCall from '@components/feature/game/ReadyCall';
import VideoToggleButton from '@components/feature/family_communication/VideoToggleButton';
import AudioToggleButton from '@components/feature/family_communication/AudioToggleButton';
import '@components/feature/game/gamepart.css';
import gameExplain from '@/assets/game_explain.png';
import example_game1 from '@/assets/example_gamming.png';
import example_game2 from '@/assets/example_result.png';

interface Participant {
  userName: string;
  role: string;
  maxQuestion: number;
  hit: number;
  isReady: boolean;
}

interface GameRoom {
  sessionId: string;
  quizCount: number;
  isStart: boolean;
  hostId: string;
  numberOfParticipants: number;
  maxQuestionCounts: number;
  currentQuestionIndex: number;
  participantList: { [key: string]: Participant };
  randomQuizQuestionList: any[] | null;
}

interface EnterGameMessage {
  type: 'ENTER_GAME';
  id: number;
  webrtcConnection: string;
  gameRoomInfo: GameRoom;
}

interface ExitGameMessage {
  type: 'EXIT_GAME';
  id: number;
  webrtcConnection: string;
  gameRoomInfo: GameRoom;
}

interface SetQuizMessage {
  type: 'SET_QUIZ_COUNTS';
  quizCount: number;
}

interface IsStartMessage {
  type: 'IS_READY_GAME';
  gameStart: boolean;
}

interface GetQuizMaxMessage {
  type: 'GET_MAX_QUESTION_COUNTS';
  maxCounts: number;
}

interface ErrorMessage {
  type: 'ERROR';
  message: string;
}

type GameMessage =
  | EnterGameMessage
  | SetQuizMessage
  | ExitGameMessage
  | GetQuizMaxMessage
  | IsStartMessage
  | ErrorMessage;

const images = [example_game1, example_game2];
const descripstions = ['게임화면', '게임결과'];

const QuizReady = () => {
  const [isReady, setIsReady] = useState<boolean>(false);
  const navigate = useNavigate();
  const handleClick = () => {
    if (selectedValue === 0) {
      alert('문제 개수가 0입니다. 준비 상태를 변경할 수 없습니다.');
      return;
    }
    setIsReady(!isReady);
  };

  useEffect(() => {
    setReady(isReady);
  }, [isReady]);

  const { ukidsURL, token, userInfo } = useAuthStore();
  const { leaveSession } = useFamilyStore();
  const { selectedFamilyId } = useFamilyStore();
  const [user] = useState(userInfo.id);
  const [selectedValue, setSelectedValue] = useState<number>(1);
  const [maxOptions, setMaxOptions] = useState<number>(1);
  const [stompClientInstance, setStompClientInstance] = useState<Client | null>(
    null,
  );
  const [participants, setParticipants] = useState<
    { userName: string; role: string }[]
  >([]);

  const [nameOfUser, setNameOfUser] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [connection, setConnection] = useState<string | null>(null);

  const handleBack = () => {
    exitQuizRoom();
    navigate('../');
  };

  const enterQuizRoom = async () => {
    if (stompClientInstance && stompClientInstance.connected) {
      try {
        // console.log('stompClientInstance:', stompClientInstance);
        stompClientInstance.publish({
          destination: `/app/quiz/enter`,
          body: JSON.stringify({
            familyId: selectedFamilyId,
          }),
        });
      } catch (error) {
        console.error('게임방 입장 오류:', error);
      }
    } else {
      console.log('stompClientInstance is null or message is empty');
    }
  };

  const setReady = async (state: boolean) => {
    if (stompClientInstance && stompClientInstance.connected) {
      try {
        // console.log('stompClientInstance:', stompClientInstance);
        stompClientInstance.publish({
          destination: `/app/quiz/ready`,
          body: JSON.stringify({
            familyId: selectedFamilyId,
            state,
          }),
        });
      } catch (error) {
        console.error('퀴즈 개수 설정 오류:', error);
      }
    } else {
      console.log('stompClientInstance is null or message is empty');
    }
  };

  const exitQuizRoom = async () => {
    if (stompClientInstance && stompClientInstance.connected) {
      try {
        // console.log('stompClientInstance:', stompClientInstance);
        stompClientInstance.publish({
          destination: `/app/quiz/exit`,
          body: JSON.stringify({
            familyId: selectedFamilyId,
          }),
        });
      } catch (error) {
        console.error('게임방 퇴장 오류:', error);
      }
    } else {
      console.log('stompClientInstance is null or message is empty');
    }
  };

  const GetQuizMaxCounts = async () => {
    if (stompClientInstance && stompClientInstance.connected) {
      try {
        // console.log('stompClientInstance:', stompClientInstance);
        stompClientInstance.publish({
          destination: `/app/quiz/quiz-max`,
          body: JSON.stringify({
            familyId: selectedFamilyId,
            counts: `${selectedValue}`,
          }),
        });
      } catch (error) {
        console.error('최대 퀴즈 개수 갱신 오류:', error);
      }
    } else {
      console.log('stompClientInstance is null or message is empty');
    }
  };

  const setQuizCounts = async () => {
    if (stompClientInstance && stompClientInstance.connected) {
      try {
        // console.log('setQuizCounts : ', selectedValue);
        // console.log('stompClientInstance:', stompClientInstance);
        stompClientInstance.publish({
          destination: `/app/quiz/quiz-count`,
          body: JSON.stringify({
            familyId: selectedFamilyId,
            counts: `${selectedValue}`,
          }),
        });
      } catch (error) {
        console.error('퀴즈 개수 설정 오류:', error);
      }
    } else {
      console.log('stompClientInstance is null or message is empty');
    }
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(parseInt(event.target.value, 10));
  };

  useEffect(() => {
    if (stompClientInstance && stompClientInstance.connected) {
      enterQuizRoom();
    }
  }, [stompClientInstance]);

  useEffect(() => {
    if (selectedValue > 0) {
      setQuizCounts();
    }
  }, [selectedValue]);

  useEffect(() => {
    GetQuizMaxCounts();
  }, [setParticipants]);

  // 처음 들어왔을 때 방 연결
  useEffect(() => {
    const socket = new SockJS(`${ukidsURL}/ws/ws-stomp`);
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `${token}`,
      },
      debug: (str) => {
        // console.log('웹소켓 디버그: ' + str);
      },
    });

    client.onConnect = (frame) => {
      // console.log('WebSocket 연결이 열렸습니다.', frame);

      // 올바른 stompClientInstance 설정
      // console.log('Setting stompClientInstance:', client);?-
      setStompClientInstance(client);

      client.subscribe(
        `/topic/quiz/${selectedFamilyId}`,
        (message: IMessage) => {
          // console.log('Received message at GameRoom:', message.body);
          const receivedMessage: GameMessage = JSON.parse(message.body);

          // console.log('receivedMessage : ', receivedMessage);

          switch (receivedMessage.type) {
            case 'IS_READY_GAME':
              if (receivedMessage.gameStart) {
                navigate('/quiz/start');
                return;
              }
              break;
            case 'ENTER_GAME':
              const participant =
                receivedMessage.gameRoomInfo.participantList[user];
              setNameOfUser(participant.userName);
              setSessionId(receivedMessage.gameRoomInfo.sessionId);
              setConnection(receivedMessage.webrtcConnection);

              if (participant && participant.maxQuestion === 0) {
                alert('퀴즈 문제 개수가 0입니다. 게임에 참여할 수 없습니다.');
                navigate('../');
                return;
              }
              console.log(receivedMessage.gameRoomInfo);
              if (receivedMessage.gameRoomInfo.isStart) {
                alert('현재 게임이 진행 중입니다.');
                navigate('../');
                return;
              }

              setMaxOptions(receivedMessage.gameRoomInfo.maxQuestionCounts);

              const participantEntries = Object.entries(
                receivedMessage.gameRoomInfo.participantList,
              ).map(([key, participant]) => ({
                userName: participant.userName,
                role: participant.role,
              }));
              setParticipants(participantEntries);
              break;

            case 'EXIT_GAME':
              setMaxOptions(receivedMessage.gameRoomInfo.maxQuestionCounts);

              const newParticipantEntries = Object.entries(
                receivedMessage.gameRoomInfo.participantList,
              ).map(([nkey, remainParticipant]) => ({
                userName: remainParticipant.userName,
                role: remainParticipant.role,
              }));
              setParticipants(newParticipantEntries);
              break;

            case 'GET_MAX_QUESTION_COUNTS':
              setMaxOptions(receivedMessage.maxCounts);
              break;

            case 'SET_QUIZ_COUNTS':
              setSelectedValue(receivedMessage.quizCount);
              break;

            case 'ERROR':
              console.error('error : ', receivedMessage.message);
          }
        },
      );
    };
    client.onStompError = (frame) => {
      console.error('STOMP Error:', frame.headers['message']);
      console.error('Details:', frame.body);
    };

    client.activate();

    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, [ukidsURL, token, selectedFamilyId]);

  useEffect(() => {
    return () => {
      if (stompClientInstance) {
        const currentPath = window.location.pathname;
        if (currentPath !== '/quiz/start') {
          exitQuizRoom();
          leaveSession();
          window.removeEventListener('beforeunload', leaveSession);
        }
      }
    };
  }, [leaveSession]);

  return (
    <>
      <div className="feature-box flex h-full">
        {/* 왼쪽 영역 */}
        <div className="w-[75%] flex flex-col justify-center items-center">
          {/* 제목 */}
          <div className="h-[15%] flex flex-row">
            <span className="flex items-center game-font quiz-font-color">
              가족 퀴즈 준비
            </span>
            <div className="hover-container m-4" id="hover-effect">
              <img src={gameExplain} alt="설명" />
              <div className="hover-text-bottom">
                참여할 가족이 모두 대기방에 들어올 때까지 기다려주세요!
                <br />
                기다리는 동안 내가 작성한 질문의 수만큼 개수를 설정할 수 있어요!
                <br />
                가족이 선택한 질문 개수 중 가장 적은 개수가 게임이 진행될 퀴즈
                개수에요
                <br />한 질문당 15초가 주어져요! 문제를 선택하면 글씨가
                굵어져요!
              </div>
            </div>
          </div>

          {/* 가운데 영역 */}
          <div className="h-[65%] flex flex-col justify-center">
            {/* 문제 개수 정하기 */}
            <div className="flex justify-center">
              <span>1인 출제 문제 개수 </span>
              <select
                name="quizCnt"
                id="num"
                value={selectedValue}
                onChange={handleSelectChange}
              >
                {Array.from({ length: maxOptions }, (_, index) => (
                  <option key={index + 1} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>
              <span>개</span>
            </div>

            {/* 퀴즈 예시 */}
            <ImageSlider images={images} descriptions={descripstions} />
          </div>

          {/* 버튼 영역 */}
          <div className="h-[15%] flex flex-row p-4">
            {!isReady ? (
              <>
                <button
                  onClick={handleBack}
                  className="game-btn-g game-btn-common"
                >
                  돌아가기
                </button>

                <button
                  onClick={handleClick}
                  className="game-btn-quiz game-btn-common"
                >
                  준비 완료!
                </button>
              </>
            ) : (
              <button
                onClick={handleClick}
                className="game-btn-g game-btn-common"
              >
                준비 취소
              </button>
            )}
          </div>
        </div>

        {/* 오른쪽 영역 */}
        <div className="w-1/4 h-[100%] p-4">
          <h2 className="h-[5%] text-xl font-bold mb-2 over">참여자 목록</h2>
          <ul className="h-[20%] overflow-y-auto">
            {participants.map((participant, index) => (
              <li key={index} className="mb-2">
                <span className="font-bold mr-2">{participant.userName}</span>
                <CharacterTag character={participant.role} />
              </li>
            ))}
          </ul>
          {nameOfUser && sessionId && connection && (
            <ReadyCall
              nameOfUser={nameOfUser}
              sessionId={sessionId}
              token={connection}
            />
          )}
          <div className="h-[10%] flex flex-fow justify-evenly">
            <VideoToggleButton />
            <AudioToggleButton />
          </div>
        </div>
      </div>
    </>
  );
};

export default QuizReady;
