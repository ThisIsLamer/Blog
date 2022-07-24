import {
  Body,
  Controller,
  Headers,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BlogsService } from './blogs.service';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogService: BlogsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image1', maxCount: 1 },
      { name: 'image2', maxCount: 1 },
      { name: 'image3', maxCount: 1 },
      { name: 'image4', maxCount: 1 },
    ]),
  )
  async create(
    @Headers('Authorization') accessKey: string,
    @UploadedFiles() files,
    @Body('message') message: string,
  ) {
    return this.blogService.create(
      global.AUTHS[accessKey.split(' ')[1]],
      message,
      files,
    );
  }
}
