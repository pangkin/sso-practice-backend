import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
//import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import axios from 'axios';

import { ExpressUser } from 'src/schemas/user.schema';
import { CreateUserDto } from '../user/dto/create-user.dto';

import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}
  /*
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { _id, username, role } = user;
      return { _id, username, role };
    }
    return null;
  }
*/
  async token(user: ExpressUser, res: Response) {
    const userDoc = await this.usersService.findByNickname(user.nickname);
    if (!userDoc) {
      return res.status(401);
    }
    let resUser;
    try {
      const { data } = await axios.get(`${process.env.SSOHOST}/oauth2/me`, {
        headers: {
          Authorization: `Bearer ${userDoc.accessToken}`,
        },
      });
      resUser = data;
    } catch (e) {
      const { data: tokens } = await axios.post(
        `${process.env.SSOHOST}/oauth2/token`,
        {
          grant_type: 'refresh_token',
          client_id: process.env.CLIENTID,
          client_secret: process.env.CLIENTSECRET,
          refresh_token: userDoc.refreshToken,
        },
      );
      userDoc.accessToken = tokens.access_token;
      userDoc.refreshToken = tokens.refresh_token;
      await userDoc.save();
      const { data } = await axios.get(`${process.env.SSOHOST}/oauth2/me`, {
        headers: {
          Authorization: `Bearer ${userDoc.accessToken}`,
        },
      });
      resUser = data;
    }
    if (user?.jwt) {
      res.cookie('jwt', user.jwt, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
      });
      delete user.jwt;
    }
    return {
      accountId: resUser.accountId,
      nickname: resUser.nickname,
      email: resUser.email,
      role: resUser.role,
    };
  }

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    await this.usersService.newUser(createUserDto);
    return { success: true };
  }

  async login(user: ExpressUser, res: Response) {
    const payload = {
      nickname: user.nickname,
      email: user.email,
      role: user.role,
      sub: user.accountId,
    };
    res.cookie('jwt', this.jwtService.sign(payload), {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
    });
    return {
      nickname: user.nickname,
      email: user.email,
      role: user.role,
      accountId: user.accountId,
    };
  }

  async logout(res: Response) {
    res.clearCookie('jwt');
  }

  async findOrCreate(profile: any, accessToken: string, refreshToken: string) {
    return this.usersService.findOrCreate(profile, accessToken, refreshToken);
  }
}
