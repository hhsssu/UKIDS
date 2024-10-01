interface DiaryItem {
  pictureUrl: string;
  content: string;
  date: string;
}

export const PictureDiaryItem = ({ pictureUrl, content, date }: DiaryItem) => {
  return (
    <div>
      <img src={pictureUrl} alt="" crossOrigin="anonymous" />
      <div className="album-item-date">{date}</div>
      <div className="album-item-title">{content}</div>
    </div>
  );
};
