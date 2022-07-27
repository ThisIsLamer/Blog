import { IsNumber, IsString } from 'class-validator';
import { BlogEntity } from 'src/blogs/blog.entity';
import { BaseEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('files')
export class FileEntity extends BaseEntity {
  @Column({ length: 256, comment: 'file name', nullable: false })
  @IsString()
  name: string;

  @Column({ length: 256, comment: 'path a file', nullable: false })
  @IsString()
  path: string;

  @ManyToOne(() => BlogEntity, (blog) => blog.files)
  blog: BlogEntity;
}
