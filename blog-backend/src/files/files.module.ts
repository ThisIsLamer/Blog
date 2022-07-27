import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from 'src/blogs/blog.entity';
import { FileEntity } from './file.entity';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity, BlogEntity])],
  providers: [FilesService],
  exports: [FilesService],
  controllers: [FilesController],
})
export class FilesModule {}
