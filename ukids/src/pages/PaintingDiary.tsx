import PictureDiaryList from '../components/feature/pictureDiary/PictureDiaryList';
import { Outlet, Route, Routes } from 'react-router-dom';
import { PictureDiaryDetail } from '@components/feature/pictureDiary/PictureDiaryDetail';
import { PictureDiaryCreate } from '@components/feature/pictureDiary/PictureDiaryCreate';
import { PictureDiaryUpdate } from '@components/feature/pictureDiary/PictureDiaryUpdate';


const PaintingDiary = () => {
  return (
    <div className="feature-box">


  
      {/* <PictureDiaryList /> */}
      <Routes>
        <Route path="" element={<PictureDiaryList />} />
        <Route path=":pictureDiaryId" element={<PictureDiaryDetail />} />
        <Route path="write" element={<PictureDiaryCreate />} />
        <Route path="update/:pictureDiaryId" element={<PictureDiaryUpdate />} />
      </Routes>

    


    </div>
  );
};

export default PaintingDiary;
