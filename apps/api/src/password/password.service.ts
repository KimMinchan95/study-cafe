import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AppConfigService } from '../config';

@Injectable()
export class PasswordService {
  constructor(private readonly config: AppConfigService) { }

  async hash(plainPassword: string): Promise<string> {
    const saltRounds = this.config.bcryptSaltRounds;
    return bcrypt.hash(plainPassword, saltRounds);
  }

  async compare(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
