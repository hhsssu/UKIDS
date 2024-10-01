import { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Client, IMessage } from '@stomp/stompjs';
import ChattingBox from './ChattingBox';
import BlueButton from '@components/common/BlueButton';
import SockJS from 'sockjs-client';
import { useAuthStore } from '@stores/authStore';
import { useFamilyStore } from '@stores/familyStore';
import api from '@/util/api';

interface Message {
  messageId: number;
  sender: string;
  content: string;
  user_id: number;
  is_delete: boolean;
  create_time: string;
  update_time: string;
}

interface JwtPayload {
  userId: string;
}

const FamilyChatting = () => {
  const { ukidsURL, token } = useAuthStore();
  const { selectedFamilyId } = useFamilyStore();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatRoomId, setChatRoomId] = useState(-1);
  const [stompClientInstance, setStompClientInstance] = useState<Client | null>(
    null,
  );

  const userId = Number.parseInt(
    jwtDecode<JwtPayload>(localStorage.getItem('token')!).userId,
  );

  // 사용자가 입력하는 메세지 내용 인지
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  // Enter 키 입력 시 메시지 전송
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 스크롤 맨 밑으로 내리기
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 메세지 가져오기
  const getChatList = async () => {
    const url = `/chat/room/${selectedFamilyId}/messages`;

    const { data } = await api.get(url);

    const formattedMessages = data.map((chat: any) => ({
      messageId: chat.createTime,
      content: chat.message,
      sender: chat.sender,
      user_id: chat.senderId,
      is_delete: false,
      create_time: chat.createTime.substring(11, 16),
      update_time: chat.createTime,
    }));

    formattedMessages.reverse();

    setMessages(formattedMessages);
  };

  // 채팅방 입장
  const enterChatRoom = async () => {
    if (stompClientInstance && stompClientInstance.connected) {
      try {
        stompClientInstance.publish({
          destination: '/pub/chat/message',
          body: JSON.stringify({
            type: 'ENTER',
            roomId: chatRoomId,
            message: message,
          }),
        });
      } catch (error) {
        console.error('Enter 메세지 전송 오류:', error);
      }
    } else {
      console.log('stompClientInstance is null or message is empty');
    }
  };

  // 채팅방 연결 종료
  const exitChatRoom = async () => {
    if (stompClientInstance && stompClientInstance.connected) {
      try {
        stompClientInstance.publish({
          destination: `/pub/chat/leave`,
          body: JSON.stringify({
            familyId: selectedFamilyId,
          }),
        });
      } catch (error) {
        console.error('채팅방 퇴장 오류:', error);
      }
    } else {
      console.log('stompClientInstance is null or message is empty');
    }
  };

  // 메세지 전송
  const sendMessage = async () => {
    if (
      stompClientInstance &&
      stompClientInstance.connected &&
      message.trim() !== ''
    ) {
      try {
        stompClientInstance.publish({
          destination: '/pub/chat/message',
          body: JSON.stringify({
            type: 'TALK',
            roomId: chatRoomId,
            sender: userId,
            message: message,
          }),
        });

        setMessage('');
        scrollToBottom();
      } catch (error) {
        console.error('메세지 전송 오류:', error);
      }
    } else {
      console.log('stompClientInstance is null or message is empty');
    }
  };

  // 전송버튼 누를 때
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  // 처음 입장 시
  useEffect(() => {
    setChatRoomId(selectedFamilyId);

    const socket = new SockJS(`${ukidsURL}/ws/ws-stomp`);
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `${token}`,
      },
      // 웹소켓 디버그 관련 console.log
      // debug: (str) => {
      //   console.log('웹소켓 디버그: ' + str);
      // },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = (frame) => {
      // console.log('WebSocket 연결이 열렸습니다.', frame);

      // 올바른 stompClientInstance 설정
      // console.log('Setting stompClientInstance:', client);
      setStompClientInstance(client);

      client.subscribe(`/sub/chat/room/${chatRoomId}`, (message: IMessage) => {
        // console.log('Received message at ChattingRoom: ', message.body);
        const receivedMessage = JSON.parse(message.body);
        // console.log('----ReceivedMessage----');
        // console.log(receivedMessage);
        // {
        //   createTime: '2024-08-14T00:13:58.60193821';
        //   message: '다른 사람';
        //   roomId: 1;
        //   sender: '김싸피';
        //   senderId: 2;
        //   type: 'TALK';
        // }

        const displayMessage: Message = {
          messageId: receivedMessage.createTime,
          content: receivedMessage.message,
          user_id: receivedMessage.senderId,
          sender: receivedMessage.sender,
          is_delete: false,
          create_time: receivedMessage.createTime.substring(11, 16),
          update_time: receivedMessage.createTime,
        };
        setMessages((prevMessages) => {
          const messageExists = prevMessages.some(
            (msg) => msg.messageId === displayMessage.messageId,
          );
          if (!messageExists) {
            return [displayMessage, ...prevMessages];
          }
          return prevMessages;
        });
      });
    };
    client.onStompError = (frame) => {
      console.error('STOMP Error:', frame.headers['message']);
      console.error('Details:', frame.body);
    };

    client.activate();

    return () => {
      if (stompClientInstance) {
        exitChatRoom();
        client.deactivate();
      }
    };
  }, [ukidsURL, token, chatRoomId]);

  useEffect(() => {
    if (stompClientInstance && stompClientInstance.connected) {
      enterChatRoom();
      getChatList();
    }
  }, [stompClientInstance]);

  // 메세지에 변화가 있을 시 스크롤 맨 밑으로
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="w-3/4">
      {/* 좌측 영역 */}
      <div className="flex flex-col p-2 h-full">
        {/* 채팅 컨테이너 (메시지 + 입력창) */}
        <div className="flex flex-col h-full">
          {/* 메시지 영역 */}
          <div className="overflow-y-auto mb-1 flex flex-col-reverse h-full">
            <div ref={messagesEndRef} />
            {messages.length === 0 ? (
              <div>대화를 시작해보세요!</div>
            ) : (
              messages.map((storedMessage) => (
                <div
                  key={storedMessage.messageId}
                  className={
                    storedMessage.user_id === userId ? 'self-end' : 'self-start'
                  }
                >
                  <ChattingBox
                    message={storedMessage.content}
                    sender={storedMessage.sender}
                    isSender={storedMessage.user_id === userId}
                    timestamp={storedMessage.create_time}
                  />
                </div>
              ))
            )}
          </div>

          {/* 채팅입력 영역 */}
          <div className="flex-none">
            <form className="flex flex-row justify-center" onSubmit={onSubmit}>
              <textarea
                // type="text"
                className="flex-grow h-[50px] bg-white rounded-[5px] border border-[#999999] mx-2 ml-4 p-2 pt-3"
                onChange={(e) => onChange(e)}
                onKeyDown={onKeyDown}
                value={message}
                rows={2}
                style={{ resize: 'none', overflowY: 'auto' }}
                placeholder="메시지를 입력하세요"
              />
              <BlueButton name="전송" path="" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyChatting;
