import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { MikroORM } from '@mikro-orm/core';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { Transactional } from 'src/common/decorators/transactional.decorator';
import { UserRepository } from './repositories/user.repository';
import { UserNotFoundException } from 'src/common/exceptions/user.exception';
import { BaseApplication } from 'src/common/applications/base.applicaiton';
import { EventManagerService } from 'src/event-manager/event-manager.service';

@Injectable()
export class UserApplication extends BaseApplication {
  constructor(
    protected orm: MikroORM,
    protected eventManagerService: EventManagerService,
    private userService: UserService,
    private authService: AuthService,
    private userRepository: UserRepository,
  ) {
    super();
  }

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
