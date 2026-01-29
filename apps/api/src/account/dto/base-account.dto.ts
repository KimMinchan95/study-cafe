import { IsString, MinLength, MaxLength } from 'class-validator';

export class BaseAccountFieldsDto {
    @IsString()
    @MinLength(2)
    @MaxLength(30)
    name: string;

    @IsString()
    @MinLength(2)
    @MaxLength(30)
    displayName: string;
}
