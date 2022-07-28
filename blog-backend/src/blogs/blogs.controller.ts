import {
  Controller,
  Post,
  Headers,
  UseGuards,
  Get,
  Request,
  Response,
  Body,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { BlogsService } from './blogs.service';
import {
  BlogEditDto,
  BlogRemoveAttachments,
  DeletingBlog,
  FilesUploadDto,
} from './dto';

@ApiBearerAuth()
@ApiTags('blogs')
@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogService: BlogsService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Get()
  async findBlogs() {
    return this.blogService.findAll();
  }

  @ApiBody({
    description: 'Deleting a blog',
    type: DeletingBlog,
  })
  @Post('blog-delete')
  async blogDelete(
    @Headers('Authorization') jwtTocken: string,
    @Body('blogId') blogId: number,
  ) {
    const userId = (await this.authService.verified(jwtTocken.split(' ')[1]))
      .id;

    return this.blogService.blogDelete(userId, blogId);
  }

  @ApiBody({
    description: 'Deleting attachments',
    type: BlogRemoveAttachments,
  })
  @Post('delete-attachments')
  async deleteMedia(
    @Headers('Authorization') jwtTocken: string,
    @Body('blogId') blogId: number,
    @Body('mediaIds') mediaIds: number[],
  ) {
    const userId = (await this.authService.verified(jwtTocken.split(' ')[1]))
      .id;

    return this.blogService.blogRemoveMedia(userId, blogId, mediaIds);
  }

  @ApiBody({
    description: 'Create a new blog',
    type: BlogEditDto,
  })
  @Post('edit')
  async edit(
    @Headers('Authorization') jwtTocken: string,
    @Body('blogId') blogId: number,
    @Body('message') message: string,
  ) {
    const userId = (await this.authService.verified(jwtTocken.split(' ')[1]))
      .id;

    return await this.blogService.blogEdit(userId, blogId, message);
  }

  @ApiHeader({ name: 'Authorization', description: 'Bearer jwt tocken' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create a new blog',
    type: FilesUploadDto,
  })
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(
    @Headers('Authorization') jwtTocken: string,
    @Request() request,
    @Response() responce,
  ) {
    const userId = (await this.authService.verified(jwtTocken.split(' ')[1]))
      .id;

    return this.blogService.uploadFiles(request, responce, userId);
  }
}
