// import { useState, EventHandler, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import BlueButton from '../components/common/BlueButton';
// import { useNavigate } from 'react-router-dom';
import { GrowthFolderCreateModal } from '@components/feature/growth/GrowthFolderCreateModal';
import { Route, Routes, useLocation, useParams } from 'react-router-dom';
import { GrowthDiaryList } from '@/components/feature/growth/GrowthDiaryList';
import { GrowthDiaryDetail } from '@/components/feature/growth/GrowthDiaryDetail';
import { GrowthDiaryCreate } from '@/components/feature/growth/GrowthDiaryCreate';
import { GrowthDiaryUpdate } from '@/components/feature/growth/GrowthDiaryUpdate';
const GrowthDiary = () => {
  const [modalState, setModalState] = useState<boolean>(false);

  // const { folderId } = useParams();
  const [folderId, setFolderId] = useState<string>();

  const onModalOpen = () => {
    setModalState(!modalState);
  };

  useEffect(() => {
    // console.log('path: ', location.pathname);
    const segments = location.pathname.split('/').filter(Boolean);
    setFolderId(segments[segments.length - 1]);
  }, []);

  return (
    <div className="feature-box">
      <Routes>
        <Route path="folder/:folderId" element={<GrowthDiaryList />} />
        <Route path="diary/:recordId" element={<GrowthDiaryDetail />} />
        <Route path="update/:recordId" element={<GrowthDiaryUpdate />} />
        <Route path="write/:folderId" element={<GrowthDiaryCreate />} />
      </Routes>
    </div>
  );
};

export default GrowthDiary;
