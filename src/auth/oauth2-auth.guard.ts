import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class PangkinOauth2AuthGuard extends AuthGuard('PangkinOauth2') {}
