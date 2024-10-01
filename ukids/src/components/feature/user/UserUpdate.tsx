import { useAuthStore } from '../../../stores/authStore';
import { useEffect, useState } from 'react';
import BlueButton from '../../common/BlueButton';

const UserUpdate = () => {
  const [form, setForm] = useState({
    // 구조분해할당
    id: '',
    password: '',
    confirmPassword: '',
    name: '',
    birthDate: '',
    email: '',
    phone: '',
    role: 'ROLE_USER',
  });

  const {
    userInfo,
    updateUser,
    getUserInfo,
    checkedEmail,
    checkedPhone,
    // deleteUser,
  } = useAuthStore();

  const [pwError, setPwError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [dateError, setDateError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const today = new Date().toISOString().split('T')[0]; // 오늘 날짜

  useEffect(() => {
    // 컴포넌트가 마운트되면 사용자 정보를 가져와서 폼을 초기화
    const fetchUserInfo = async () => {
      await getUserInfo();
    };

    fetchUserInfo();
  }, [getUserInfo]);

  useEffect(() => {
    if (userInfo) {
      // 사용자 정보를 폼 상태에 설정
      setForm({
        id: userInfo.id,
        password: '',
        confirmPassword: '',
        name: userInfo.name,
        birthDate: userInfo.birthDate,
        email: userInfo.email || '',
        phone: userInfo.phone || '',
        role: 'ROLE_USER',
      });
    }
  }, [userInfo]);

  const passwordCheckHandler = (password: string, confirmPassword: string) => {
    const passwordRegex = /^[a-z\d!@*&-_]{8,16}$/;
    if (password === '') {
      setPwError('비밀번호를 입력해주세요.');
      return false;
    } else if (!passwordRegex.test(password)) {
      setPwError(
        '비밀번호는 8~16자의 영소문자, 숫자, !@*&-_만 입력 가능합니다.',
      );
      return false;
    } else if (confirmPassword !== password) {
      setPwError('');
      setConfirmError('비밀번호가 일치하지 않습니다.');
      return false;
    } else {
      setPwError('');
      setConfirmError('');
      return true;
    }
  };

  const onChangePasswordHandler = (e: React.FormEvent<HTMLInputElement>) => {
    const { id, value } = e.currentTarget;
    setForm((prevForm) => ({
      ...prevForm,
      [id]: value, // name에 따라 password 또는 confirmPassword 업데이트
    }));
    if (id === 'password') {
      passwordCheckHandler(value, form.confirmPassword);
    } else {
      passwordCheckHandler(form.password, value);
    }
  };

  const onChangeNameHandler = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;

    if (!value.trim()) {
      setNameError('이름을 작성하세요.');
    } else {
      setNameError(''); // 이름이 입력되면 에러 메시지 초기화
    }

    setForm((prevForm) => ({
      ...prevForm,
      name: value,
    }));
  };

  const onChangeBirthDateHandler = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    const today = new Date();
    const birthDate = new Date(value);
    const isInvalidBirthDate = birthDate > today;

    // 생년월일 유효성 검사
    if (isInvalidBirthDate) {
      setDateError('생년월일이 오늘 이후의 날짜입니다. 다시 입력해 주세요.');
    } else {
      setDateError(''); // 에러가 없을 때는 에러 메시지 초기화
    }

    // 상태 업데이트
    setForm((prevForm) => ({
      ...prevForm,
      birthDate: value,
    }));
  };

  const onChangeEmailHandler = async (e: React.FormEvent<HTMLInputElement>) => {
    const emailValue = e.currentTarget.value;
    setForm({ ...form, email: emailValue });
    emailCheckHandler(emailValue);
  };

  const emailCheckHandler = async (email: string) => {
    const emailRegex = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
    if (email === '') {
      setEmailError('');
      return true;
    } else if (!emailRegex.test(email)) {
      setEmailError('이메일 형식으로 작성해 주세요. (ex. family01@ukids.com)');
      return false;
    }

    try {
      const responseData = await checkedEmail(email);
      if (responseData) {
        setEmailError('사용 가능한 이메일입니다.');
        return true;
      } else {
        setEmailError('이미 사용중인 이메일입니다.');
        return false;
      }
    } catch (error) {
      alert('서버 오류입니다. 관리자에게 문의하세요.');
      console.error(error);
      return false;
    }
  };

  const onChangePhoneHandler = async (e: React.FormEvent<HTMLInputElement>) => {
    const phoneValue = e.currentTarget.value;
    setForm({ ...form, phone: phoneValue });
    phoneCheckHandler(phoneValue);
  };

  const phoneCheckHandler = async (phone: string) => {
    const phoneRegex = /^\d{3}-\d{3,4}-\d{4}$/;
    if (phone === '') {
      setPhoneError('');
      return true;
    } else if (!phoneRegex.test(phone)) {
      setPhoneError(
        '하이픈(-)을 넣어 전화번호 형식으로 작성해 주세요.(ex. 010-1234-5678)',
      );
      return false;
    }

    try {
      const responseData = await checkedPhone(phone);
      if (responseData) {
        setPhoneError('사용 가능한 전화번호입니다.');
        return true;
      } else {
        setPhoneError('이미 사용중인 전화번호입니다.');
        return false;
      }
    } catch (error) {
      alert('서버 오류입니다. 관리자에게 문의하세요.');
      console.error(error);
      return false;
    }
  };

  // 회원 탈퇴
  // const onClickDeleteUser = async () => {
  //   if (userInfo?.userId) {
  //     try {
  //       await deleteUser();
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  // };

  /////////////////////////////////////////////////////////////

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault(); // 폼 제출 시 새로고침 되는 것을 방지

    // 비밀번호 확인
    const passwordCheckResult = passwordCheckHandler(
      form.password,
      form.confirmPassword,
    );
    if (passwordCheckResult) {
      setPwError('');
      setConfirmError('');
    } else return;

    // 업데이트할 사용자 데이터를 동적으로 생성
    const updateData: any = {
      id: form.id,
      name: form.name,
      birthDate: form.birthDate,
      email: form.email !== '' ? form.email : undefined,
      phone: form.phone !== '' ? form.phone : undefined,
      profileImage: '', // 프로필 이미지가 필요한 경우 추가 처리
    };

    // 사용자가 비밀번호를 입력한 경우에만 password 필드를 추가
    if (form.password) {
      updateData.password = form.password;
    }

    // 회원정보 수정 API 요청
    await updateUser(updateData);

    window.location.reload();
  };

  return (
    <>
      {/* 회원수정 박스 */}
      <div className="px-[100px]">
        <form onSubmit={handleUpdateUser} className="join-form w-[450px]">
          <section className="mb-4">
            <div className="flex justify-between items-center">
              <div className="w-28 text-end mr-2">
                <label htmlFor="id" className="text-[#555] font-bold">
                  아이디
                </label>
              </div>
              <input
                type="text"
                id="id"
                placeholder="아이디"
                value={form.id}
                readOnly
                className="input-box px-5 w-80 font-semibold text-[#555555] bg-[#eee]"
              />
            </div>
          </section>
          <section className="mb-4">
            <div className="flex justify-between items-center">
              <div className="w-28 text-end mr-2">
                <label htmlFor="password" className="text-[#555] font-bold">
                  비밀번호
                </label>
              </div>
              <input
                type="password"
                id="password"
                placeholder="비밀번호 입력"
                value={form.password}
                onChange={onChangePasswordHandler}
                className="input-box px-5 w-80 font-semibold text-[#555555]"
              />
            </div>
            <div className="pl-2 text-sm text-end">
              <p className="text-[#F03F2F]">{pwError ? pwError : ''}</p>
            </div>
          </section>
          <section className="mb-4">
            <div className="flex justify-between items-center">
              <div className="w-28 text-end mr-2">
                <label
                  htmlFor="confirm-password"
                  className="text-[#555] font-bold"
                >
                  비밀번호 확인
                </label>
              </div>
              <input
                type="password"
                id="confirmPassword"
                placeholder="비밀번호 확인"
                value={form.confirmPassword}
                onChange={onChangePasswordHandler}
                className="input-box px-5 w-80 font-semibold text-[#555555]"
              />
            </div>
            <div className="pl-2 text-sm text-end">
              <p className="text-[#F03F2F]">
                {confirmError ? confirmError : ''}
              </p>
            </div>
          </section>
          <section className="mb-4">
            <div className="flex justify-between items-center">
              <div className="w-28 text-end mr-2">
                <label htmlFor="name" className="text-[#555] font-bold">
                  이름
                </label>
              </div>
              <input
                type="text"
                id="name"
                placeholder="이름"
                value={form.name}
                onChange={onChangeNameHandler}
                className="input-box px-5 w-80 font-semibold text-[#555555]"
              />
            </div>
            <div className="pl-2 text-sm text-end">
              <p className="text-[#F03F2F]">{nameError ? nameError : ''}</p>
            </div>
          </section>
          <section className="mb-4">
            <div className="flex justify-between items-center">
              <div className="w-28 text-end mr-2">
                <label htmlFor="birth" className="text-[#555] font-bold">
                  생년월일
                </label>
              </div>
              <input
                type="date"
                id="birthDate"
                placeholder="생년월일"
                value={form.birthDate}
                max={today}
                onChange={onChangeBirthDateHandler}
                className="input-box px-5 w-80 font-semibold text-[#555555]"
              />
            </div>
            <div className="pl-2 text-sm text-end">
              <p className="text-[#F03F2F]">{dateError ? dateError : ''}</p>
            </div>
          </section>
          <section className="mb-4">
            <div className="flex justify-between items-center">
              <div className="w-28 text-end mr-2">
                <label className="text-[#555] font-bold">이메일</label>
              </div>
              <input
                type="email"
                id="email"
                placeholder="[선택] 이메일 주소 (비밀번호 찾기 등 본인 확인용)"
                value={form.email}
                onChange={onChangeEmailHandler}
                className="input-box px-5 w-80 font-semibold text-[#555555]"
              />
            </div>
            <div className="pl-2 text-sm text-end">
              <p className="text-[#F03F2F]">{emailError ? emailError : ''}</p>
            </div>
          </section>
          <section className="mb-4">
            <div className="flex justify-between items-center">
              <div className="w-28 text-end mr-2">
                <label htmlFor="phone" className="text-[#555] font-bold">
                  휴대전화번호
                </label>
              </div>
              <input
                type="text"
                id="phone"
                placeholder="[선택] 휴대전화번호"
                value={form.phone}
                onChange={onChangePhoneHandler}
                className="input-box px-5 w-80 font-semibold text-[#555555]"
              />
            </div>
            <div className="pl-2 text-sm text-end">
              <p className="text-[#F03F2F]">{phoneError ? phoneError : ''}</p>
            </div>
          </section>
          <div className="flex justify-center">
            <BlueButton name="수정 완료" type="submit" path="" />
          </div>
        </form>
        {/* <button className="common-btn red-btn" onClick={onClickDeleteUser}>
          회원 탈퇴
        </button> */}
      </div>
    </>
  );
};

export default UserUpdate;
