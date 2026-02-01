import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { AccountService } from '../account.service';
import { ErrorCode } from '@repo/shared';

@ValidatorConstraint({ name: 'uniqueEmail', async: true })
@Injectable()
export class UniqueEmailConstraint implements ValidatorConstraintInterface {
  constructor(private readonly accountService: AccountService) { }

  async validate(email: string): Promise<boolean> {
    if (!email) return true;
    const account = await this.accountService.findOneByEmail(email);
    return account === null;
  }

  defaultMessage(_args: ValidationArguments): string {
    return ErrorCode.EMAIL_ALREADY_EXISTS;
  }
}
