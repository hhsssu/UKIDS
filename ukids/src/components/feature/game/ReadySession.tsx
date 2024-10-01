import React from 'react';
import { Publisher, Subscriber } from 'openvidu-browser';
import './readysessions.css';

interface SessionProps {
  publisher: { publisher: Publisher; name: string } | null;
  subscribers: { subscriber: Subscriber; name: string }[];
}

const ReadySession: React.FC<SessionProps> = ({ publisher, subscribers }) => {
  return (
    <div className="session-container">
      <div className="video-container overflow-y-auto">
        {/* 나의 비디오 스트림 */}
        {publisher && (
          <div id="publisher" className="stream-container">
            <video
              autoPlay
              ref={(ref) => {
                if (ref) publisher.publisher.addVideoElement(ref);
              }}
            />
            <div className="name-tag">{publisher.name}</div>
          </div>
        )}

        {/* 상대방 비디오 스트림 */}
        {subscribers.map((subscriberObj, index) => (
          <div key={index} className="stream-container">
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
    </div>
  );
};

export default ReadySession;
