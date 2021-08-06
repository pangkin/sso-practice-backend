import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
//import { LocalStrategy } from './local.strategy';
import { UserModule } from '../user/user.module';
import { privateCert } from '../keys';
import { JwtStrategy } from './jwt.strategy';
import { PangkinOAuth2Strategy } from './oauth2.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      privateKey: privateCert,
      signOptions: {
        algorithm: 'RS256',
        issuer: 'pangkin',
        expiresIn: '1h',
      },
    }),
  ],
  providers: [
    AuthService,
    /*LocalStrategy,*/ JwtStrategy,
    PangkinOAuth2Strategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
