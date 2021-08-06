import {
  Body,
  Controller,
  Get,
  Post,
  Redirect,
  Req,
  Res,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PangkinOauth2AuthGuard } from './oauth2-auth.guard';
//import { LocalAuthGuard } from './local-auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @UseGuards(PangkinOauth2AuthGuard)
  @Get('login')
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(req.user, res);
  }

  @UseGuards(JwtAuthGuard)
  @Post('token')
  getProfile(@Req() req, @Res({ passthrough: true }) res: Response) {
    return this.authService.token(req.user, res);
  }

  @Get('logout')
  @Redirect(
    `http://localhost:5000/oauth2/logout?redirectUri=http://localhost`,
    302,
  )
  async logout(
    @Res({ passthrough: true }) res: Response,
    @Query('redirectUri') redirectUri,
  ) {
    this.authService.logout(res);
    return {
      url: `${process.env.SSOHOST}/oauth2/logout?redirectUri=${redirectUri}`,
    };
  }
}
