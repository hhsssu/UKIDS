import { useEffect, useState } from 'react';
import { useFamilyStore } from '@stores/familyStore';
import CharacterTag from '@components/common/CharaterTag';
import { useAuthStore } from '@stores/authStore';
import { ModalFamily } from '@components/feature/modal/ModalFamily';
import { useNavigate } from 'react-router-dom';

const FamilyMemberUpdate = () => {
  const {
    selectedFamilyId,
    family,
    member,
    pendingMember,
    fetchMemberList,
    fetchFamilyInfo,
    deleteMember,
    deleteFamily,
    pendingMemberList,
    approvedMember,
    decliedMember,
    setMemberRole,
  } = useFamilyStore();

  const { userInfo } = useAuthStore();
  const [memberRoles, setMemberRoles] = useState<{ [key: number]: string }>({});
  const [modalState, setModalState] = useState(false);

  const nav = useNavigate();

  useEffect(() => {
    if (selectedFamilyId) {
      fetchMemberList(selectedFamilyId);
      fetchFamilyInfo(selectedFamilyId);
      pendingMemberList(selectedFamilyId);
    }
  }, [selectedFamilyId, fetchMemberList, fetchFamilyInfo, pendingMemberList]);

  // 역할 변경 핸들러
  const handleRoleChange = async (userId: number, newRole: string) => {
    setMemberRoles((prevRoles) => ({
      ...prevRoles,
      [userId]: newRole,
    }));
    try {
      await setMemberRole(userId, newRole, selectedFamilyId!);
      window.location.reload();
    } catch (error) {
      console.error('Error updatong role', error);
    }
  };

  // 멤버 내보내기
  const onClickDeleteMember = async (familyMemberId: number, type: number) => {
    try {
      await deleteMember(familyMemberId, 1);
      alert('내보내기가 완료되었습니다.');
    } catch (error) {
      console.error('Error deleting family member', error);
    }
  };

  // 멤버 신청 수락
  const onClickApprovedMember = async (familyMemberId: number) => {
    try {
      await approvedMember(familyMemberId);
      alert('가족 승인 완료되었습니다.');
    } catch (error) {
      console.error('Error approving family member', error);
    }
  };

  // 멤버 신청 거절
  const onClickDecliedMember = async (familyMemberId: number) => {
    try {
      await decliedMember(familyMemberId);
      alert('가족 신청 거절이 되었습니다.');
    } catch (error) {
      console.error('Error declining family member', error);
    }
  };

  // 모달 오픈
  const openModal = () => {
    setModalState(!modalState);
  };

  const onClickDeleteFamily = async (password: string) => {
    if (selectedFamilyId && family.userFamilyDto.userId === userInfo?.userId) {
      try {
        await deleteFamily(selectedFamilyId, password);
        nav('/main');
      } catch (error) {
        console.error('Error deleting family', error);
      }
    } else {
      alert('가족 대표만 가족 해체가 가능합니다.');
    }
  };

  // 역할별로 표시되는 이름 매핑
  const roleDisplayNames: { [key: string]: string } = {
    ROLE_FATHER: '아빠',
    ROLE_MOTHER: '엄마',
    ROLE_DAUGHTER: '딸',
    ROLE_SON: '아들',
    ROLE_GRANDFATHER: '할아버지',
    ROLE_GRANDMOTHER: '할머니',
    ROLE_NONE: '없음',
  };

  return (
    <>
      <div className="px-[10px]">
        <section className="join-form w-[670px]">
          <div className="h-[469px]">
            <section className="mb-6">
              <div className="flex justify-between items-center">
                <div className="text-end mr-2 w-80">
                  <label htmlFor="id" className="text-[#555] font-bold">
                    가족방 이름
                  </label>
                </div>
                <div className="px-5 w-96 font-semibold text-[#555555]">
                  {family.name}
                </div>
              </div>
            </section>
            <section className="mb-6">
              <div className="flex justify-between items-center">
                <div className="w-80 text-end mr-2">
                  <label htmlFor="code" className="text-[#555] font-bold">
                    대표자
                  </label>
                </div>
                <div className="px-5 w-96 font-semibold text-[#555555]">
                  {family.userFamilyDto.name}
                </div>
              </div>
            </section>
            <section className="flex justify-evenly">
              <div className="w-1/2 mr-10">
                <table>
                  <thead>
                    <tr>
                      <th colSpan={4}>가족 구성원 리스트</th>
                    </tr>
                  </thead>
                  <tbody>
                    {member.map((member: any) => (
                      <tr key={member.userFamilyDto.userId}>
                        <td className="font-semibold">
                          {member.userFamilyDto.name}
                        </td>
                        <td>
                          <select
                            name="character"
                            id="character"
                            value={
                              memberRoles[member.userFamilyDto.userId] ||
                              member.role
                            }
                            onChange={(e) =>
                              handleRoleChange(
                                member.userFamilyDto.userId,
                                e.target.value,
                              )
                            }
                          >
                            {Object.entries(roleDisplayNames).map(
                              ([role, displayName]) => (
                                <option key={role} value={role}>
                                  {displayName}
                                </option>
                              ),
                            )}
                          </select>
                        </td>
                        <td>
                          <CharacterTag character={member.role} />
                        </td>
                        <td>
                          {userInfo?.userId !== member.userFamilyDto.userId && (
                            <button
                              onClick={() =>
                                onClickDeleteMember(
                                  member.userFamilyDto.userId,
                                  1,
                                )
                              }
                              className="common-btn gray-btn w-20 text-sm p-0 mx-6"
                            >
                              내보내기
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <table>
                  <thead>
                    <tr>
                      <th colSpan={3}>가족 신청 리스트</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingMember.map((pendingMember: any) => (
                      <tr key={pendingMember.familyMemberId}>
                        <td className="font-semibold px-6">
                          {pendingMember.userFamilyDto.name}
                        </td>
                        <td>
                          <button
                            onClick={() =>
                              onClickApprovedMember(
                                pendingMember.familyMemberId,
                              )
                            }
                            className="common-btn blue-btn w-20 text-sm p-0 mx-6"
                          >
                            수락
                          </button>
                        </td>
                        <td>
                          <button
                            onClick={() =>
                              onClickDecliedMember(pendingMember.familyMemberId)
                            }
                            className="common-btn gray-btn w-20 text-sm p-0 mx-6"
                          >
                            거절
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
          <div className="flex justify-center mr-10">
            {/* <div className="mr-10">
              <BlueButton name="수정 완료" type="submit" path="" />
            </div> */}

            <button onClick={openModal} className="common-btn red-btn">
              가족 해체
            </button>
            <div>
              {modalState && (
                <ModalFamily
                  content="가족방을 삭제하시겠습니까?"
                  modalState={modalState}
                  setModalState={setModalState}
                  deleteElement={onClickDeleteFamily}
                />
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default FamilyMemberUpdate;
