import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from './DTO/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './DTO/update-user.dto';
import { ChangePasswordDto } from './DTO/change-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  // CREATE USER
  async create(createUserDto: CreateUserDto): Promise<User> {
    const {
      name,
      email,
      password,
      profileImage,
      mobile,
      address,
      company,
      department,
      designation,
      acceptedTerms,
    } = createUserDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
      profileImage,
      mobile,
      address,
      company,
      department,
      designation,
      acceptedTerms,
    });

    return this.usersRepository.save(user);
  }

  // FIND BY EMAIL
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  // FIND BY ID
  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
    });
  }

  // UPDATE RESET TOKEN
  async updateResetToken(
    userId: string,
    token: string,
    expiry: Date,
  ) {
    return this.usersRepository.update(userId, {
      resetPasswordToken: token,
      resetPasswordExpires: expiry,
    });
  }

  async findByResetToken(token: string) {
    return this.usersRepository.findOne({
      where: { resetPasswordToken: token },
    });
  }

  // UPDATE PASSWORD
  async updatePassword(userId: string, newPassword: string) {
    // const hashedPassword = await bcrypt.hash(newPassword, 10);

    return this.usersRepository.update(userId, {
      password: newPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { googleId },
    });
  }


  async createGoogleUser(data: any): Promise<User> {
    const user = this.usersRepository.create({
      email: data.email,
      name: data.name,
      profileImage: data.picture,
      password: null, // Google users don’t need password
    });

    return this.usersRepository.save(user);
  }




  async updateUser(
    id: string,
    updateDto: UpdateUserDto,
  ): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) return null;

    Object.assign(user, updateDto);

    return this.usersRepository.save(user);
  }

  async changePassword(
    id: string,
    dto: ChangePasswordDto,
  ): Promise<boolean> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 👉 Google user setting password first time
    if (!user.password) {
      console.log(`Google user ${user.email} is setting password first time`);
    }

    // 👉 Normal user → must verify current password
    if (user.password) {
      if (!dto.currentPassword) {
        throw new BadRequestException('Current password is required');
      }

      const match = await bcrypt.compare(dto.currentPassword, user.password);

      if (!match) {
        throw new BadRequestException('Current password is incorrect');
      }
    }

    const hashed = await bcrypt.hash(dto.newPassword, 10);
    user.password = hashed;

    await this.usersRepository.save(user);

    return true;
  }



}
