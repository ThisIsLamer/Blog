import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from 'src/blogs/blog.entity';
import { MinioClientModule } from 'src/minio/minio.module';
import { FileEntity } from './file.entity';
import { FilesService } from './files.service';

@Module({
  imports: [
    MinioClientModule,
    TypeOrmModule.forFeature([FileEntity, BlogEntity]),
  ],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
