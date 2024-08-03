import GrayButton from './GrayButton';

const ProfileList = () => {
  return (
    <div className="profile-list">
      <GrayButton name="로그아웃" path="/" />
      <GrayButton name="설정" path="/" />
    </div>
  );
};

export default ProfileList;
