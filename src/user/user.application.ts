import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { MikroORM, UseRequestContext } from '@mikro-orm/core';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';

@Injectable()
export class UserApplication {
  constructor(
    private orm: MikroORM,
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @UseRequestContext()
  async signIn(user: User) {
    return await this.orm.em.transactional(async () => {
      return await this.authService.signIn(user);
    });
  }

  @UseRequestContext()
  async signUp(signUpDto: SignUpDto) {
    await this.orm.em.transactional(async () => {
      await this.userService.create(signUpDto);
    });
  }
}
