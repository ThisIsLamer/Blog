import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { ValidateUser } from '../dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(
    login: string,
    password: string,
  ): Promise<ValidateUser | UnauthorizedException> {
    const user = await this.authService.validateUser(login, password);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
