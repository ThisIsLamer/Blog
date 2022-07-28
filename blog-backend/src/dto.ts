import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty()
  login: string;

  @ApiProperty()
  password: string;
}

export class AuthResponseDto {
  @ApiProperty()
  access_tocken: string;
}
