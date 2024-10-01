import { useEffect, useState } from 'react';
import { useFamilyStore } from '@/stores/familyStore';
import { useTreeStore } from '@/stores/treeStore';
import treeLv1 from '@/assets/tree_lv1.png';
import treeLv2 from '@/assets/tree_lv2.png';
import treeLv3 from '@/assets/tree_lv3.png';
import treeLv4 from '@/assets/tree_lv4.png';
import treeLv5 from '@/assets/tree_lv5.png';
import gameExplain from '@/assets/game_explain.png';
import '../../common/common.css';

import { useNavigate } from 'react-router-dom';

const FamilyTree = () => {
  const nav = useNavigate();
  const { selectedFamilyId } = useFamilyStore();
  const { treeData, fetchTreeData, updateTreeExp, familyId } = useTreeStore(
    (state) => ({
      treeData: state.treeData,
      fetchTreeData: state.fetchTreeData,
      updateTreeExp: state.updateTreeExp,
      setFamilyId: state.setFamilyId,
      familyId: state.familyId,
    }),
  );

  const [level, setLevel] = useState(1);
  // 새로 추가
  const [canClick, setCanClick] = useState(true);

  useEffect(() => {
    if (familyId !== null) {
      fetchTreeData(selectedFamilyId);
    }
  }, [fetchTreeData, selectedFamilyId]);

  useEffect(() => {
    if (treeData && treeData.result && treeData.result.exp != undefined) {
      const exp = treeData.result.exp;
      let calculatedLevel = 1;
      if (exp >= 800) {
        calculatedLevel = 5;
      } else if (exp >= 600) {
        calculatedLevel = 4;
      } else if (exp >= 400) {
        calculatedLevel = 3;
      } else if (exp >= 200) {
        calculatedLevel = 2;
      }
      setLevel(calculatedLevel);
    }
  }, [treeData]);

  useEffect(() => {
    const lastClick = localStorage.getItem('lastClickTime');
    if (lastClick) {
      const lastClickTimestamp = parseInt(lastClick, 10);
      const lastClickDate = new Date(lastClickTimestamp);
      const now = new Date();
      const diffDays = Math.floor(
        (now.getDate() - lastClickDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      setCanClick(diffDays >= 1);
    } else {
      setCanClick(true);
    }
  }, []);

  // 나무 클릭 시 출석
  const handleAddExperience = async () => {
    if (treeData && treeData.result && canClick) {
      await updateTreeExp(selectedFamilyId, 10);
      localStorage.setItem('lastClickTime', new Date().toString());
      setCanClick(false);
    }
  };

  // 나무 데이터가 없을 시 나무 클릭 시 가족방 만들기 이동
  const onClickFamilyButton = () => {
    nav('/family');
  };

  const treeImages: Record<number, string> = {
    1: treeLv1,
    2: treeLv2,
    3: treeLv3,
    4: treeLv4,
    5: treeLv5,
  };

  const treeImage = treeImages[level];

  // 나무 데이터를 찾지 못했을 때
  if (!treeData) {
    return (
      <div className="h-[576px]">
        <section>
          <div className="relative text-center" onClick={onClickFamilyButton}>
            <img
              src={treeImages[5]}
              alt="가족 유대감 나무"
              className="max-w-[400px] cursor-pointer opacity-70"
              style={{
                margin: '50px auto 15px',
              }}
            />
            <div
              className="absolute w-[300px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              style={{
                color: '#fff',
                fontSize: '2.5rem',
                fontWeight: 700,
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
              }}
            >
              가족을 만나보세요!
            </div>
            <div
              className="absolute w-[300px] top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              style={{ color: '#333', fontSize: '1.3rem', fontWeight: 700 }}
            >
              가족방 만들기 & 가족방 찾기
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="h-[576px] ">
      <section>
        <div className="tree-info-box">
          {/* <p>나무🌳를 키워 가족들이 보낸 편지💌를 열어보세요!</p> */}
          <p>생성일: {treeData.result.createTime}</p>
          <p>담긴 편지 수 : {treeData.result.letterCount}통</p>
        </div>

        <img
          src={treeImage}
          alt="가족 유대감 나무"
          className="max-w-[400px] cursor-pointer"
          style={{
            margin: '50px auto 15px',
          }}
          onClick={handleAddExperience}
        />
      </section>
      <section>
        <div className="flex align-center">
          <div
            className="mb-1 font-bold px-[10px]"
            style={{ color: '#333', fontSize: '1.2rem' }}
          >
            Lv.{level} {treeData.result.familyName} 나무
          </div>
          <div className="hover-container mt-1" id="hover-effect">
            <img src={gameExplain} alt="설명" className="w-[20px] h-auto" />
            <div className="hover-text-bottom">
              💌 가족 나무를 키우는 동안 편지를 보낼 수 있어요.
              <br />
              🌳 보낸 편지는 나무가 다 자라면 열어볼 수 있습니다.
              <br />❤ 나무는 가족들과의 여러 활동을 통해 키울 수 있어요.
            </div>
          </div>
        </div>
        <div className="w-full absolute text-center" style={{ color: '#fff' }}>
          {treeData.result.exp} EXP
        </div>

        <div className="w-full h-7 bg-gray-200 rounded-full dark:bg-gray-700">
          <div
            className="h-7 bg-blue-600 rounded-full dark:bg-blue-500 text-center font-semibold content-center"
            style={{
              width: `${treeData.result.exp / 10}%`,
              color: '#fff',
              background: '#FFBF33',
            }}
          ></div>
        </div>

        {/* <div></div> */}
      </section>
    </div>
  );
};

export default FamilyTree;
