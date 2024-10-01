import React, { useEffect, useState } from 'react';
import BlueButton from '../../common/BlueButton';
import { useFamilyStore } from '../../../stores/familyStore';

const FamilyUpdate = () => {
  const {
    selectedFamilyId,
    family,
    member,
    fetchMemberList,
    fetchFamilyInfo,
    updateFamily,
  } = useFamilyStore();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [representative, setRepresentative] = useState(0);

  useEffect(() => {
    if (selectedFamilyId) {
      fetchFamilyInfo(selectedFamilyId);
      fetchMemberList(selectedFamilyId);
    }
  }, [selectedFamilyId, fetchFamilyInfo, fetchMemberList]);

  useEffect(() => {
    if (family) {
      setName(family.name);
      setRepresentative(family.userFamilyDto.userId); // 초기 대표자 설정
    }
  }, [family]);

  const handleUpdateFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFamilyId !== null) {
      await updateFamily(selectedFamilyId, name, password, representative);
    } else {
      console.error('가족 ID 또는 대표자 ID가 설정되지 않았습니다.');
      console.log(representative);
    }
  };

  return (
    <>
      {/* 가족방 수정 박스 */}
      <div className="px-[100px]">
        <form onSubmit={handleUpdateFamily} className="join-form w-[450px]">
          <div className="h-[469px]">
            {family && (
              <>
                <section className="mb-6">
                  <div className="flex justify-between items-center">
                    <div className="text-end mr-2 w-28">
                      <label htmlFor="id" className="text-[#555] font-bold">
                        가족방 이름
                      </label>
                    </div>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-box px-5 w-80 font-semibold text-[#555555]"
                    />
                  </div>
                </section>
                <section className="mb-6">
                  <div className="flex justify-between items-center">
                    <div className="w-28 text-end mr-2">
                      <label htmlFor="code" className="text-[#555] font-bold">
                        초대코드
                      </label>
                    </div>
                    <input
                      type="text"
                      id="code"
                      value={family.code || ''}
                      readOnly
                      className="input-box px-5 w-80 font-semibold text-[#555555 bg-[#eee] draggable"
                    />
                  </div>
                </section>
                <section className="mb-6">
                  <div className="flex justify-between items-center">
                    <div className="w-28 text-end mr-2">
                      <label
                        htmlFor="password"
                        className="text-[#555] font-bold"
                      >
                        비밀번호
                      </label>
                    </div>
                    <input
                      type="password"
                      id="password"
                      placeholder="비밀번호"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-box px-5 w-80 font-semibold text-[#555555]"
                    />
                  </div>
                  <div className="text-end"></div>
                </section>
                <section className="mb-6">
                  <div className="flex justify-between items-center">
                    <div className="w-28 text-end mr-2">
                      <label
                        htmlFor="representative"
                        className="text-[#555] font-bold"
                      >
                        대표자
                      </label>
                    </div>
                    <select
                      name="representative"
                      id="representative"
                      key={representative}
                      value={representative}
                      onChange={(e) =>
                        setRepresentative(Number(e.target.value))
                      }
                      className="input-box px-5 w-80 font-semibold text-[#555555]"
                      // disabled={userInfo?.userId !== family.representative}
                    >
                      {member.map((m) => (
                        <option
                          key={m.userFamilyDto.userId}
                          value={m.userFamilyDto.userId}
                        >
                          {m.userFamilyDto.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="text-end"></div>
                </section>
              </>
            )}
          </div>
          <div className="flex justify-center">
            <BlueButton name="수정 완료" type="submit" path="" />
          </div>
        </form>
      </div>
    </>
  );
};

export default FamilyUpdate;
