import { IsBoolean, IsString } from 'class-validator';
import { BlogEntity } from 'src/blogs/blog.entity';
import { BaseEntity } from 'src/common/entities/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column({ length: 20, comment: 'login', nullable: false })
  @IsString()
  login: string;

  @Column({ length: 20, comment: 'password', nullable: false })
  @IsString()
  password: string;

  @Column({ comment: 'active user', nullable: false, default: true })
  @IsBoolean()
  isActive: boolean;

  @OneToMany(() => BlogEntity, (blog) => blog.user)
  blogs: BlogEntity[];
}
