import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccountModule } from '../account/account.module';
import { LocalStrategy } from './strategies/local.strategy';
import { SessionSerializer } from './serializers/session.serializer';
import { SessionGuard } from './guards/session.guard';
import { OwnerGuard } from './guards/owner.guard';
import { RedisModule } from '../redis';

@Module({
  imports: [
    forwardRef(() => AccountModule),
    PassportModule.register({ session: true }),
    RedisModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, SessionSerializer, SessionGuard, OwnerGuard],
  exports: [SessionGuard, OwnerGuard],
})
export class AuthModule { }
