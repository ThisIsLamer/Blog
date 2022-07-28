import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { AuthDto, AuthResponseDto } from './dto';

@ApiTags('auth')
@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  @ApiBody({
    description: 'User authorization by login and password',
    type: AuthDto,
  })
  @ApiOkResponse({ description: 'Reply jwt token', type: AuthResponseDto })
  async login(@Body() user: AuthDto) {
    return this.authService.login(user);
  }
}
