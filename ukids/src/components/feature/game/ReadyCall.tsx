import { useEffect } from 'react';
import { useVideoCallStore } from '@stores/videoCallStore';
import ReadySession from './ReadySession';

interface ReadyCallProps {
  nameOfUser: string;
  sessionId: string;
  token: string;
}

function ReadyCall({ nameOfUser, sessionId, token }: ReadyCallProps) {
  const {
    subscribers,
    publisher,
    userName,
    leaveSession,
    joinSession,
    setUserName,
  } = useVideoCallStore();

  useEffect(() => {
    window.addEventListener('beforeunload', leaveSession);

    return () => {
      leaveSession();
      window.removeEventListener('beforeunload', leaveSession);
    };
  }, [leaveSession]);

  useEffect(() => {
    setUserName(nameOfUser);

    const connectSession = async () => {
      try {
        console.log(
          'before join session : ',
          nameOfUser,
          ', ',
          sessionId,
          ', ',
          token,
        );
        joinSession(0, userName, token);
        console.log('Successfully joined the session.');
      } catch (error) {
        console.error('Error joining the session:', error);
      }
    };

    connectSession();
  }, []);

  return (
    <div className="h-[60%]">
      <ReadySession publisher={publisher} subscribers={subscribers} />
    </div>
  );
}

export default ReadyCall;
