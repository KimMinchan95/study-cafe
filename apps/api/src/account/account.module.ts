import { forwardRef, Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { PrismaModule } from '../prisma';
import { PasswordModule } from '../password';
import { AuthModule } from '../auth/auth.module';
import { UniqueEmailConstraint } from './validators/unique-email.validator';

@Module({
  imports: [PrismaModule, PasswordModule, forwardRef(() => AuthModule)],
  controllers: [AccountController],
  providers: [AccountService, UniqueEmailConstraint],
  exports: [AccountService, UniqueEmailConstraint],
})
export class AccountModule { }
