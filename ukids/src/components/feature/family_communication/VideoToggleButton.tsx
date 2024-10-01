import React from 'react';
import cam from '@/assets/pepicons-pencil_camera.png';
import { useVideoCallStore } from '@stores/videoCallStore';

const VideoToggleButton: React.FC = () => {
  const { isVideoEnabled, toggleVideo } = useVideoCallStore();

  return (
    <button
      onClick={toggleVideo}
      className="flex justify-center items-center w-[60px] h-[60px] bg-white rounded-full shadow"
    >
      <img
        src={cam}
        alt={isVideoEnabled ? 'on' : 'off'}
        style={{
          filter: isVideoEnabled
            ? 'invert(27%) sepia(92%) saturate(752%) hue-rotate(110deg) brightness(88%) contrast(89%)'
            : 'none',
        }}
      />
    </button>
  );
};

export default VideoToggleButton;
