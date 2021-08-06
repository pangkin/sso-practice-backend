import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

import { publicCert } from '../keys/';

const cookieExtractor = (req: Request) => {
  let token = null;
  if (req.cookies && req.cookies['jwt']) {
    token = req.cookies['jwt'];
  }
  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private jwtService: JwtService) {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: publicCert,
      issuer: 'pangkin',
      algorithms: ['RS256'],
    });
  }
  async validate(payload: any) {
    const gap = payload.exp - Date.now() / 1000;
    if (gap < 20 * 60) {
      //토큰 만료 시간이 20분 아래인경우
      const newPayload = {
        nickname: payload.nickname,
        name: payload.name,
        role: payload.role,
        sub: payload.sub,
      };
      return {
        jwt: this.jwtService.sign(newPayload),
        _id: payload.sub,
        nickname: payload.nickname,
        name: payload.name,
        role: payload.role,
      };
    }
    return {
      _id: payload.sub,
      nickname: payload.nickname,
      name: payload.name,
      role: payload.role,
    };
  }
}
