import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findOneId(id: number): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findOneLoginPassword(
    login: string,
    password: string,
  ): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { login, password } });
  }
}
