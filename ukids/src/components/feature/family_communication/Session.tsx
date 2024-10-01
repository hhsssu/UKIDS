import React, { useState } from 'react';
import { Publisher, Subscriber } from 'openvidu-browser';
import './videoSession.css';

interface SessionProps {
  publisher: { publisher: Publisher; name: string } | null;
  subscribers: { subscriber: Subscriber; name: string }[];
}

const Session: React.FC<SessionProps> = ({ publisher, subscribers }) => {
  const [mainStreamManager, setMainStreamManager] = useState<
    | { publisher: Publisher; name: string }
    | { subscriber: Subscriber; name: string }
    | null
  >(null);

  const handleVideoClick = (
    streamObj:
      | { publisher: Publisher; name: string }
      | { subscriber: Subscriber; name: string },
  ) => {
    if (mainStreamManager === streamObj) {
      setMainStreamManager(null); // 이미 메인에 있는 경우, 그리드 모드로 돌아가기
    } else {
      setMainStreamManager(streamObj); // 선택된 비디오를 메인으로 설정
    }
  };

  return (
    <div className="session-container">
      <div
        className={`video-container ${
          subscribers.length === 1 || mainStreamManager
            ? 'single-subscriber'
            : 'multiple-subscribers'
        }`}
      >
        {mainStreamManager ? (
          // 메인 스트림을 전체 화면으로 표시
          <div className="stream-container main-video">
            <video
              autoPlay
              ref={(ref) => {
                if (ref) {
                  if ('publisher' in mainStreamManager) {
                    mainStreamManager.publisher.addVideoElement(ref);
                  } else {
                    mainStreamManager.subscriber.addVideoElement(ref);
                  }
                }
              }}
              onClick={() => handleVideoClick(mainStreamManager)}
            />
            <div className="name-tag">
              {'publisher' in mainStreamManager
                ? mainStreamManager.name
                : mainStreamManager.name}
            </div>
          </div>
        ) : (
          // 그리드 레이아웃으로 모든 스트림 표시
          <>
            {subscribers.map((subscriberObj, index) => (
              <div
                key={index}
                className="stream-container"
                onClick={() => handleVideoClick(subscriberObj)}
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
          </>
        )}
      </div>

      {publisher && !mainStreamManager && (
        <div
          id="publisher"
          className="publisher-container"
          onClick={() => handleVideoClick(publisher)}
        >
          <video
            autoPlay
            ref={(ref) => {
              if (ref) publisher.publisher.addVideoElement(ref);
            }}
          />
          <div className="name-tag">{publisher.name}</div>
        </div>
      )}

      {publisher && mainStreamManager && 'subscriber' in mainStreamManager && (
        <div id="publisher" className="publisher-container side-video">
          <video
            autoPlay
            ref={(ref) => {
              if (ref) publisher.publisher.addVideoElement(ref);
            }}
          />
          <div className="name-tag">{publisher.name}</div>
        </div>
      )}
    </div>
  );
};

export default Session;
