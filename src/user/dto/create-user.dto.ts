import { IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly nickname: string;

  @IsString()
  readonly password: string;

  @IsOptional()
  @IsString()
  readonly role: string;
}
