import { IsEmail, MinLength, IsNotEmpty, IsString, MaxLength, Matches } from 'class-validator';
import { BaseAccountFieldsDto } from './base-account.dto';
import { ErrorCode } from '@repo/shared';

export class CreateAccountDto extends BaseAccountFieldsDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(30)
    @Matches(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]+$/,
        { message: ErrorCode.PASSWORD_MUST_CONTAIN_LETTER_AND_NUMBER }
    )
    password: string;
}
