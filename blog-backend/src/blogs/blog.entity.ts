import { IsString } from 'class-validator';
import { BaseEntity } from 'src/common/entities/core.entity';
import { FileEntity } from 'src/files/file.entity';
import { UserEntity } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity('blogs')
export class BlogEntity extends BaseEntity {
  @Column({
    type: 'text',
    comment: 'text for blog',
    nullable: false,
  })
  @IsString()
  message: string;

  @ManyToOne(() => UserEntity, (user) => user.blogs)
  user: UserEntity;

  @OneToMany(() => FileEntity, (file) => file.blog)
  files: FileEntity[];
}
