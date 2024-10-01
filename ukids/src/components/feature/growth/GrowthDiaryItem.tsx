import './GrowthDiaryList.css';
// import diaryIcon from '../../../assets/diary.png'; 



interface Diary {
  title: string;
  date: string;
  imageUrl: string;
}



export const GrowthDiaryItem = ({ title, date, imageUrl }: Diary) => {
  // 엑박쓸지?
  // const handleError = (e) => {
  //   e.target.src = diaryIcon; // 로딩 실패 시 대체 이미지로 교체
  // }

  



  return (
    <div className="box-box">
      <div className="growth-item">
        <div>{date}</div>
        <div>
        {/* <img src={imageUrl} alt="" crossOrigin="anonymous" onError={handleError} /> */}
        <img src={imageUrl} alt="" crossOrigin="anonymous"/>
        </div>
        <div>{title}</div>
      </div>
    </div>
  );
};
