import { FamilyCreateButton } from '../../../components/feature/family/FamilyCreate';
import { FamilyFindButton } from '../../../components/feature/family/FamilyFind';

const FamilyCreateFind = () => {
  return (
    <div className="flex justify-evenly">
      <FamilyCreateButton />
      <FamilyFindButton />
    </div>
  );
};

export default FamilyCreateFind;
