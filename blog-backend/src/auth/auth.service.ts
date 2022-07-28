import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { setTimeout } from 'timers/promises';
import { UserJWTTocken, ValidateUser } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(
    login: string,
    password: string,
  ): Promise<ValidateUser | null> {
    const user = await this.userService.findOneLoginPassword(login, password);
    if (user && user.password == password) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async verified(tocken: string): Promise<UserJWTTocken> {
    return this.jwtService.verify(tocken);
  }

  async login(user: any) {
    if (!user?.login) throw new UnauthorizedException();

    const validUser = await this.validateUser(user.login, user.password);
    if (validUser) {
      const payload = { login: validUser.login, id: validUser.id };
      const accessToken = this.jwtService.sign(payload);

      return { access_token: accessToken };
    }
    throw new UnauthorizedException();
  }
}
