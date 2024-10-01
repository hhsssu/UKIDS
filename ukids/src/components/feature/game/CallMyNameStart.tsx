import { useAuthStore } from '@stores/authStore';
import { useVideoCallStore } from '@stores/videoCallStore';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import api from '@/util/api';
import CallMyNameSession from '@components/feature/game/CallMyNameSession';
import { useNavigate } from 'react-router-dom';

interface JwtPayload {
  name: string;
}

const CallMyNameStart = () => {
  const {
    subscribers,
    publisher,
    userName,
    leaveSession,
    joinSession,
    setUserName,
  } = useVideoCallStore();
  const { ukidsURL, token } = useAuthStore();
  const navigate = useNavigate();

  let familyId = 33;
  const nameOfUser = jwtDecode<JwtPayload>(localStorage.getItem('token')!).name;

  const [currentTurn, setCurrentTurn] = useState(0);
  const [remainingTime, setRemainingTime] = useState(90); // 초기 타이머 설정
  const [activeSpeakerIndex, setActiveSpeakerIndex] = useState(0); // 질문할 사람 인덱스
  const [listenerIndex, setListenerIndex] = useState(1); // 질문 받는 사람 인덱스

  useEffect(() => {
    window.addEventListener('beforeunload', leaveSession);

    return () => {
      window.removeEventListener('beforeunload', leaveSession);
    };
  }, [leaveSession]);

  useEffect(() => {
    setUserName(nameOfUser);

    const fetchFamilyId = async () => {
      try {
        const response = await api.get('family/all');
        console.log(response.data.result);
        familyId = response.data.result[0].familyId;
        await joinSession(familyId, userName);
        console.log('Successfully joined the session.');
      } catch (error) {
        console.error('Error joining the session:', error);
      }
    };

    fetchFamilyId();
  }, [joinSession, nameOfUser, setUserName, userName]);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (remainingTime <= 0) {
      handleNextTurn(); // 타이머가 0이 되었을 때 다음 턴으로 넘어가도록 호출
    }
  }, [remainingTime]);

  const handleCorrectAnswer = () => {
    alert('Correct! You are now excluded from the spotlight.');
    setRemainingTime(90); // 타이머 리셋
    const nextTurn = (currentTurn + 1) % subscribers.length;
    setCurrentTurn(nextTurn);
    setActiveSpeakerIndex(nextTurn); // 다음 질문할 사람 인덱스
    setListenerIndex((nextTurn + 1) % subscribers.length); // 다음 질문 받을 사람 인덱스
  };

  const handleNextTurn = () => {
    if (subscribers.length > 1) {
      const nextTurn = (currentTurn + 1) % subscribers.length;
      setCurrentTurn(nextTurn);
      setActiveSpeakerIndex(nextTurn); // 다음 질문할 사람 인덱스
      setListenerIndex((nextTurn + 1) % subscribers.length); // 다음 질문 받을 사람 인덱스
      setRemainingTime(90); // 타이머 리셋
    } else {
      navigate('/game-end'); // 남은 사람이 1명일 경우 게임 종료
    }
  };

  return (
    <div className="feature-box">
      <CallMyNameSession
        publisher={publisher}
        subscribers={subscribers}
        currentTurn={currentTurn}
        onCorrectAnswer={handleCorrectAnswer}
        onNextTurn={handleNextTurn}
        remainingTime={remainingTime}
        activeSpeakerIndex={activeSpeakerIndex}
        listenerIndex={listenerIndex}
      />
    </div>
  );
};

export default CallMyNameStart;
