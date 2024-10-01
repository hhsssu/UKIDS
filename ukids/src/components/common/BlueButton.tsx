// 가족채팅방 연결하기 이미지 추가
import { useNavigate } from 'react-router-dom';
import './button.css';
import { useState } from 'react';

interface BlueButtonProps {
  name: string;
  path: string;
  className?: string;
  type?: string;
  // ?를 넣어주면 필수가 아닌 props
  data?: any;
  onClick?: () => void; // onClick 타입 정의 추가
}

const BlueButton = (props: BlueButtonProps) => {
  const navigate = useNavigate();
  const handleClick = () => {
    if (props.onClick) {
      props.onClick(); // onClick 함수 호출
    } else {
      navigate(props.path, {state: props.data});
    }
  };

  if (
    props.name == '로그인' ||
    props.name == '회원가입' ||
    props.name == '방 만들기' ||
    props.name == '가입신청'
  ) {
    return (
      <button onClick={handleClick} className="common-btn blue-btn login-btn">
        {props.name}
      </button>
    );
  } else {
    return (
      <button onClick={handleClick} className="common-btn blue-btn">
        {props.name}
      </button>
    );
  }
};

export default BlueButton;
