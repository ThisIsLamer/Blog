import { IsNumber, IsString } from 'class-validator';
import { BlogEntity } from 'src/blogs/blog.entity';
import { BaseEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('files')
export class FileEntity extends BaseEntity {
  @Column({ length: 30, comment: 'file name', nullable: false })
  @IsString()
  name: string;

  @Column({ length: 256, comment: 'url to file', nullable: false })
  @IsString()
  url: string;

  @Column({ comment: 'file size', nullable: false })
  @IsNumber()
  size: number;

  @ManyToOne(() => BlogEntity, (blog) => blog.files)
  blog: BlogEntity;
}
