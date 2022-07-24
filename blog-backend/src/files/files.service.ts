import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from 'src/blogs/blog.entity';
import { BlogsService } from 'src/blogs/blogs.service';
import { BufferedFile } from 'src/minio/dto';
import { MinioClientService } from 'src/minio/minio.service';
import { Repository } from 'typeorm';
import { FileEntity } from './file.entity';

@Injectable()
export class FilesService {
  constructor(
    private minioClientService: MinioClientService,

    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    @InjectRepository(BlogEntity)
    private readonly blogRepository: Repository<BlogEntity>,
  ) {}

  private async save(file: FileEntity): Promise<FileEntity> {
    return this.fileRepository.save(file);
  }

  async upload(file: BufferedFile, blog: BlogEntity) {
    const uploaded_file = await this.minioClientService.upload(file);

    const saveFile = new FileEntity();
    saveFile.name = file.originalname;
    saveFile.size = file.size;
    saveFile.url = uploaded_file.url;
    saveFile.blog = blog;

    blog.files = [...blog.files, saveFile];
    await this.blogRepository.save(blog);

    await this.save(saveFile);

    return {
      url: uploaded_file.url,
      code: uploaded_file.hashedFileName,
      name: file.originalname,
      size: file.size,
      message: 'Successfully uploaded to MinIO S3',
    };
  }
}
