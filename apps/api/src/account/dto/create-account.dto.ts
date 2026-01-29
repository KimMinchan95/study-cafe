import { IsEmail, MinLength, IsNotEmpty, IsString, MaxLength, Matches } from 'class-validator';
import { BaseAccountFieldsDto } from './base-account.dto';

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
        { message: 'PASSWORD_MUST_CONTAIN_LETTER_AND_NUMBER' }
    )
    password: string;
}
