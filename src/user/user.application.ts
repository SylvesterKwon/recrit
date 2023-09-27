import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { MikroORM } from '@mikro-orm/core';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { Transactional } from 'src/common/decorators/transactional.decorator';
import { UserRepository } from './repositories/user.repository';
import { UserNotFoundException } from 'src/common/exceptions/user.exception';

@Injectable()
export class UserApplication {
  constructor(
    private orm: MikroORM,
    private userService: UserService,
    private authService: AuthService,
    private userRepository: UserRepository,
  ) {}

  @Transactional()
  async signIn(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new UserNotFoundException();

    return await this.authService.signIn(user);
  }

  @Transactional()
  async signUp(signUpDto: SignUpDto) {
    await this.userService.create(signUpDto);
  }

  @Transactional()
  async getUserProfile(username: string) {
    const user = await this.userRepository.findByUsername(username);
    if (!user) throw new UserNotFoundException();

    // TODO: Add profile visibility option and develop this logic
    const getUserProfileDto = {
      username: user.username,
      userId: user.id,
      createdAt: user.createdAt,
    };

    return getUserProfileDto;
  }
}
