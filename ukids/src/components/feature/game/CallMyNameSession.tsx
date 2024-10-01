import React, { useEffect, useState } from 'react';
import { Publisher, Subscriber } from 'openvidu-browser';
import { useVideoCallStore } from '@stores/videoCallStore';
import './callMyNameSession.css';

interface SessionProps {
  publisher: { publisher: Publisher; name: string } | null;
  subscribers: { subscriber: Subscriber; name: string }[];
  currentTurn: number;
  onCorrectAnswer: () => void;
  onNextTurn: () => void;
  remainingTime: number;
  activeSpeakerIndex: number; // 현재 질문하는 사람 인덱스
  listenerIndex: number; // 현재 질문 받는 사람 인덱스
}

const CallMyNameSession: React.FC<SessionProps> = ({
  publisher,
  subscribers,
  currentTurn,
  onCorrectAnswer,
  onNextTurn,
  remainingTime,
  activeSpeakerIndex,
  listenerIndex,
}) => {
  const { setAudioForSubscriber } = useVideoCallStore();
  const [myAnswer, setMyAnswer] = useState('');

  useEffect(() => {
    // 모든 비디오의 오디오를 비활성화
    subscribers.forEach((_, index) => {
      setAudioForSubscriber(index, false);
    });
    if (publisher) {
      setAudioForSubscriber(
        subscribers.findIndex((sub) => sub.name === publisher.name),
        true,
      );
    }

    // 현재 질문하는 사람과 질문 받는 사람의 오디오를 활성화
    setAudioForSubscriber(listenerIndex, true);
    setAudioForSubscriber(activeSpeakerIndex, true);

    return () => {
      // 타이머 종료 시 모든 오디오를 비활성화
      subscribers.forEach((_, index) => {
        setAudioForSubscriber(index, false);
      });
      if (publisher) {
        setAudioForSubscriber(
          subscribers.findIndex((sub) => sub.name === publisher.name),
          false,
        );
      }
    };
  }, [
    activeSpeakerIndex,
    listenerIndex,
    publisher,
    subscribers,
    remainingTime,
    setAudioForSubscriber,
  ]);

  useEffect(() => {
    if (remainingTime <= 0) {
      onNextTurn();
    }
  }, [remainingTime, onNextTurn]);

  const handleAnswerSubmit = () => {
    const correctAnswer = subscribers[currentTurn].name;
    if (myAnswer === correctAnswer) {
      onCorrectAnswer();
    }
  };

  return (
    <div className="session-container">
      {/* 타이머 표시 */}
      <div className="timer">
        남은 시간: {Math.floor(remainingTime / 60)}:
        {remainingTime % 60 < 10
          ? `0${remainingTime % 60}`
          : remainingTime % 60}
      </div>

      {/* 상대방 비디오 스트림 */}
      <div
        className={`video-container ${
          subscribers.length === 1
            ? 'single-subscriber'
            : 'multiple-subscribers'
        }`}
      >
        {subscribers.map((subscriberObj, index) => (
          <div
            key={index}
            className={`stream-container ${
              currentTurn === index ? 'spotlight' : ''
            }`}
          >
            <video
              autoPlay
              ref={(ref) => {
                if (ref) subscriberObj.subscriber.addVideoElement(ref);
              }}
            />
            <div className="name-tag">{subscriberObj.name}</div>
          </div>
        ))}
      </div>

      {/* 나의 비디오 스트림 */}
      {publisher && (
        <div id="publisher" className="publisher-container">
          <video
            autoPlay
            ref={(ref) => {
              if (ref) publisher.publisher.addVideoElement(ref);
            }}
          />
          <div className="name-tag">{publisher.name}</div>
          <div className="answer-section">
            <input
              type="text"
              value={myAnswer}
              onChange={(e) => setMyAnswer(e.target.value)}
              placeholder="Your guess"
            />
            <button onClick={handleAnswerSubmit}>Submit</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallMyNameSession;
