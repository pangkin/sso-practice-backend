import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  InternalOAuthError,
  Strategy,
  StrategyOptions,
  VerifyFunction,
} from 'passport-oauth2';

import { AuthService } from './auth.service';

class PangkinOAuth2 extends Strategy {
  constructor(options: StrategyOptions, verify: VerifyFunction) {
    super(options, verify);
    this._oauth2.useAuthorizationHeaderforGET(true);
  }

  userProfile(accessToken, done) {
    this._oauth2.get(
      `${process.env.SSOHOST}/oauth2/me`,
      accessToken,
      (err, body) => {
        let json;

        if (err) {
          return done(
            new InternalOAuthError('failed to fetch user profile', err),
          );
        }

        if ('string' === typeof body) {
          try {
            json = JSON.parse(body);
          } catch (e) {
            done(e);
            return;
          }
        } else if ('object' === typeof body) {
          json = body;
        }
        console.log(json);
        const profile = {
          accountId: json.accountId,
          nickname: json.nickname,
          scope: json.scope,
          role: json.role,
          email: json.email,
          provider: this.name,
        };
        done(null, profile);
      },
    );
  }
}
@Injectable()
export class PangkinOAuth2Strategy extends PassportStrategy(
  PangkinOAuth2,
  'PangkinOauth2',
) {
  constructor(private authService: AuthService) {
    super({
      authorizationURL: `${process.env.SSOHOST}/oauth2/authorize`,
      tokenURL: `${process.env.SSOHOST}/oauth2/token`,
      clientID: process.env.CLIENTID,
      clientSecret: process.env.CLIENTSECRET,
      callbackURL: process.env.CALLBACK_URL,
    });
  }

  async validate(accessToken, refreshToken, profile) {
    const user = await this.authService.findOrCreate(
      profile,
      accessToken,
      refreshToken,
    );
    if (!user) throw new UnauthorizedException();
    else return user;
  }
}
