import { IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  readonly id: string;

  @IsString()
  readonly role: string;
}
