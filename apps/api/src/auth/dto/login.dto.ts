import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { ErrorCode, PASSWORD_PATTERN } from '@repo/shared';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(PASSWORD_PATTERN, {
    message: ErrorCode.PASSWORD_MUST_CONTAIN_LETTER_AND_NUMBER,
  })
  password: string;
}
