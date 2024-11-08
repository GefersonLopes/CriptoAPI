import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async update(key_user: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { key_user } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return this.userRepository.save({ ...user, ...updateUserDto });
  }

  async remove(id: number) {
    return this.userRepository.delete(id);
  }
}
