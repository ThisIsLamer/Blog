import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { RegisterDto } from './dto';
import { UserEntity } from './user.entity';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiBody({
    description: 'User registration by entering login and password',
    type: RegisterDto,
  })
  @ApiOkResponse({ description: 'Registration result', type: 'string' })
  @UseGuards(LocalAuthGuard)
  @Post('register')
  async registerUser(@Body() user: UserEntity) {
    return this.userService.create(user);
  }
}
