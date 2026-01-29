import { PartialType } from '@nestjs/mapped-types';
import { BaseAccountFieldsDto } from './base-account.dto';

export class UpdateAccountDto extends PartialType(BaseAccountFieldsDto) { }
