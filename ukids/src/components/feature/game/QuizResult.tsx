import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Client, IMessage } from '@stomp/stompjs';
import { useFamilyStore } from '@/stores/familyStore.ts';
import { useTreeStore } from '@/stores/treeStore';
import SockJS from 'sockjs-client';
import QuizButton from './QuizButton';
import './gamepart.css';

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
  numberOfParticipants: number;
  maxQuestionCounts: number;
  currentQuestionIndex: number;
  participantList: { [key: string]: Participant };
  randomQuizQuestionList: any[] | null;
}

interface GameInfoMessage {
  type: 'GET_QUIZ_ROOM';
  gameResult: GameRoom;
}

interface ErrorMessage {
  type: 'ERROR';
  message: string;
}

type GameMessage = GameInfoMessage | ErrorMessage;

const QuizResult = () => {
  const { ukidsURL, token } = useAuthStore();
  const { selectedFamilyId } = useFamilyStore();
  const { updateTreeExp } = useTreeStore();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [stompClientInstance, setStompClientInstance] = useState<Client | null>(
    null,
  );

  const getGameInfo = async () => {
    if (stompClientInstance && stompClientInstance.connected) {
      try {
        stompClientInstance.publish({
          destination: `/app/quiz/info`,
          body: JSON.stringify({
            familyId: selectedFamilyId,
          }),
        });
      } catch (error) {
        console.error('퀴즈 게임 정보 에러:', error);
      }
    } else {
      console.log('stompClientInstance is null or message is empty');
    }
  };

  useEffect(() => {
    const socket = new SockJS(`${ukidsURL}/ws/ws-stomp`);
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `${token}`,
      },
      // 웹소켓 디버그 console.log
      // debug: (str) => {
      //   console.log('웹소켓 디버그: ' + str);
      // },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = (frame) => {
      // console.log('WebSocket 연결이 열렸습니다.', frame);
      setStompClientInstance(client);

      client.subscribe(
        `/topic/quiz/${selectedFamilyId}`,
        (message: IMessage) => {
          // console.log('Received message:', message.body);
          const receivedMessage: GameMessage = JSON.parse(message.body);

          // console.log('receivedMessage : ', receivedMessage);

          switch (receivedMessage.type) {
            case 'GET_QUIZ_ROOM':
              const gameRoomInfo = receivedMessage.gameResult;
              const { quizCount, numberOfParticipants, participantList } =
                gameRoomInfo;

              // 총 문제 수 계산
              const totalQuestions = quizCount * numberOfParticipants;
              setTotalQuestions(totalQuestions);

              // 참가자 정보를 배열로 변환 후 맞힌 수에 따라 정렬
              const sortedParticipants = Object.values(participantList).sort(
                (a, b) => b.hit - a.hit,
              );
              setParticipants(sortedParticipants);

              // 가족 나무 경험치 증가 로직 추가
              updateTreeExp(selectedFamilyId, 150);

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
    if (stompClientInstance && stompClientInstance.connected) {
      getGameInfo();
    }
  }, [stompClientInstance]);

  return (
    <>
      <div className="feature-box font-[ONE-Mobile-POP]">
        {/* 상단 */}
        <div className="h-[15%] flex justify-center items-center game-font quiz-font-color">
          <h1>퀴즈 결과</h1>
        </div>

        {/* 결과 창 */}
        <div className="h-[65%] flex justify-center items-center">
          <div className="w-[45rem] h-[20rem] bg-[#d9d9d9] rounded-[10px] p-4 text-2xl flex justify-center">
            <table className="w-[80%]">
              <thead>
                <tr className="border-solid border-b-4 border-[#777777]">
                  <th className="text-center py-2">이름</th>
                  <th className="text-center py-2">역할</th>
                  <th className="text-center py-2">맞힌 개수</th>
                </tr>
              </thead>
              <tbody className="">
                {participants.map((participant, index) => (
                  <tr key={index}>
                    <td className="text-center py-2">{participant.userName}</td>
                    <td className="text-center py-2">{participant.role}</td>
                    <td className="text-center py-2">
                      {participant.hit} / {totalQuestions} 정답
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 버튼 */}
        <div className="h-[15%] flex flex-row justify-center">
          <QuizButton name="결과 기록" path="../history" />
          <QuizButton name="메인으로" path="/game" />
        </div>
      </div>
    </>
  );
};

export default QuizResult;
