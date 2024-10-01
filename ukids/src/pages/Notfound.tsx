import GrayButton from '../components/common/GrayButton';

const Notfound = () => {
  return (
    <>
      <div className="feature-box flex flex-col justify-center items-center">
        <h1 className="font-bold text-5xl m-10">잘못된 페이지입니다.</h1>
        <GrayButton name="메인으로" path="/" />
      </div>
    </>
  );
};

export default Notfound;
