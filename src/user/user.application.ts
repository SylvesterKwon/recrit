import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { MikroORM } from '@mikro-orm/core';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { Transactional } from 'src/common/decorators/transactional.decorator';

@Injectable()
export class UserApplication {
  constructor(
    private orm: MikroORM,
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Transactional()
  async signIn(user: User) {
    return await this.authService.signIn(user);
  }

  @Transactional()
  async signUp(signUpDto: SignUpDto) {
    await this.userService.create(signUpDto);
  }
}
