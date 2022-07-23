import { IsDate, IsInt } from 'class-validator';
import { CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id', comment: 'Primary key' })
  @IsInt()
  id: number;

  @CreateDateColumn({ name: 'create_at', comment: 'Creae date' })
  @IsDate()
  createAt: Date;

  @CreateDateColumn({ name: 'update_at', comment: 'Update column' })
  @IsDate()
  updateAt: Date;
}
