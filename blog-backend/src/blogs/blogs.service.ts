import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilesService } from 'src/files/files.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { BlogEntity } from './blog.entity';

@Injectable()
export class BlogsService {
  constructor(
    private readonly userService: UsersService,
    private readonly fileService: FilesService,

    @InjectRepository(BlogEntity)
    private readonly blogRepository: Repository<BlogEntity>,
  ) {}

  async findOneId(id: number): Promise<BlogEntity> {
    return this.blogRepository.findOne({ where: { id } });
  }

  async save(blog: BlogEntity): Promise<BlogEntity> {
    const loadedBlog = await this.findOneId(blog.id);
    if (blog.message) loadedBlog.message = blog.message;
    if (blog.files) loadedBlog.files = blog.files;

    return this.blogRepository.save(loadedBlog);
  }

  async create(userId: number, message: string, files) {
    const loadedUser = await this.userService.findOneId(userId);

    const loadedBlog = new BlogEntity();
    loadedBlog.message = message;
    loadedBlog.user = loadedUser;

    const blog = await this.save(loadedBlog);

    Object.keys(files).map((key) => {
      this.fileService.upload(files[key], blog);
    });
  }
}
