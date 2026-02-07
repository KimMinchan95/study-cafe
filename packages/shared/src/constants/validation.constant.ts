/** 비밀번호: 영문 1자 이상, 숫자 1자 이상, 허용 문자만 (8~30자 등 길이는 DTO에서 검증) */
export const PASSWORD_PATTERN: RegExp =
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]+$/;

export const EMAIL_PATTERN: RegExp =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
