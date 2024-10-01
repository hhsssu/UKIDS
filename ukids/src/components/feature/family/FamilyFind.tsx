import { useNavigate } from 'react-router-dom';
import '../user/user.css';
import BlueButton from '../../common/BlueButton';
import { useState } from 'react';
import { useFamilyStore } from '../../../stores/familyStore';

const FamilyFind = () => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const { findFamily, applyMember, family } = useFamilyStore();

  const nav = useNavigate();
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      // 이전 오류를 초기화
      setError('');

      // 가족방 찾기 시도
      await findFamily(code);

      // 찾은 가족방 정보 가져오기

      if (family.name === name) {
        // 이름과 코드가 일치하면 가족방 신청 처리
        await applyMember(family.familyId); // 역할 일단 none으로 지정.
        alert(`${name} 가족방에 가입 신청이 완료되었습니다.`);
        nav('/family');
      } else {
        // 일치하지 않으면 오류 메시지 표시
        setError('가족방 이름과 코드가 일치하지 않습니다.');
      }
    } catch (err: any) {
      // 가족방이 발견되지 않았을 경우 오류 처리
      setError('가족방을 찾을 수 없습니다. 코드를 확인하세요.');
    }
  };

  return (
    <div className="common-feature-box w-[1000px] h-[576px] my-0 mx-auto">
      <p className="big-title-style text-center text-[#FFBF33] my-14 pt-16">
        가족방 찾기
      </p>

      <form className="join-form w-[450px]" onSubmit={handleSubmit}>
        <div className="mb-7">
          {/* <label htmlFor="familyid">가족방 이름</label> */}
          <input
            type="text"
            id="familyname"
            value={name}
            placeholder="가족방 이름 입력"
            onChange={(e) => setName(e.target.value)}
            className="input-box px-5 py-7 font-semibold text-[#555555]"
          />
        </div>

        <div className="mb-7">
          {/* <label htmlFor="familycode">가족방 코드</label> */}
          <input
            type="text"
            id="familycode"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="초대 코드 입력"
            className="input-box px-5 py-7 font-semibold text-[#555555]"
          />
          <div className="pl-2 text-sm">
            <div className="text-[#F03F2F]">{error ? error : ''}</div>
          </div>
        </div>

        <div className="mx-auto my-5 w-1/2">
          <BlueButton name="가입신청" type="submit" path="" />
        </div>
      </form>
    </div>
  );
};

//////////////////////////////////////////////

const FamilyFindButton = () => {
  const nav = useNavigate();
  const onClickFamilyFindButton = () => {
    nav('find');
  };
  return (
    <button
      onClick={onClickFamilyFindButton}
      className="family-btn common-feature-box relative w-[400px] h-[480px] mt-11 flex items-center justify-center"
    >
      <div className="absolute z-10 mb-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="270"
          height="270"
          viewBox="0 0 185 185"
          fill="none"
        >
          <path
            d="M119.479 107.917H113.39L111.231 105.835C119.047 96.7706 123.342 85.1979 123.333 73.2292C123.333 63.3195 120.395 53.6324 114.889 45.3928C109.384 37.1532 101.559 30.7312 92.4032 26.939C83.2479 23.1467 73.1736 22.1545 63.4543 24.0878C53.7351 26.021 44.8074 30.793 37.8002 37.8002C30.793 44.8074 26.021 53.7351 24.0878 63.4543C22.1545 73.1736 23.1467 83.2479 26.939 92.4032C30.7312 101.559 37.1532 109.384 45.3928 114.889C53.6324 120.395 63.3195 123.333 73.2292 123.333C85.6396 123.333 97.0479 118.785 105.835 111.231L107.917 113.39V119.479L146.458 157.944L157.944 146.458L119.479 107.917ZM73.2292 107.917C54.0354 107.917 38.5417 92.4229 38.5417 73.2292C38.5417 54.0354 54.0354 38.5417 73.2292 38.5417C92.4229 38.5417 107.917 54.0354 107.917 73.2292C107.917 92.4229 92.4229 107.917 73.2292 107.917Z"
            fill="rgb(54, 213, 241)"
            fillOpacity="0.4"
          />
        </svg>
      </div>
      <div className="z-20 big-title-style mt-5">가족방 찾기</div>
    </button>
  );
};

export { FamilyFind, FamilyFindButton };
