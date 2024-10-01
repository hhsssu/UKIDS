import { Route, Routes } from 'react-router-dom';
import { FamilyCreate } from '../components/feature/family/FamilyCreate';
import { FamilyFind } from '../components/feature/family/FamilyFind';
import FamilyCFButton from '../components/feature/family/FamilyCFButton';

const FamilyCreateFind = () => {
  return (
    <>
      <Routes>
        <Route path="" element={<FamilyCFButton />} />
        <Route path="create" element={<FamilyCreate />} />
        <Route path="find" element={<FamilyFind />} />
      </Routes>
    </>
  );
};

export default FamilyCreateFind;
