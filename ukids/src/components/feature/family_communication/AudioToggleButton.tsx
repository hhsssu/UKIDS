import React from 'react';
import mic from '../../../assets/ion_mic-sharp.png';
import { useVideoCallStore } from '../../../stores/videoCallStore';

const AudioToggleButton: React.FC = () => {
  const { isAudioEnabled, toggleAudio } = useVideoCallStore();

  return (
    <button
      onClick={toggleAudio}
      className="flex justify-center items-center w-[60px] h-[60px] bg-white rounded-full shadow"
    >
      <img
        src={mic}
        alt={isAudioEnabled ? 'on' : 'off'}
        style={{
          filter: isAudioEnabled
            ? 'invert(27%) sepia(92%) saturate(752%) hue-rotate(110deg) brightness(88%) contrast(89%)'
            : 'none',
        }}
      />
    </button>
  );
};

export default AudioToggleButton;
