import {
    IsEmail,
    MinLength,
    IsNotEmpty,
    IsString,
    MaxLength,
    Matches,
    Validate,
} from 'class-validator';
import { BaseAccountFieldsDto } from './base-account.dto';
import { ErrorCode } from '@repo/shared';
import { UniqueEmailConstraint } from '../validators/unique-email.validator';

export class CreateAccountDto extends BaseAccountFieldsDto {
    @IsNotEmpty()
    @IsEmail()
    @Validate(UniqueEmailConstraint)
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(30)
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]+$/, {
        message: ErrorCode.PASSWORD_MUST_CONTAIN_LETTER_AND_NUMBER,
    })
    password: string;
}
