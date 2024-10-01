import './common.css';

// 역할 태그 관련

interface CharacterTagProps {
  character: string;
}

const CharacterTag = (props: CharacterTagProps) => {
  if (props.character === 'ROLE_MOTHER') {
    return <div className="character-tag tag-mom">엄마</div>;
  } else if (props.character === 'ROLE_FATHER') {
    return <div className="character-tag tag-dad">아빠</div>;
  } else if (props.character === 'ROLE_DAUGHTER') {
    return <div className="character-tag tag-daughter">딸</div>;
  } else if (props.character === 'ROLE_SON') {
    return <div className="character-tag tag-son">아들</div>;
  } else if (props.character === 'ROLE_GRANDSON') {
    return <div className="character-tag tag-grand-child">손주</div>;
  } else if (props.character === 'ROLE_GRANDFATHER') {
    return <div className="character-tag">할아버지</div>;
  } else if (props.character === 'ROLE_GRANDMOTHER') {
    return <div className="character-tag">할머니</div>;
  } else {
    return <div className="character-tag bg-[#999]">없음</div>;
  }
};

export default CharacterTag;
