import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  login: string;

  @ApiProperty()
  password: string;
}
