// import { useState, EventHandler, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import BlueButton from '../components/common/BlueButton';
// import { useNavigate } from 'react-router-dom';
import { GrowthFolderCreateModal } from '@components/feature/growth/GrowthFolderCreateModal';
import { Route, Routes, useLocation, useParams } from 'react-router-dom';
import { GrowthFolderList } from '@/components/feature/growth/GrowthFolderList';
import { GrowthDiaryList } from '@/components/feature/growth/GrowthDiaryList';
import { GrowthDiaryDetail } from '@/components/feature/growth/GrowthDiaryDetail';
import { GrowthDiaryCreate } from '@/components/feature/growth/GrowthDiaryCreate';

const GrowthFolder = () => {
  const [modalState, setModalState] = useState<boolean>(false);

  const onModalOpen = () => {
    setModalState(!modalState);
  };

  return (
    <div className="feature-box">
      <Routes>
        <Route path="/" element={<GrowthFolderList />} />
      </Routes>
    </div>
  );
};

export default GrowthFolder;
