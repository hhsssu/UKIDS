import React from 'react';

const Footer: React.FC = () => {
  return (
    <div className="flexcenter-row text-xs text-[#999999] items-center mt-6">
      <a href="#!" className="m-1">
        이용약관
      </a>
      <span className="m-1">
        <div className="dash-box"></div>
      </span>
      <a href="#!" className="m-1">
        개인정보 처리방침
      </a>
    </div>
  );
};

export default Footer;
