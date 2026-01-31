import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccountModule } from '../account/account.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [AccountModule, PassportModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
