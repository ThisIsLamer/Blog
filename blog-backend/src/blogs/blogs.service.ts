import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilesService } from 'src/files/files.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import * as fs from 'fs';

import { BlogEntity } from './blog.entity';
import { IAppResponseDto } from 'src/files/dto';
import { FileEntity } from 'src/files/file.entity';

@Injectable()
export class BlogsService {
  constructor(
    private readonly userService: UsersService,
    private readonly fileService: FilesService,

    @InjectRepository(BlogEntity)
    private readonly blogRepository: Repository<BlogEntity>,
  ) {}

  private async createBlog(userId: number) {
    const loadedUser = await this.userService.findOneId(userId);

    const loadedBlog = new BlogEntity();
    loadedBlog.user = loadedUser;

    return await this.blogRepository.save(loadedBlog);
  }

  async findOneId(id: number): Promise<BlogEntity> {
    return this.blogRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<BlogEntity[]> {
    return await this.blogRepository.find({ relations: ['files', 'user'] });
  }

  async blogEdit(userId: number, blogId: number, message: string) {
    const user = await this.userService.findOneId(userId);
    const blog = await this.blogRepository.findOne({
      where: { id: blogId, user: user },
      relations: ['files', 'user'],
    });

    if (!blog) return 'This blog does not exist, or you are not its author';

    blog.message = message;
    this.blogRepository.save(blog);
    return blog;
  }

  async blogRemoveMedia(userId: number, blogId: number, mediaIds: number[]) {
    const user = await this.userService.findOneId(userId);
    const blog = await this.blogRepository.findOne({
      where: { id: blogId, user: user },
      relations: ['files'],
    });

    if (!blog) return 'This blog does not exist, or you are not its author';
    if (!blog?.files) return 'block has no attachments';

    const deleteFiles: FileEntity[] = [];
    for (const file of blog.files) {
      if (mediaIds.find((i) => i == file.id)) {
        deleteFiles.push(file);
      }
    }

    this.fileService.removeEntity(...deleteFiles).then(() => {
      deleteFiles.map((file) => {
        fs.unlinkSync(process.cwd() + '/' + file.path);
      });
    });
  }

  async blogDelete(userId: number, blogId: number) {
    const user = await this.userService.findOneId(userId);
    const blog = await this.blogRepository.findOne({
      where: { id: blogId, user },
      relations: ['files'],
    });

    if (!blog) return 'The blog is missing or you are not its author';

    await this.fileService.removeEntity(...blog.files);

    this.blogRepository.remove(blog).then(() => {
      blog.files.map((file) => {
        fs.unlinkSync(process.cwd() + '/' + file.path);
      });
    });
  }

  async save(blog: BlogEntity): Promise<BlogEntity> {
    const loadedBlog = await this.findOneId(blog.id);
    if (blog.message) loadedBlog.message = blog.message;
    if (blog.files) loadedBlog.files = blog.files;

    return this.blogRepository.save(loadedBlog);
  }

  async uploadFiles(request, response, userId) {
    //Check request is multipart
    if (!request.isMultipart()) {
      response.send(
        new BadRequestException(
          new IAppResponseDto(400, undefined, 'Request is not multipart'),
        ),
      );
      return;
    }

    const blog = await this.createBlog(userId);

    const mp = await request.multipart(async (...args) => {
      const hashedFilename = await this.fileService.uploadFile({
        field: args[0],
        file: args[1],
        filename: args[2],
        encoding: args[3],
        mimetype: args[4],
      });

      let file = new FileEntity();
      file.blog = blog;
      file.name = args[2];
      file.path = `uploads/${hashedFilename}`;
      file = await this.fileService.save(file);

      blog.files = [file];
    }, onEnd);
    // for key value pairs in request
    mp.on('field', function (key: any, value: any) {
      if (key === 'message') blog.message = value;
    });
    // Uploading finished
    async function onEnd(err: any) {
      if (err) {
        response.send(new HttpException('Internal server error', 500));
        return;
      }
      response
        .code(200)
        .send(
          new IAppResponseDto(200, undefined, 'Data uploaded successfully'),
        );
    }
    this.save(blog);
  }
}
