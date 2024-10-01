import { useState } from 'react';

const ImageSlider = ({ images, descriptions }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  return (
    <div className="w-[500px] h-[250px] bg-[#d9d9d9] rounded-[10px] relative overflow-hidden">
      {/* 이미지 및 텍스트 리스트 */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 50}%)`,
          width: `${images.length * 100}%`,
        }}
      >
        {images.map((image: any, index: any) => (
          <div
            key={index}
            className="w-full h-full flex flex-col justify-center items-center"
          >
            <img
              src={image}
              alt={`Slide ${index}`}
              className="w-[60%] h-[60%] object-contain"
            />
            <p className="text-center mt-2 text-sm text-gray-700">
              {descriptions[index]}
            </p>
          </div>
        ))}
      </div>

      {/* 이전 화살표 */}
      <button
        onClick={goToPrev}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
      >
        &#8592;
      </button>

      {/* 다음 화살표 */}
      <button
        onClick={goToNext}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
      >
        &#8594;
      </button>
    </div>
  );
};

export default ImageSlider;
