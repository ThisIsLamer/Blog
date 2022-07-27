import {
  Controller,
  Post,
  Req,
  Res,
  Headers,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { BlogsService } from './blogs.service';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogService: BlogsService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Get('find')
  async findBlogs() {
    return this.blogService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload-files')
  async create(
    @Req() request,
    @Res() responce,
    @Headers('Authorization') jwtTocken: string,
  ) {
    const userId = (await this.authService.verified(jwtTocken.split(' ')[1]))
      .id;

    return this.blogService.uploadFiles(request, responce, userId);
  }
}
