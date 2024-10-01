import folder from '@/assets/folder.png';

import './GrowthFolderItem.css';

interface Folder {
  folderName: string;
}

// 성장 폴더

export const GrowthFolderItem = ({ folderName }: Folder) => {
  return (
    <div className="folderItem">

      {/* 이미지 */}
      <div className="folderImage">
        <img src={folder} alt="그림 일기" crossOrigin="anonymous" />
      </div>

      {/* 폴더 이름 */}
      <div className="folderName">{folderName}</div>
      
    </div>
  );
};

export default GrowthFolderItem;
