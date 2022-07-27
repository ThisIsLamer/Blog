import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { UserEntity } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(LocalAuthGuard)
  @Post('register')
  async registerUser(@Body() user: UserEntity) {
    return this.userService.create(user);
  }
}
