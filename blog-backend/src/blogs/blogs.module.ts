import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from './blog.entity';
import { UsersModule } from 'src/users/users.module';
import { FilesModule } from 'src/files/files.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    FilesModule,
    TypeOrmModule.forFeature([BlogEntity]),
  ],
  providers: [BlogsService],
  controllers: [BlogsController],
  exports: [BlogsService],
})
export class BlogsModule {}
