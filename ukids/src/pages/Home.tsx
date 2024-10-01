import { useEffect } from 'react';
import '@components/common/mainAnimation.css';
import introImg1 from '@/assets/intro1.png';
import introImg2 from '@/assets/intro2.png';

const Home = () => {
  useEffect(() => {
    // 페이지 로드 후 1초 뒤에 애니메이션 트리거
    const firstText: any = document.querySelector('.first');
    setTimeout(() => {
      firstText.classList.add('show');
    }, 500); // 애니메이션 시작 시간을 조정

    const secondText: any = document.querySelector('.second');
    setTimeout(() => {
      secondText.classList.add('show');
    }, 1500);

    const thirdText: any = document.querySelector('.third');
    setTimeout(() => {
      thirdText.classList.add('show');
    }, 2500);

    const fourthImg: any = document.querySelector('.fourth');
    setTimeout(() => {
      fourthImg.classList.add('show');
    }, 4000);
  }, []);

  return (
    <>
      {/* 최상단 컨테이너 */}
      <div className="flex flex-col p-8">
        {/* 시작문구 */}
        <div className="flex flex-col items-center">
          <p className="first">가족과의 추억을 쌓으며</p>
          <p className="second">유대감 나무를 키워보세요</p>
          <p className="third m-6">추억이 늘어날수록 나무도 쑥쑥 자랄거예요</p>
        </div>

        <div className="fourth flex flex-row justify-center">
          <img src={introImg1} alt="introImg1" className="h-[311px]" />
          <img src={introImg2} alt="introImg2" className="h-[272px]" />
        </div>
      </div>
    </>
  );
};

export default Home;
