import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Client, IMessage } from '@stomp/stompjs';
import { jwtDecode } from 'jwt-decode';
import SockJS from 'sockjs-client';

import './gamepart.css';

interface Participant {
  userId: number;
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
}

interface CallMyNameRoomInfo {
  sessionId: string;
  isStart: boolean;
  round: number;
  currentTurn: number;
  keywordType: string | null;
  participantList: { [key: string]: ParticipantInfo };
  eliminatedParticipants: { [key: string]: ParticipantInfo };
}

interface ParticipantInfo {
  round: number;
  keyword: string | null;
  isReady: boolean;
  isCorrect: boolean;
  isHost: boolean;
}

interface EnterRoomResponse {
  id: number;
  webrtcConnection: string;
  callMyNameRoomInfo: CallMyNameRoomInfo;
}

interface JwtPayload {
  userId: string;
}

const CallMyNameStart = () => {
  const navigate = useNavigate();
  const { ukidsURL, token } = useAuthStore();
  const familyId = 1;
  const userId = Number.parseInt(
    jwtDecode<JwtPayload>(localStorage.getItem('token')!).userId,
  );
  const [stompClient, setStompClient] = useState<Client | null>(null);

  // 1. 웹소켓 연결 설정 및 활성화
  useEffect(() => {
    const socket = new SockJS(`${ukidsURL}/api/ws-stomp`);
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => {
        console.log('웹소켓 디버그:', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    // 웹소켓 연결 성공 시 호출되는 메서드
    client.onConnect = (frame) => {
      console.log('웹소켓 연결됨:', frame);
      setStompClient(client);

      // 2. 특정 주제(topic)에 대한 구독
      client.subscribe(`/topic/call/${familyId}`, (message: IMessage) => {
        const receivedMessage = JSON.parse(message.body);
        console.log('받은 메시지:', receivedMessage);

        // 필요한 메시지 처리 로직 추가
      });
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
  }, [ukidsURL, token, familyId]);

  // 3. 게임방 입장
  const enterGameRoom = async () => {
    if (stompClient && stompClient.connected) {
      try {
        stompClient.publish({
          destination: `/ws/ws-stomp/app/call/enter/${familyId}`,
          body: JSON.stringify({ familyId }),
        });
        console.log('게임방 입장 성공.');
      } catch (error) {
        console.error('게임방 입장 오류:', error);
      }
    }
  };

  return (
    <div className="feature-box flex justify-center flex-col">
      <div className="flex justify-center">
        <h1>게임 시작</h1>
      </div>
      <button onClick={enterGameRoom} className="enter-room-button">
        게임방 입장
      </button>
    </div>
  );
};

export default CallMyNameStart;
