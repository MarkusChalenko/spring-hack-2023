import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import UserNotFoundException from './exception/userNotFound';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findAll() {
    return this.userRepository.find();
  }

  async createUser(createUserDto: CreateUserDto) {
    const { password, ...restCreateUserDto } = createUserDto;

    const salt = bcrypt.genSaltSync(10);
    const hashedPasswrods = await bcrypt.hashSync(password, salt);

    try {
      const newUser = await this.userRepository.create({
        ...restCreateUserDto,
        password: hashedPasswrods,
      });
      await this.userRepository.save(newUser);
      return newUser;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          'A user with such an email address already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUser(id: number, updateUser: UpdateUserDto) {
    const user = await this.getById(id);
    const { ...restUpdateUser } = updateUser;

    const updatedUserData = {
      ...user,
      ...restUpdateUser,
    };

    await this.userRepository.save(updatedUserData);
  }

  async getByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email: email });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getById(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (user) {
      return user;
    }
    throw new UserNotFoundException(id);
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const salt = bcrypt.genSaltSync(10);
    const currentHashedRefreshToken = await bcrypt.hashSync(refreshToken, salt);
    await this.userRepository.update(userId, {
      refresh_token: currentHashedRefreshToken,
    });
  }

  async setCurrentRestorePasswordToken(
    restorePasswordToken: string,
    userId: number,
  ) {
    const salt = bcrypt.genSaltSync(10);
    const currentHashedRestorePasswordToken = await bcrypt.hashSync(
      restorePasswordToken,
      salt,
    );
    await this.userRepository.update(userId, {
      restore_password_token: currentHashedRestorePasswordToken,
    });
  }

  async removeRestorePasswordToken(userId: number) {
    return this.userRepository.update(userId, {
      restore_password_token: null,
    });
  }

  async removeRefreshToken(userId: number) {
    return this.userRepository.update(userId, {
      refresh_token: null,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.getById(userId);

    const isRefreshTokenMatching = await bcrypt.compareSync(
      refreshToken,
      user.refresh_token,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async getUserIfRestorePasswordTokenMatches(
    restorePassowrdToken: string,
    userId: number,
  ) {
    const user = await this.getById(userId);

    const isRestorePasswordTokenMatching = await bcrypt.compareSync(
      restorePassowrdToken,
      user.restore_password_token,
    );

    if (isRestorePasswordTokenMatching) {
      return user;
    }
  }

  async changePassword(userId: number, hashedPassword: string) {
    return await this.userRepository.update(
      { id: userId },
      {
        password: hashedPassword,
      },
    );
  }

  async markEmailAsConfirmed(email: string) {
    return this.userRepository.update(
      { email },
      {
        isEmailConfirmed: true,
      },
    );
  }

  async delete(id: number) {
    const deleteResponse = await this.userRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new UserNotFoundException(id);
    }
  }
}
